// Creates a Razorpay order for a booking. The client never sends an amount —
// it's always looked up server-side from the referenced vet/walker/lab
// package, so a tampered client request can't pay less than the real price.
import { serve } from 'https://deno.land/std@0.203.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createRazorpayOrder } from '../_shared/razorpay.ts';
import { getSupabaseAdmin } from '../_shared/supabaseAdmin.ts';

type Purpose = 'appointment' | 'walk' | 'lab_test' | 'consult';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization header');

    const supabaseAdmin = getSupabaseAdmin();
    const jwt = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(jwt);
    if (userError || !userData.user) throw new Error('Invalid session');
    const ownerId = userData.user.id;

    const { purpose, referenceId } = (await req.json()) as { purpose: Purpose; referenceId: string };
    if (!['appointment', 'walk', 'lab_test', 'consult'].includes(purpose)) {
      throw new Error('Invalid purpose');
    }

    let amount: number;
    if (purpose === 'appointment' || purpose === 'consult') {
      const { data, error } = await supabaseAdmin
        .from('vet_profiles')
        .select('price_value')
        .eq('id', referenceId)
        .single();
      if (error || !data) throw new Error('Vet not found');
      amount = data.price_value;
    } else if (purpose === 'walk') {
      const { data, error } = await supabaseAdmin
        .from('walker_profiles')
        .select('price_value')
        .eq('id', referenceId)
        .single();
      if (error || !data) throw new Error('Walker not found');
      amount = data.price_value;
    } else {
      const { data, error } = await supabaseAdmin
        .from('lab_test_packages')
        .select('price')
        .eq('id', referenceId)
        .single();
      if (error || !data) throw new Error('Lab package not found');
      amount = data.price;
    }

    const { data: paymentRow, error: insertError } = await supabaseAdmin
      .from('payments')
      .insert({ owner_id: ownerId, amount, purpose, status: 'created' })
      .select()
      .single();
    if (insertError) throw insertError;

    // Razorpay expects the amount in paise (smallest currency unit).
    const order = await createRazorpayOrder(amount * 100, paymentRow.id);

    await supabaseAdmin
      .from('payments')
      .update({ razorpay_order_id: order.id })
      .eq('id', paymentRow.id);

    return new Response(
      JSON.stringify({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentRowId: paymentRow.id,
        keyId: Deno.env.get('RAZORPAY_KEY_ID'),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
