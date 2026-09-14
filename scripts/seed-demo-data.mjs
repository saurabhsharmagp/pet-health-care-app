// Creates the same demo cast the app's mock data used (Dr. Anjali Rao,
// Aditya Bose, Saurabh Sharma's pets, etc.) as real Supabase Auth accounts,
// so switching the app over from mock data to Supabase doesn't lose the
// story used throughout development and demos.
//
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. Run with:
//   node --env-file=scripts/.env scripts/seed-demo-data.mjs
//
// Safe to re-run: skips creating a user if that email already exists.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy scripts/.env.example to scripts/.env and fill it in.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_PASSWORD = 'Kennelo!Demo123';

async function findUserByEmail(email) {
  // Admin listUsers doesn't filter by email server-side, so page through.
  let page = 1;
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (match) return match;
    if (data.users.length < 200) return null;
    page += 1;
  }
}

async function ensureUser({ email, role, name, phone }) {
  const existing = await findUserByEmail(email);
  if (existing) {
    console.log(`  = ${email} already exists, skipping`);
    return existing.id;
  }
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { role, name, phone },
  });
  if (error) throw error;
  console.log(`  + created ${email} (${role})`);
  return data.user.id;
}

async function main() {
  console.log('Creating owners...');
  const saurabhId = await ensureUser({ email: 'saurabhsharmagp@yahoo.com', role: 'owner', name: 'Saurabh Sharma', phone: '+91 98765 43210' });
  const nehaId = await ensureUser({ email: 'neha.kapoor@example.com', role: 'owner', name: 'Neha Kapoor', phone: '+91 91234 56780' });
  const rohanId = await ensureUser({ email: 'rohan.verma@example.com', role: 'owner', name: 'Rohan Verma', phone: '+91 99887 66554' });

  console.log('Creating vets...');
  const vets = [
    { email: 'dr.anjali.rao@kennelo.demo', name: 'Dr. Anjali Rao', specialty: 'General & Preventive Care', clinic: 'Green Paws Veterinary Clinic', bio: 'Dr. Rao has 10+ years of experience in general wellness, vaccinations, and preventive care for dogs and cats.', rating: 4.9, reviews_count: 214, price_value: 600, supports_video: true },
    { email: 'dr.karan.mehta@kennelo.demo', name: 'Dr. Karan Mehta', specialty: 'Dermatology', clinic: 'CityVet Specialty Hospital', bio: 'Specialist in skin allergies, infections, and coat health for all breeds.', rating: 4.7, reviews_count: 132, price_value: 900, supports_video: true },
    { email: 'dr.priya.nair@kennelo.demo', name: 'Dr. Priya Nair', specialty: 'Surgery & Orthopedics', clinic: 'Metro Animal Hospital', bio: 'Orthopedic and soft-tissue surgeon with a focus on post-op recovery plans.', rating: 4.8, reviews_count: 98, price_value: 1200, supports_video: false },
    { email: 'dr.simran.kaur@kennelo.demo', name: 'Dr. Simran Kaur', specialty: 'Nutrition & Wellness', clinic: 'Green Paws Veterinary Clinic', bio: 'Helps design diet and weight-management plans tailored to your pet.', rating: 4.6, reviews_count: 76, price_value: 500, supports_video: true },
  ];
  for (const vet of vets) {
    const id = await ensureUser({ email: vet.email, role: 'vet', name: vet.name, phone: null });
    const { error } = await supabase.from('vet_profiles').upsert({
      id,
      specialty: vet.specialty,
      clinic: vet.clinic,
      bio: vet.bio,
      rating: vet.rating,
      reviews_count: vet.reviews_count,
      price_value: vet.price_value,
      supports_video: vet.supports_video,
    });
    if (error) throw error;
  }

  console.log('Creating walkers...');
  const walkers = [
    { email: 'aditya.bose@kennelo.demo', name: 'Aditya Bose', bio: 'Background-checked walker with 5+ years of experience handling dogs of all sizes and temperaments. Certified in pet first aid.', rating: 4.9, reviews_count: 187, price_value: 250, walk_types: ['30-min Walk', '60-min Walk', 'Pet Sitting'] },
    { email: 'kavya.iyer@kennelo.demo', name: 'Kavya Iyer', bio: 'Loves long walks and high-energy breeds. Offers group walks and basic obedience reinforcement during sessions.', rating: 4.8, reviews_count: 142, price_value: 220, walk_types: ['30-min Walk', '60-min Walk'] },
    { email: 'manish.thakur@kennelo.demo', name: 'Manish Thakur', bio: 'Specializes in senior and reactive dogs, using calm, patient handling. Also available for overnight pet sitting.', rating: 4.7, reviews_count: 98, price_value: 280, walk_types: ['30-min Walk', '60-min Walk', 'Pet Sitting', 'Overnight Boarding'] },
  ];
  for (const walker of walkers) {
    const id = await ensureUser({ email: walker.email, role: 'walker', name: walker.name, phone: null });
    const { error } = await supabase.from('walker_profiles').upsert({
      id,
      bio: walker.bio,
      rating: walker.rating,
      reviews_count: walker.reviews_count,
      price_value: walker.price_value,
      walk_types: walker.walk_types,
    });
    if (error) throw error;
  }

  console.log('Creating pets...');
  const pets = [
    { owner_id: saurabhId, name: 'Bruno', species: 'Dog', breed: 'Golden Retriever', age: '3 yrs', weight_kg: 28 },
    { owner_id: saurabhId, name: 'Whiskers', species: 'Cat', breed: 'Persian', age: '1.5 yrs', weight_kg: 4 },
    { owner_id: nehaId, name: 'Max', species: 'Dog', breed: 'Labrador', age: '4 yrs', weight_kg: 30 },
    { owner_id: rohanId, name: 'Simba', species: 'Cat', breed: 'Maine Coon', age: '2 yrs', weight_kg: 6 },
  ];
  for (const pet of pets) {
    const { error } = await supabase.from('pets').insert(pet);
    // Ignore duplicate-insert errors on re-run; pets have no natural unique key here.
    if (error && !error.message.includes('duplicate')) throw error;
  }

  console.log('\nDone. Demo accounts all use the password:', DEMO_PASSWORD);
  console.log('Sign in as Dr. Anjali Rao with dr.anjali.rao@kennelo.demo, or as Saurabh with saurabhsharmagp@yahoo.com, etc.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
