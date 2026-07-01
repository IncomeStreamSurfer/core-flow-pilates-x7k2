import type { APIRoute } from "astro";
import { CLASS_TYPES, INSTRUCTORS } from "../lib/data";

export const prerender = false;

export const GET: APIRoute = async () => {
  const SITE = (import.meta.env.PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  const sections: string[] = [];

  sections.push(`# Core & Flow Pilates Studio\n\nBoutique reformer and mat Pilates studio in Austin, TX. Strengthen. Stretch. Shine.\n`);

  for (const c of CLASS_TYPES) {
    sections.push(`# ${c.name}\n\n${c.description}\n\nDuration: ${c.duration_minutes} minutes. Price: $${(c.price_cents / 100).toFixed(0)}. Level: ${c.level}.\nBook: ${SITE}/classes/${c.slug}\n`);
  }

  for (const i of INSTRUCTORS) {
    sections.push(`# ${i.name} — ${i.role}\n\n${i.bio}\n\nSpecialties: ${i.specialties.join(", ")}\nCertifications: ${i.certifications.join(", ")}\nProfile: ${SITE}/instructors/${i.slug}\n`);
  }

  return new Response(sections.join("\n---\n\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
