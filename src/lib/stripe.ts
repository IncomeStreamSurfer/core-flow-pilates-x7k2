import Stripe from "stripe";

let _stripe: Stripe | null = null;

/** Lazily-constructed Stripe client. Returns null if the secret key
 *  isn't configured yet so callers can degrade gracefully. */
export function stripe(): Stripe {
  if (_stripe) return _stripe;
  const key = import.meta.env.STRIPE_SECRET_KEY ?? process.env.STRIPE_SECRET_KEY ?? "";
  _stripe = new Stripe(key, { apiVersion: "2024-06-20" as any });
  return _stripe;
}

export function stripeConfigured(): boolean {
  return Boolean(import.meta.env.STRIPE_SECRET_KEY ?? process.env.STRIPE_SECRET_KEY ?? "");
}
