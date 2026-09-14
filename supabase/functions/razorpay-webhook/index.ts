// Async safety net: Razorpay calls this directly (not via the app) so a
// payment still gets reconciled even if the app closes right after checkout,
// before it could call verify-payment itself. This only updates payment
// status — it does NOT create a booking, since booking details (which pet,
// which slot, which address) aren't part of Razorpay's webhook payload.
// Configure this URL in the Razorpay Dashboard under Settings > Webhooks,
// and set the same secret via: supabase secrets set RAZORPAY_WEBHOOK_SECRET=...
import { serve } from 'https://deno.land/std@0.203.0/http/server.ts';
import { verifyWebhookSignature } from '../_shared/razorpay.ts';
import { getSupabaseAdmin } from '../_shared/supabaseAdmin.ts';

serve(async (req) => {
  try {
    const signature = req.headers.get('x-razorpay-signature');
    const rawBody = await req.text();
    if (!signature || !(await verifyWebhookSignature(rawBody, signature))) {
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const supabaseAdmin = getSupabaseAdmin();

    if (event.event === 'payment.captured') {
      const orderId = event.payload.payment.entity.order_id;
      const paymentId = event.payload.payment.entity.id;
      await supabaseAdmin
        .from('payments')
        .update({ status: 'paid', razorpay_payment_id: paymentId })
        .eq('razorpay_order_id', orderId)
        .eq('status', 'created');
    } else if (event.event === 'payment.failed') {
      const orderId = event.payload.payment.entity.order_id;
      await supabaseAdmin
        .from('payments')
        .update({ status: 'failed' })
        .eq('razorpay_order_id', orderId)
        .eq('status', 'created');
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
