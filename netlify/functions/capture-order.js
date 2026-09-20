// netlify/functions/capture-order.js
//
// Called after the customer approves the payment in the PayPal popup.
// This is the step that actually finalizes ("captures") the payment —
// nothing has been charged until this succeeds.

const PAYPAL_API_BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

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
    const { orderID } = JSON.parse(event.body || '{}');
    if (!orderID) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing orderID.' }) };
    }

    const accessToken = await getPayPalAccessToken();

    const captureResponse = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const captureData = await captureResponse.json();

    if (!captureResponse.ok) {
      console.error('PayPal capture error:', captureData);
      return { statusCode: 502, body: JSON.stringify({ error: 'Payment could not be captured.' }) };
    }

    // At this point the payment is real and complete. This is where
    // you'd add next steps if/when you build them, e.g.:
    //   - save the order to a database
    //   - send a confirmation email (via SendGrid/Postmark/Resend, etc.)
    //   - update inventory
    // None of that exists yet in this project — see GOING-LIVE.md.

    return {
      statusCode: 200,
      body: JSON.stringify({ status: captureData.status, id: captureData.id }),
    };
  } catch (err) {
    console.error('capture-order error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error capturing order.' }) };
  }
};
