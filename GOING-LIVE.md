# Going Live Checklist

This document covers everything needed to take Courtiva from a static
demo site to a live site that can accept real HitPay payments.

**Update: this has already been built** — see `backend/` for the
payment backend and [`SETUP.md`](./SETUP.md) for the exact step-by-step
to deploy both pieces and connect your own HitPay credentials.

---

## Two Pieces, Deployed Separately

This project is split into:
- **The static site** — `index.html`, `style.css`, `script.js`,
  `media/`. Just files; any static host works.
- **The HitPay backend** — `backend/`. Real server code, so it needs
  an actual Node host (not a static one).

They're independent on purpose: you can redeploy the site without
touching the backend, swap which host runs the backend without
touching the site, and so on.

## Why a Backend Exists At All

A backend you control is what makes checkout trustworthy — it
independently re-checks every price against `backend/products.json`
rather than trusting whatever the browser sends. This is why
`backend/server.js` exists as a separate server-side app instead of
everything living in `script.js`.

Products are matched by their unique **id** (their folder name in
`media/products/`), not by display name — a few products in this
catalog share a name (e.g. "Aurelia" is both a $200 item and a
separate $140 item), so name alone isn't a safe way to tell them apart
for billing purposes.

---

## Hosting

| Need | Options |
|---|---|
| Static site | Netlify, Vercel, GitHub Pages, GoDaddy Web Hosting, S3 |
| Node backend | Render, Railway, Fly.io, a VPS, GoDaddy's Node.js Hosting |
| Domain name | Any registrar |
| HTTPS | Usually free/automatic on the hosts above |

## HitPay-Side Setup

1. Sign up at [hitpayapp.com](https://www.hitpayapp.com) (a real
   business account, not a personal one).
2. Dashboard → **Settings → Payment Gateway → API Keys** → get your
   **Sandbox** API key and Salt first. Test everything against Sandbox
   before ever touching Live credentials.

## Legal / Policy Pages

Needed regardless of payment provider: Privacy Policy, Terms of
Service, Refund/Return Policy, Shipping Policy. Your footer links to
several of these already.

## Security Checklist

- [ ] `HITPAY_API_KEY` and `HITPAY_SALT` live only in your backend
      host's environment variables, never in a file sent to the browser
- [ ] All prices are checked server-side at checkout (already true —
      `backend/server.js` recomputes the total from `products.json`)
- [ ] `ALLOWED_ORIGIN` on the backend is set to your real site's exact
      URL, not left as `*` (that's fine for local testing only)
- [ ] HTTPS enforced everywhere (usually automatic on the hosts above)
- [ ] `.env` is in `.gitignore` and never committed

## Testing Plan

1. Build/test the whole flow against HitPay **Sandbox** first — a
   successful payment, a cancelled payment, and a failed payment.
2. Confirm the webhook actually fires and logs on your backend host —
   not just that the shopper lands back on your site afterward.
3. Only switch to **Live** credentials after all of the above pass.
4. Do one small real transaction yourself before announcing launch.

## Nice-to-Haves (not required to go live)

- A real database or order-storage system — see `backend/server.js`'s
  webhook handler and SETUP.md, "What This Project Still Doesn't Do."
  The Excel order/inventory tracker delivered separately is a manual
  stand-in until then.
- Order confirmation emails (SendGrid, Postmark, Resend)
- Real inventory tracking tied to the site itself (currently every
  product always shows "In Stock" on the wishlist page)
- Real customer reviews (currently always honestly shows "0")
