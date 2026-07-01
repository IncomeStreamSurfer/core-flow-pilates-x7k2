import type { APIRoute } from "astro";
import { anonClient } from "../lib/supabase";
import { CLASS_TYPES, INSTRUCTORS } from "../lib/data";

export const prerender = false;

export const GET: APIRoute = async () => {
  const SITE = (import.meta.env.PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  const sb = anonClient();

  let pages: any[] = [];
  if (sb) {
    const { data } = await sb.from("pages").select("slug, title, meta_description").not("published_at", "is", null);
    pages = data ?? [];
  }

  const lines: string[] = [];
  lines.push(`# Core & Flow Pilates Studio`);
  lines.push("");
  lines.push(`> Boutique reformer and mat Pilates studio in Austin, TX offering expert-led classes, private sessions, and easy online booking for all levels.`);
  lines.push("");
  lines.push("## Key pages");
  lines.push("");
  lines.push(`- [Home](${SITE}/): Reformer, mat, and prenatal Pilates classes in Austin with online booking.`);
  lines.push(`- [Classes](${SITE}/classes): Overview of all class formats offered at the studio.`);
  lines.push(`- [Instructors](${SITE}/instructors): Certified Pilates instructor bios and specialties.`);
  lines.push(`- [Schedule](${SITE}/schedule): Live weekly class schedule with online booking.`);
  lines.push(`- [Pricing](${SITE}/pricing): Per-class rates and class packages.`);
  lines.push(`- [Book a class](${SITE}/book): Secure Stripe-powered booking flow.`);
  lines.push(`- [About](${SITE}/about): The studio's story and philosophy.`);
  lines.push(`- [Contact](${SITE}/contact): Studio address, phone, and contact form.`);
  for (const p of pages) {
    if (["home", "about"].includes(p.slug)) continue;
    lines.push(`- [${p.title}](${SITE}/${p.slug}): ${p.meta_description ?? ""}`);
  }

  lines.push("");
  lines.push("## Class formats");
  lines.push("");
  for (const c of CLASS_TYPES) {
    lines.push(`- [${c.name}](${SITE}/classes/${c.slug}): ${c.short_description}`);
  }

  lines.push("");
  lines.push("## Instructors");
  lines.push("");
  for (const i of INSTRUCTORS) {
    lines.push(`- [${i.name}](${SITE}/instructors/${i.slug}): ${i.role}. ${i.short_bio}`);
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
