// Verifies a Razorpay Checkout result server-side and, only if the signature
// is genuine, atomically marks the payment paid + creates the real booking
// row via one of the confirm_* Postgres functions (see migration 0001).
import { serve } from 'https://deno.land/std@0.203.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyCheckoutSignature } from '../_shared/razorpay.ts';
import { getSupabaseAdmin } from '../_shared/supabaseAdmin.ts';

type Booking =
  | { purpose: 'appointment' | 'consult'; vetId: string; petId: string; slotAt: string; reason?: string; type?: 'in-person' | 'video' }
  | { purpose: 'walk'; walkerId: string; petId: string; slotAt: string; durationLabel: string; address: string }
  | { purpose: 'lab_test'; packageId: string; petId: string; slotAt: string; address: string };

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

    const body = (await req.json()) as {
      paymentRowId: string;
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      booking: Booking;
    };
    const { paymentRowId, razorpayOrderId, razorpayPaymentId, razorpaySignature, booking } = body;

    const valid = await verifyCheckoutSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!valid) throw new Error('Payment signature verification failed');

    let bookingId: string;

    if (booking.purpose === 'appointment' || booking.purpose === 'consult') {
      const { data, error } = await supabaseAdmin.rpc('confirm_appointment', {
        p_payment_id: paymentRowId,
        p_vet_id: booking.vetId,
        p_pet_id: booking.petId,
        p_owner_id: ownerId,
        p_slot_at: booking.slotAt,
        p_reason: booking.reason ?? null,
        p_type: booking.type ?? 'in-person',
      });
      if (error) throw error;
      bookingId = data as string;
    } else if (booking.purpose === 'walk') {
      const { data, error } = await supabaseAdmin.rpc('confirm_walk_booking', {
        p_payment_id: paymentRowId,
        p_walker_id: booking.walkerId,
        p_pet_id: booking.petId,
        p_owner_id: ownerId,
        p_slot_at: booking.slotAt,
        p_duration_label: booking.durationLabel,
        p_address: booking.address,
      });
      if (error) throw error;
      bookingId = data as string;
    } else {
      const { data, error } = await supabaseAdmin.rpc('confirm_lab_test_booking', {
        p_payment_id: paymentRowId,
        p_package_id: booking.packageId,
        p_pet_id: booking.petId,
        p_owner_id: ownerId,
        p_slot_at: booking.slotAt,
        p_address: booking.address,
      });
      if (error) throw error;
      bookingId = data as string;
    }

    // Also record the Razorpay payment id (confirm_* only flips status to 'paid').
    await supabaseAdmin
      .from('payments')
      .update({ razorpay_payment_id: razorpayPaymentId })
      .eq('id', paymentRowId)
      .eq('owner_id', ownerId);

    return new Response(JSON.stringify({ success: true, bookingId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
