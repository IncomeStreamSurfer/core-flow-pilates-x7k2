const BRAND_NAME = "Core & Flow Pilates Studio";
const BRAND_ACCENT = "#bd5a34";
const SITE_URL = (import.meta.env.PUBLIC_SITE_URL ?? process.env.PUBLIC_SITE_URL ?? "").replace(/\/$/, "");

function layout(content: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body { margin:0; padding:0; background:#faf6f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif; color:#2b2622; }
  .preheader { display:none !important; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; }
  .container { max-width:560px; margin:0 auto; padding:32px 24px; }
  .card { background:#fff; border:1px solid #e6ddd0; border-radius:12px; padding:32px; }
  h1 { font-family: Georgia, 'Times New Roman', serif; font-size:28px; line-height:1.2; margin:0 0 16px; letter-spacing:-0.01em; }
  p { font-size:15px; line-height:1.6; margin:0 0 16px; color:#3a3530; }
  .btn { display:inline-block; background:${BRAND_ACCENT}; color:#fff !important; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:600; }
  .muted { color:#8a8078; font-size:13px; line-height:1.5; }
  .dot { display:inline-block; width:8px; height:8px; border-radius:50%; background:${BRAND_ACCENT}; margin-right:8px; vertical-align:middle; }
  a { color: ${BRAND_ACCENT}; }
</style></head><body>
<span class="preheader">${preheader}</span>
<div class="container">
  <div style="margin-bottom:24px;"><span class="dot"></span><strong style="font-size:18px;">${BRAND_NAME}</strong></div>
  <div class="card">${content}</div>
  <p class="muted" style="text-align:center; margin-top:24px;">
    <a href="${SITE_URL}">${SITE_URL.replace(/^https?:\/\//, "")}</a>
  </p>
</div>
</body></html>`;
}

export function bookingConfirmationHtml({
  className,
  instructorName,
  sessionDate,
  sessionTime,
  amount,
  currency,
  bookingRef,
}: {
  className: string;
  instructorName: string;
  sessionDate: string;
  sessionTime: string;
  amount: string;
  currency: string;
  bookingRef: string;
}) {
  return layout(
    `
    <h1>You're booked!</h1>
    <p>See you on the mat &mdash; here are your class details:</p>
    <p>
      <strong>Class:</strong> ${className}<br />
      <strong>Instructor:</strong> ${instructorName}<br />
      <strong>When:</strong> ${sessionDate} at ${sessionTime}<br />
      <strong>Paid:</strong> ${currency} ${amount}<br />
      <strong>Booking ref:</strong> ${bookingRef}
    </p>
    <p>Arrive 10 minutes early for reformer classes so your instructor can set up your springs. Bring grip socks &mdash; we have a few pairs for sale at the front desk if you forget.</p>
    <p class="muted">Need to reschedule? Reply to this email or call us at (512) 555-0148 at least 6 hours before class.</p>
  `,
    `Booking confirmed: ${className} on ${sessionDate}`
  );
}

export function contactAckHtml({ name }: { name: string }) {
  return layout(
    `
    <h1>Got your message</h1>
    <p>Hey ${name} &mdash; thanks for reaching out to Core & Flow. We read every message and reply within 1 business day.</p>
  `,
    "We got your message"
  );
}
