import type { APIRoute } from "astro";
import { stripe } from "../../lib/stripe";
import { anonClient } from "../../lib/supabase";
import { findClassBySlug } from "../../lib/data";
import { hitOrReject } from "../../lib/rate-limit";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const rl = hitOrReject(ip);
  if (!rl.ok) {
    return new Response(JSON.stringify({ error: "Too many requests — please wait a minute and try again." }), {
      status: 429,
      headers: { "Retry-After": String(rl.retryAfterSec), "Content-Type": "application/json" },
    });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
  }

  // HONEYPOT — fake success so bots don't learn
  if (body.website) {
    return new Response(JSON.stringify({ ok: true, url: "/checkout/cancel" }), { status: 200 });
  }

  // TIMING
  const age = Date.now() - Number(body.renderedAt ?? 0);
  if (age < 1500 || age > 24 * 60 * 60 * 1000) {
    return new Response(JSON.stringify({ error: "Form expired — please reload the page and try again." }), { status: 400 });
  }

  const class_slug = String(body.class_slug ?? "").trim();
  const session_id = String(body.session_id ?? "").trim();
  const customer_name = String(body.customer_name ?? "").trim();
  const customer_email = String(body.customer_email ?? "").trim().toLowerCase();
  const customer_phone = String(body.customer_phone ?? "").trim();
  const notes = String(body.notes ?? "").trim().slice(0, 1000);
  const instructor_name = String(body.instructor_name ?? "").trim();
  const session_starts_at = String(body.session_starts_at ?? "").trim();
  const session_ends_at = String(body.session_ends_at ?? "").trim();

  if (!class_slug || !session_id || !customer_name || !customer_email) {
    return new Response(JSON.stringify({ error: "Please fill in all required fields and pick a class time." }), { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
    return new Response(JSON.stringify({ error: "Please enter a valid email address." }), { status: 400 });
  }

  // NEVER trust client-supplied price — look up the class in Supabase first,
  // fall back to the shipped class catalogue if Supabase isn't configured yet.
  let priceCents: number | undefined;
  let className = String(body.class_name ?? "").trim();
  let currency = "usd";

  const sb = anonClient();
  if (sb) {
    const { data } = await sb.from("classes").select("name, price_cents, currency").eq("slug", class_slug).maybeSingle();
    if (data) {
      priceCents = data.price_cents;
      className = data.name;
      currency = (data.currency ?? "usd").toLowerCase();
    }
  }
  if (priceCents === undefined) {
    const fallback = findClassBySlug(class_slug);
    if (!fallback) {
      return new Response(JSON.stringify({ error: "That class could not be found." }), { status: 400 });
    }
    priceCents = fallback.price_cents;
    className = fallback.name;
  }

  const startsLabel = session_starts_at
    ? new Date(session_starts_at).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
    : "";

  const origin =
    import.meta.env.PUBLIC_SITE_URL ??
    `${request.headers.get("x-forwarded-proto") ?? "https"}://${request.headers.get("x-forwarded-host") ?? request.headers.get("host")}`;

  try {
    const checkoutSession = await stripe().checkout.sessions.create({
      mode: "payment",
      customer_email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: priceCents,
            product_data: {
              name: className,
              description: `${startsLabel ? `${startsLabel} — ` : ""}${instructor_name ? `with ${instructor_name}` : "Core & Flow Pilates Studio"}`.slice(0, 300),
            },
          },
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        class_slug,
        session_id,
        class_name: className,
        instructor_name,
        session_starts_at,
        session_ends_at,
        customer_name,
        customer_phone,
        notes: notes.slice(0, 400),
      },
    });

    return new Response(JSON.stringify({ url: checkoutSession.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? "Payment setup failed. Please try again." }), { status: 500 });
  }
};
