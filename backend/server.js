// backend/server.js
//
// A standalone Node/Express app for the HitPay checkout backend —
// deployable to whatever host you choose (Render, Railway, a VPS,
// GoDaddy's Node.js Hosting, Fly.io, etc.), rather than being tied to
// Netlify Functions like the earlier version of this was.
//
// This replaces: netlify/functions/hitpay-create-payment.js and
// netlify/functions/hitpay-webhook.js — same logic, same security
// rules, just running as a normal Express app instead of Netlify's
// serverless function format.
//
// Docs this was written against: https://docs.hitpayapp.com/apis/guide/online-payments
// HitPay's API can change over time — if something here stops working,
// that's the first place to check for updates.

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const products = require('./products.json');

const app = express();

// Your deployed static site's exact origin (e.g. "https://courtiva.com" or
// "https://your-site.netlify.app") — REQUIRED once this backend lives on
// a different domain than the site itself, or the browser will block
// every request to it. "*" works for quick local testing only.
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({ origin: ALLOWED_ORIGIN }));

// The webhook route needs the RAW request body (to check its signature
// against it byte-for-byte) — express.json() would parse it into an
// object first and lose that. Rather than apply express.json()
// globally (which would run on every route, including the webhook one,
// before its own raw-body middleware ever got a chance — exactly the
// bug that was here before this comment), it's applied per-route
// instead: explicitly on /api/hitpay-create-payment below, and NOT on
// /api/hitpay-webhook, which brings its own express.raw() instead.

const HITPAY_API_BASE = process.env.HITPAY_ENV === 'production'
  ? 'https://api.hit-pay.com/v1'
  : 'https://api.sandbox.hit-pay.com/v1';

// ---------- POST /api/hitpay-create-payment ----------
// Takes the cart's product ids + quantities from the browser, NEVER a
// price — recomputes the real total itself from products.json before
// asking HitPay to create a payment request. This one check is the
// entire reason this needs to be a server instead of code running in
// the visitor's browser: nothing here can be tampered with from the
// browser's side.
app.post('/api/hitpay-create-payment', express.json(), async (req, res) => {
  if (!process.env.HITPAY_API_KEY) {
    return res.status(500).json({ error: 'HITPAY_API_KEY is not set on the server.' });
  }

  try {
    const { items, email } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    let total = 0;
    for (const item of items) {
      const product = products[item.id];
      if (!product) {
        return res.status(400).json({ error: `Unknown product id: ${item.id}` });
      }
      const qty = Math.max(1, parseInt(item.qty, 10) || 1);
      total += product.price * qty;
    }

    // Where HitPay sends the shopper back to after paying — needs to be
    // YOUR SITE's domain (wherever the static files are hosted), not
    // this backend's own domain. Set this once you know that URL.
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
    const reference = `courtiva-${Date.now()}`;

    // HitPay's docs ask for x-www-form-urlencoded, not JSON.
    const params = new URLSearchParams({
      amount: total.toFixed(2),
      currency: 'SGD',
      purpose: 'Courtiva order',
      reference_number: reference,
      redirect_url: `${siteUrl}/?hitpay_order=${reference}`,
    });
    if (email) params.set('email', email);

    const hitpayResponse = await fetch(`${HITPAY_API_BASE}/payment-requests`, {
      method: 'POST',
      headers: {
        'X-BUSINESS-API-KEY': process.env.HITPAY_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: params,
    });

    const data = await hitpayResponse.json();

    if (!hitpayResponse.ok) {
      console.error('HitPay create payment request error:', data);
      return res.status(502).json({ error: 'Could not create HitPay payment request.' });
    }

    res.json({ url: data.url, id: data.id, reference_number: reference });
  } catch (err) {
    console.error('hitpay-create-payment error:', err);
    res.status(500).json({ error: 'Server error creating HitPay payment request.' });
  }
});

// ---------- POST /api/hitpay-webhook ----------
// HitPay calls this when a payment actually completes. The redirect the
// shopper's browser lands on isn't trustworthy on its own — anyone could
// visit that URL directly — so this signed, server-to-server webhook is
// the only safe place to mark an order as paid.
//
// SETUP REQUIRED: in your HitPay Dashboard, go to Developers > Webhook
// Endpoints > New Webhook, point it at https://<wherever-this-backend-
// ends-up>/api/hitpay-webhook, and subscribe to payment_request.completed.
app.post(
  '/api/hitpay-webhook',
  express.raw({ type: 'application/json' }), // raw bytes, needed for signature verification below
  (req, res) => {
    if (!process.env.HITPAY_SALT) {
      console.error('HITPAY_SALT is not set — cannot verify webhook authenticity.');
      return res.status(500).send('Server not configured.');
    }

    const signature = req.headers['hitpay-signature'];
    const rawBody = req.body; // a Buffer, thanks to express.raw() above

    const computed = crypto.createHmac('sha256', process.env.HITPAY_SALT).update(rawBody).digest('hex');
    const a = Buffer.from(computed);
    const b = Buffer.from(signature || '');
    const validSignature = a.length === b.length && crypto.timingSafeEqual(a, b);

    if (!validSignature) {
      console.warn('HitPay webhook received with an invalid or missing signature — ignored.');
      return res.status(401).send('Invalid signature.');
    }

    let payload;
    try {
      payload = JSON.parse(rawBody.toString('utf8'));
    } catch (err) {
      return res.status(400).send('Invalid JSON.');
    }

    if (payload.status === 'completed') {
      console.log('HitPay payment completed:', {
        reference_number: payload.reference_number,
        amount: payload.amount,
        currency: payload.currency,
        email: payload.email,
      });

      // NOT YET BUILT: this project still has no database or order-
      // storage system — right now this only logs to this server's
      // console/logs. Before relying on this for a real launch, add
      // something here to actually persist the order (a database, a
      // spreadsheet via an API, an email via SendGrid/Postmark/Resend,
      // etc.), using payload.reference_number to tie it back to the
      // cart. See the Excel order tracker delivered earlier as a
      // manual stand-in until then.
    }

    res.status(200).send('OK');
  }
);

app.get('/', (req, res) => {
  res.send('Courtiva HitPay backend is running.');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`HitPay backend listening on port ${PORT}`);
});
