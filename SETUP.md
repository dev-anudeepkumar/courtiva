# Setup Guide: Deploy to Netlify + Connect PayPal

Do these in order — each one builds on the last. Read
[`GOING-LIVE.md`](./GOING-LIVE.md) first for the concepts.

---

## Part 1 — Deploy the site to Netlify (no payments yet)

1. Create a free account at [netlify.com](https://www.netlify.com).
2. From your Netlify dashboard, drag and drop this entire project folder
   (containing `index.html`, `netlify.toml`, `netlify/`, `media/`, etc.)
   onto the "Deploy manually" area.
3. Netlify gives you a live URL immediately. Open it and confirm the
   site works — Shop, cart, wishlist, product pages. Checkout will still
   show the demo placeholder alert at this point, which is expected.

## Part 2 — Get PayPal Sandbox credentials

1. Go to [developer.paypal.com](https://developer.paypal.com) and log in.
2. Dashboard → **Apps & Credentials** → **Sandbox** tab → **Create App**.
3. Copy the **Client ID** and **Secret** shown.

## Part 3 — Add your credentials to Netlify

In your Netlify site dashboard → **Site configuration** → **Environment
variables**, add:

| Key | Value |
|---|---|
| `PAYPAL_CLIENT_ID` | your Sandbox Client ID |
| `PAYPAL_CLIENT_SECRET` | your Sandbox Secret |
| `PAYPAL_ENV` | `sandbox` |

Then trigger a new deploy (env variable changes need a redeploy).

## Part 4 — Turn on the PayPal buttons

In `index.html`, find (search "PAYPAL CONFIGURATION"):

```html
<script>
  window.PAYPAL_CLIENT_ID = null;
  window.PAYPAL_CURRENCY = 'USD';
</script>
```

Change `null` to your Sandbox Client ID in quotes, then redeploy.

## Part 5 — Test with fake money

Add something to the cart, open the drawer — you should see real PayPal
buttons. Click one, log in with a **sandbox test buyer account**
(developer dashboard → Sandbox → Accounts), and complete a test payment.
Confirm the cart empties and a success message shows. Also test
cancelling a payment partway through.

**Do not skip this step.**

## Part 6 — Go live with real money

Only after Part 5 works perfectly: get **Live** credentials from
developer.paypal.com (different values from Sandbox), update Netlify's
environment variables and `PAYPAL_ENV` to `live`, update
`window.PAYPAL_CLIENT_ID` to the Live Client ID, redeploy, then do one
small real purchase yourself before telling anyone else the site is open.

---

## If Something Goes Wrong

- **No PayPal buttons appear:** check the browser console for errors —
  usually a missing/wrong Client ID, or env variables not set before
  the last deploy.
- **"Could not create PayPal order":** check Netlify's function logs
  (Site → Functions → create-order) — usually
  `PAYPAL_CLIENT_ID`/`PAYPAL_CLIENT_SECRET` aren't set correctly.
- **Wrong amount charged:** `netlify/functions/products.json` is the
  source of truth for prices, keyed by each product's folder id (not
  its name — some products share a display name). If you add or edit a
  product in `media/products/`, update this file to match, or checkout
  will reject it or charge the wrong amount.
