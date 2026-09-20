# Going Live + PayPal Integration Checklist

This document covers everything needed to take Courtiva from a static demo
site to a live site that can accept real PayPal payments.

**Update: the backend for this has already been built** — see
`netlify/functions/`, `netlify.toml`, and `.env.example`. Follow
[`SETUP.md`](./SETUP.md) for the exact step-by-step to deploy it and
connect your own PayPal credentials.

---

## The One Thing That Changes Everything: You Need a Backend

A backend you control (not just front-end code) is what makes checkout
trustworthy — it independently re-checks every price against
`netlify/functions/products.json` rather than trusting whatever the
browser sends. This is why `create-order.js` and `capture-order.js`
exist as separate server-side files instead of everything living in
`script.js`.

Products are matched by their unique **id** (their folder name in
`media/products/`), not by display name — a few products in this catalog
share a name (e.g. "Aurelia" is both a $200 item and a separate $140
item), so name alone isn't a safe way to tell them apart for billing
purposes.

---

## Hosting & Domain

| Need | Options |
|---|---|
| Static + serverless functions together | Netlify (what this project is set up for), Vercel, Cloudflare Pages |
| Domain name | Any registrar |
| HTTPS | Free and automatic on Netlify |

---

## PayPal-Side Setup

1. Create a **PayPal Business account** (not personal).
2. Go to [developer.paypal.com](https://developer.paypal.com) → Dashboard
   → create an **App** under the **Sandbox** tab first. This gives you a
   **Client ID** (safe in front-end code) and a **Client Secret** (never
   exposed — backend only).
3. Test everything against Sandbox before ever touching Live credentials.

---

## Legal / Policy Pages

Needed regardless of payment provider: Privacy Policy, Terms of Service,
Refund/Return Policy, Shipping Policy. Your footer has placeholder links
for several of these that currently go nowhere.

---

## Security Checklist

- [ ] `PAYPAL_CLIENT_SECRET` lives only in Netlify's environment
      variables, never in a file sent to the browser
- [ ] All prices are checked server-side at checkout (already true —
      `create-order.js` recomputes the total from `products.json`)
- [ ] HTTPS enforced everywhere (automatic on Netlify)
- [ ] `.env` is in `.gitignore` and never committed

---

## Testing Plan

1. Build/test the whole flow against PayPal **Sandbox** first — a
   successful payment, a cancelled payment, and a failed payment.
2. Only switch to **Live** credentials after all of the above pass.
3. Do one small real transaction yourself before announcing launch.

---

## Nice-to-Haves (not required to go live)

- Order confirmation emails (SendGrid, Postmark, Resend)
- A simple order-history database
- Real inventory tracking (currently every product always shows "In Stock" on the wishlist page)
- Real customer reviews (currently always honestly shows "0")
