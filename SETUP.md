# Setup Guide: Deploy the Site + the HitPay Backend

This project is now two separate pieces that get deployed independently:

1. **The site itself** (`index.html`, `style.css`, `script.js`, `media/`) —
   plain static files. Host these anywhere that serves static files:
   Netlify, Vercel, GitHub Pages, GoDaddy Web Hosting, S3, etc.
2. **The HitPay backend** (the `backend/` folder) — a small Node/Express
   app that needs an actual Node host, since it runs real server code
   (not just files): Render, Railway, a VPS, GoDaddy's Node.js Hosting,
   Fly.io, etc.

They talk to each other over the internet (the site calls the backend's
URL directly), so they don't need to live on the same host or even the
same provider. Do these in order — each one builds on the last.

---

## Part 1 — Deploy the static site (no payments yet)

Pick any static host. As an example, using Netlify (free, no account
needed for a one-off manual deploy):

1. Go to [netlify.com](https://www.netlify.com) → create a free account.
2. From your dashboard, drag and drop everything EXCEPT the `backend/`
   folder (`index.html`, `style.css`, `script.js`, `media/`, etc.) onto
   the "Deploy manually" area.
3. You'll get a live URL immediately. Open it and confirm the site
   works — Shop, cart, wishlist, product pages. Checkout will show a
   plain demo placeholder at this point, which is expected until Part 5.

## Part 2 — Deploy the HitPay backend

Pick any Node host. As an example, using [Render](https://render.com)
(has a free tier):

1. Create a free Render account.
2. **New** → **Web Service** → connect the repo/folder containing
   `backend/` (or use Render's option to deploy from a local folder/zip
   if you're not using git yet).
3. Set the **Root Directory** to `backend` (so Render only looks inside
   that folder, not the whole project).
4. **Build Command:** `npm install`
   **Start Command:** `npm start`
5. Deploy. Render gives you a URL like
   `https://courtiva-backend.onrender.com` — copy it, you'll need it in
   Part 4. Visiting that URL directly should show "Courtiva HitPay
   backend is running."

(Railway, Fly.io, a plain VPS, or GoDaddy's Node.js Hosting all work
too — the steps above are Render-specific as one concrete example, but
`backend/` itself doesn't assume anything about which host you pick.)

## Part 3 — Get HitPay Sandbox credentials

1. Sign up at [hitpayapp.com](https://www.hitpayapp.com) and log in.
2. **Settings → Payment Gateway → API Keys** → copy your **Sandbox**
   API key (always test with Sandbox before ever touching Live).
3. On the same page, copy your **Salt** value too — a separate secret
   from the API key, used only to verify webhooks are really from
   HitPay.

## Part 4 — Configure the backend with those credentials

In whatever host you used for Part 2, find its environment variable
settings (Render: your service → **Environment**) and add:

| Key | Value |
|---|---|
| `HITPAY_API_KEY` | your Sandbox API key |
| `HITPAY_SALT` | your Sandbox Salt value |
| `HITPAY_ENV` | `sandbox` |
| `SITE_URL` | your static site's URL from Part 1 (e.g. `https://courtiva.netlify.app`) |
| `ALLOWED_ORIGIN` | the exact same URL as `SITE_URL` above |

Redeploy/restart the backend after adding these (most hosts do this
automatically when env vars change; check yours if unsure).

## Part 5 — Point the site at the backend, and register the webhook

1. In `index.html`, search for `HITPAY_BACKEND_URL` and set it to your
   backend's URL from Part 2:
   ```html
   window.HITPAY_ENABLED = true;
   window.HITPAY_BACKEND_URL = 'https://courtiva-backend.onrender.com';
   ```
   Redeploy the static site with this change.
2. In your HitPay Dashboard → **Developers → Webhook Endpoints → New
   Webhook**, set the URL to:
   ```
   https://<your-backend-url>/api/hitpay-webhook
   ```
   and subscribe to the **payment_request.completed** event. Without
   this step, payments still work for the shopper, but you have no
   reliable way to know a payment actually went through.

## Part 6 — Test with fake money

Add something to the cart, open the drawer, click "Pay with HitPay" —
you should land on HitPay's own hosted checkout page. Complete a test
payment there (check HitPay's current docs for sandbox test payment
details, since these can change). Confirm you're redirected back to
your site afterward, and check your backend's logs (Render: your
service → **Logs**) to confirm the webhook fired and logged the
completed payment.

**Do not skip this step.**

## Part 7 — Go live with real money

Only after Part 6 works end-to-end: get **Live** API key + Salt from
HitPay (separate from Sandbox), update the backend's environment
variables (`HITPAY_API_KEY`, `HITPAY_SALT`, `HITPAY_ENV=production`),
register a second webhook endpoint for Live (Sandbox and Live are
separate in HitPay's dashboard), redeploy, then do one small real
payment yourself before telling anyone the site is open.

---

## What This Project Still Doesn't Do

No database or order-storage system exists anywhere in this project.
`backend/server.js`'s webhook handler verifies and logs each completed
payment, but doesn't save it anywhere permanent — right now that's
only visible in your backend host's logs. Before relying on this for
real orders, add something there to actually persist each order (a
database, a spreadsheet via an API, an email notification, etc.),
using the webhook's `reference_number` to tie it back to the cart. The
Excel order/inventory tracker delivered separately is a manual
stand-in for this until then.

---

## If Something Goes Wrong

- **No "Pay with HitPay" button:** check both `HITPAY_ENABLED` is
  `true` AND `HITPAY_BACKEND_URL` is set (not `null`) in `index.html`,
  and that you redeployed the static site after changing them.
- **"Could not create HitPay payment request" / network errors:**
  check your backend host's logs — usually `HITPAY_API_KEY` is
  missing/wrong, or `ALLOWED_ORIGIN` doesn't exactly match your site's
  real URL (causing the browser to block the request as a CORS issue).
- **Webhook never fires / payments never show in the logs:** double
  check the webhook URL in HitPay's dashboard matches your backend's
  real URL exactly, and is subscribed to
  `payment_request.completed`.
- **Signature validation failing:** `HITPAY_SALT` must be the Salt for
  the SAME environment (Sandbox or Production) as your API key — these
  come as a matched pair per environment.
- **Wrong amount charged:** `backend/products.json` is the source of
  truth for prices, keyed by each product's folder id (not its display
  name — a few products share a name). If you add or edit a product in
  `media/products/`, update `backend/products.json` to match, or
  checkout will reject it or charge the wrong amount.
