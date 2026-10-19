# Courtiva HitPay Backend

A small, standalone Node/Express app that handles HitPay checkout for
the Courtiva site. Deployable to any Node host — Render, Railway, a
VPS, GoDaddy's Node.js Hosting, Fly.io, etc. See the main project's
[`SETUP.md`](../SETUP.md) for the full deployment walkthrough.

## Run it locally

```bash
cd backend
npm install
cp .env.example .env   # then fill in real values
npm start
```

Visiting `http://localhost:3001` should show "Courtiva HitPay backend
is running."

## What's in here

- `server.js` — the whole app: two routes,
  `POST /api/hitpay-create-payment` (creates a HitPay payment request,
  recomputing the real total server-side from `products.json` — never
  trusting a price the browser sends) and
  `POST /api/hitpay-webhook` (verifies and logs each completed
  payment — see the big comment in that route for the one honest gap
  this project still has: nothing persists an order anywhere
  permanent yet).
- `products.json` — the price catalog this backend checks every order
  against, keyed by each product's folder id (not its display name —
  a few products share a name). Keep this in sync with
  `media/products/` in the main project whenever you add/edit/remove
  a product, or checkout will reject it or charge the wrong amount.
- `.env.example` — every environment variable this app needs, with
  notes on where each one comes from.

## Why this isn't a Netlify Function anymore

This used to run as a Netlify Function, tied to whatever host ran the
static site. It's now a plain Express app instead, so it can run on
literally any Node host, independent of wherever the static site ends
up.
