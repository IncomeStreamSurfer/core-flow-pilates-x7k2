import type { APIRoute } from "astro";
import { stripe } from "../../../lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { sendBookingConfirmation } from "../../../lib/email";

export const prerender = false;

const WEBHOOK_SECRET = import.meta.env.STRIPE_WEBHOOK_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET ?? "";
const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL ?? "";
const SERVICE_ROLE = import.meta.env.SUPABASE_SERVICE_ROLE ?? process.env.SUPABASE_SERVICE_ROLE ?? "";

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

export const POST: APIRoute = async ({ request }) => {
  const sig = request.headers.get("stripe-signature");
  if (!sig) return new Response("no sig", { status: 400 });

  const rawBody = await request.text();
  let event: any;
  try {
    event = await stripe().webhooks.constructEventAsync(rawBody, sig, WEBHOOK_SECRET);
  } catch (err: any) {
    return new Response(`invalid sig: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    const md = s.metadata ?? {};

    if (SUPABASE_URL && SERVICE_ROLE) {
      const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

      let classId: string | null = null;
      if (md.class_slug) {
        const { data: cls } = await sb.from("classes").select("id").eq("slug", md.class_slug).maybeSingle();
        classId = cls?.id ?? null;
      }

      const bookingRef = s.id.slice(-10).toUpperCase();
      const isRealSession = md.session_id && isUuid(md.session_id);

      await sb.from("bookings").insert({
        stripe_session_id: s.id,
        class_session_id: isRealSession ? md.session_id : null,
        class_id: classId,
        class_name: md.class_name ?? null,
        instructor_name: md.instructor_name ?? null,
        session_starts_at: md.session_starts_at || null,
        session_ends_at: md.session_ends_at || null,
        customer_name: md.customer_name ?? s.customer_details?.name ?? null,
        customer_email: s.customer_details?.email ?? s.customer_email ?? null,
        customer_phone: md.customer_phone ?? null,
        amount_total_cents: s.amount_total ?? 0,
        currency: s.currency,
        status: "paid",
        booking_ref: bookingRef,
        notes: md.notes ?? null,
      });

      if (isRealSession) {
        const { data: sessionRow } = await sb.from("class_sessions").select("booked_count").eq("id", md.session_id).maybeSingle();
        if (sessionRow) {
          await sb.from("class_sessions").update({ booked_count: (sessionRow.booked_count ?? 0) + 1 }).eq("id", md.session_id);
        }
      }

      const email = s.customer_details?.email ?? s.customer_email;
      if (email) {
        const startsAt = md.session_starts_at ? new Date(md.session_starts_at) : null;
        await sendBookingConfirmation({
          to: email,
          className: md.class_name ?? "Your class",
          instructorName: md.instructor_name ?? "your instructor",
          sessionDate: startsAt ? startsAt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "your booked time",
          sessionTime: startsAt ? startsAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "",
          amount: ((s.amount_total ?? 0) / 100).toFixed(2),
          currency: (s.currency ?? "usd").toUpperCase(),
          bookingRef,
        });
      }
    }
  }

  return new Response("ok", { status: 200 });
};
