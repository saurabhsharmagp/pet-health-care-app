// Hand-written to match supabase/migrations/0001_init_schema.sql.
// Once you've run `supabase link` against your project, regenerate the
// authoritative version with:
//   npx supabase gen types typescript --linked > src/lib/database.types.ts

export type UserRole = 'owner' | 'vet' | 'walker';
export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';
export type AppointmentType = 'in-person' | 'video';
export type PaymentStatus = 'created' | 'paid' | 'failed';
export type PaymentPurpose = 'appointment' | 'walk' | 'lab_test' | 'consult';

export type Profile = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type VetProfile = {
  id: string;
  specialty: string;
  clinic: string;
  bio: string | null;
  rating: number;
  reviews_count: number;
  price_value: number;
  supports_video: boolean;
  distance_km: number | null;
};

export type WalkerProfile = {
  id: string;
  bio: string | null;
  rating: number;
  reviews_count: number;
  price_value: number;
  walk_types: string[];
  distance_km: number | null;
};

export type Pet = {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  breed: string | null;
  age: string | null;
  weight_kg: number | null;
  photo_url: string | null;
  created_at: string;
};

export type VetSlot = {
  id: string;
  vet_id: string;
  slot_at: string;
  is_booked: boolean;
};

export type WalkerSlot = {
  id: string;
  walker_id: string;
  slot_at: string;
  is_booked: boolean;
};

export type LabTestPackage = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  included_tests: string[];
  price: number;
  turnaround: string | null;
  fasting: boolean;
  icon: string | null;
  color: string | null;
};

export type Payment = {
  id: string;
  owner_id: string;
  amount: number;
  currency: string;
  purpose: PaymentPurpose;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  status: PaymentStatus;
  created_at: string;
};

export type Appointment = {
  id: string;
  vet_id: string;
  pet_id: string;
  owner_id: string;
  slot_at: string;
  reason: string | null;
  status: BookingStatus;
  type: AppointmentType;
  payment_id: string | null;
  created_at: string;
};

export type WalkBooking = {
  id: string;
  walker_id: string;
  pet_id: string;
  owner_id: string;
  slot_at: string;
  duration_label: string;
  address: string;
  status: BookingStatus;
  payment_id: string | null;
  created_at: string;
};

export type LabTestBooking = {
  id: string;
  package_id: string;
  pet_id: string;
  owner_id: string;
  slot_at: string;
  address: string;
  status: BookingStatus;
  payment_id: string | null;
  created_at: string;
};

export type ChatThread = {
  id: string;
  owner_id: string;
  professional_id: string;
  pet_id: string | null;
  created_at: string;
};

export type ChatMessageRow = {
  id: string;
  thread_id: string;
  sender_id: string;
  text: string;
  created_at: string;
};
