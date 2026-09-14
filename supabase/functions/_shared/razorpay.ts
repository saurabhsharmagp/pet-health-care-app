// Thin wrapper around the Razorpay REST API + HMAC signature verification.
// Set these via: supabase secrets set RAZORPAY_KEY_ID=... RAZORPAY_KEY_SECRET=... RAZORPAY_WEBHOOK_SECRET=...
const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID') ?? '';
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET') ?? '';

function basicAuthHeader() {
  return 'Basic ' + btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
}

export async function createRazorpayOrder(amountInPaise: number, receipt: string) {
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: basicAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
    }),
  });
  if (!res.ok) {
    throw new Error(`Razorpay order creation failed: ${await res.text()}`);
  }
  return res.json();
}

async function hmacSha256Hex(secret: string, message: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Verifies the signature Razorpay Checkout hands back to the client after a
// successful payment. Must be checked server-side — never trust the client's
// claim that a payment succeeded.
export async function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string) {
  const expected = await hmacSha256Hex(RAZORPAY_KEY_SECRET, `${orderId}|${paymentId}`);
  return expected === signature;
}

// Verifies the signature on async webhook events from Razorpay's dashboard
// webhook config (a separate secret from the API key pair).
export async function verifyWebhookSignature(rawBody: string, signature: string) {
  const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') ?? '';
  const expected = await hmacSha256Hex(webhookSecret, rawBody);
  return expected === signature;
}
