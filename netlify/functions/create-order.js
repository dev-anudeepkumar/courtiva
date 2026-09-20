// netlify/functions/create-order.js
//
// Runs on Netlify's server, NOT in the visitor's browser — this is what
// keeps checkout trustworthy. The browser sends us which products (by
// id) and quantities are in the cart, but we IGNORE any price it sends
// and look up the real price ourselves from products.json below. That's
// the one rule that matters most in this whole file: never trust a
// price that came from the browser.
//
// Why by ID and not by name: a few products in this catalog share a
// display name (e.g. "Aurelia" is both a $200 item and, separately, a
// $140 item) — see README.txt, "PRODUCT CATALOG IS NOW PLUG AND PLAY".
// Only each product's folder id (e.g. "aurelia-sportswear" vs
// "aurelia-dress") is actually unique, so that's what this file and the
// front-end cart use to tell them apart.
//
// Docs this was written against: https://developer.paypal.com/docs/checkout/
// PayPal's API details can change over time — if something here stops
// working, that's the first place to check for updates.

const products = require('./products.json');

// PayPal Sandbox and Live use different API base URLs. Which one we use
// is controlled by an environment variable you set in the Netlify
// dashboard (see SETUP.md) — never hard-code "live" here while testing.
const PAYPAL_API_BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// Asks PayPal for a short-lived access token using our Client ID + Secret.
// The Secret lives only in Netlify's environment variables (server-side),
// never in any file sent to the browser.
async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`PayPal auth failed: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { items } = JSON.parse(event.body || '{}');

    if (!Array.isArray(items) || items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Cart is empty.' }) };
    }

    // Recompute the total ourselves from products.json — this line is the
    // entire reason this function needs to exist on a server at all.
    let total = 0;
    const lineItems = [];
    for (const item of items) {
      const product = products[item.id];
      if (!product) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Unknown product id: ${item.id}` }),
        };
      }
      const qty = Math.max(1, parseInt(item.qty, 10) || 1);
      total += product.price * qty;
      lineItems.push({
        name: product.name.slice(0, 127), // PayPal limits item name length
        unit_amount: { currency_code: 'USD', value: product.price.toFixed(2) },
        quantity: String(qty),
      });
    }

    const accessToken = await getPayPalAccessToken();

    const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: total.toFixed(2),
              breakdown: {
                item_total: { currency_code: 'USD', value: total.toFixed(2) },
              },
            },
            items: lineItems,
          },
        ],
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      console.error('PayPal create order error:', orderData);
      return { statusCode: 502, body: JSON.stringify({ error: 'Could not create PayPal order.' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ id: orderData.id }),
    };
  } catch (err) {
    console.error('create-order error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error creating order.' }) };
  }
};
