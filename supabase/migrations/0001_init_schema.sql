-- ============================================================================
-- Kennelo initial schema
-- Replaces the mobile app's hardcoded mock data with real, relational tables.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- Enum types
-- ----------------------------------------------------------------------------
create type user_role as enum ('owner', 'vet', 'walker');
create type booking_status as enum ('upcoming', 'completed', 'cancelled');
create type appointment_type as enum ('in-person', 'video');
create type payment_status as enum ('created', 'paid', 'failed');
create type payment_purpose as enum ('appointment', 'walk', 'lab_test', 'consult');

-- ----------------------------------------------------------------------------
-- profiles: one row per authenticated user, regardless of role
-- ----------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'owner',
  name text not null,
  email text not null,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever someone signs up. Role/name/phone are
-- read from the signup call's user metadata (see src/lib/supabase.ts).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, name, email, phone)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'owner'),
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email,
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- vet_profiles / walker_profiles: role-specific fields, 1:1 with profiles
-- ----------------------------------------------------------------------------
create table vet_profiles (
  id uuid primary key references profiles(id) on delete cascade,
  specialty text not null,
  clinic text not null,
  bio text,
  rating numeric(2,1) not null default 5.0,
  reviews_count int not null default 0,
  price_value int not null,
  supports_video boolean not null default false,
  distance_km numeric(4,1)
);

create table walker_profiles (
  id uuid primary key references profiles(id) on delete cascade,
  bio text,
  rating numeric(2,1) not null default 5.0,
  reviews_count int not null default 0,
  price_value int not null,
  walk_types text[] not null default '{}',
  distance_km numeric(4,1)
);

-- ----------------------------------------------------------------------------
-- pets
-- ----------------------------------------------------------------------------
create table pets (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  species text not null,
  breed text,
  age text,
  weight_kg numeric(5,1),
  photo_url text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Availability slots
-- ----------------------------------------------------------------------------
create table vet_slots (
  id uuid primary key default uuid_generate_v4(),
  vet_id uuid not null references vet_profiles(id) on delete cascade,
  slot_at timestamptz not null,
  is_booked boolean not null default false
);

create table walker_slots (
  id uuid primary key default uuid_generate_v4(),
  walker_id uuid not null references walker_profiles(id) on delete cascade,
  slot_at timestamptz not null,
  is_booked boolean not null default false
);

-- ----------------------------------------------------------------------------
-- lab_test_packages: admin-managed catalog, no owner
-- ----------------------------------------------------------------------------
create table lab_test_packages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  description text,
  included_tests text[] not null default '{}',
  price int not null,
  turnaround text,
  fasting boolean not null default false,
  icon text,
  color text
);

-- ----------------------------------------------------------------------------
-- payments: the Razorpay ledger. Only Edge Functions (service role) write here.
-- ----------------------------------------------------------------------------
create table payments (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  amount int not null,
  currency text not null default 'INR',
  purpose payment_purpose not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  status payment_status not null default 'created',
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Bookings
-- ----------------------------------------------------------------------------
create table appointments (
  id uuid primary key default uuid_generate_v4(),
  vet_id uuid not null references vet_profiles(id),
  pet_id uuid not null references pets(id),
  owner_id uuid not null references profiles(id),
  slot_at timestamptz not null,
  reason text,
  status booking_status not null default 'upcoming',
  type appointment_type not null default 'in-person',
  payment_id uuid references payments(id),
  created_at timestamptz not null default now()
);

create table walk_bookings (
  id uuid primary key default uuid_generate_v4(),
  walker_id uuid not null references walker_profiles(id),
  pet_id uuid not null references pets(id),
  owner_id uuid not null references profiles(id),
  slot_at timestamptz not null,
  duration_label text not null,
  address text not null,
  status booking_status not null default 'upcoming',
  payment_id uuid references payments(id),
  created_at timestamptz not null default now()
);

create table lab_test_bookings (
  id uuid primary key default uuid_generate_v4(),
  package_id uuid not null references lab_test_packages(id),
  pet_id uuid not null references pets(id),
  owner_id uuid not null references profiles(id),
  slot_at timestamptz not null,
  address text not null,
  status booking_status not null default 'upcoming',
  payment_id uuid references payments(id),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Chat: one thread per (owner, professional, pet) combination
-- ----------------------------------------------------------------------------
create table chat_threads (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id),
  professional_id uuid not null references profiles(id),
  pet_id uuid references pets(id),
  created_at timestamptz not null default now(),
  unique (owner_id, professional_id, pet_id)
);

create table chat_messages (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid not null references chat_threads(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  text text not null,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Atomic "confirm booking" functions.
-- Each does: mark payment paid + insert the booking row, in a single
-- transaction, so a captured payment can never leave the system without a
-- corresponding booking (or vice versa). Called from the verify-payment
-- Edge Function via supabaseAdmin.rpc(...), using the service role so RLS
-- (which blocks direct client writes to `payments`) doesn't apply here.
-- ----------------------------------------------------------------------------
create function confirm_appointment(
  p_payment_id uuid,
  p_vet_id uuid,
  p_pet_id uuid,
  p_owner_id uuid,
  p_slot_at timestamptz,
  p_reason text,
  p_type appointment_type
) returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_appointment_id uuid;
begin
  update payments set status = 'paid' where id = p_payment_id and owner_id = p_owner_id;
  insert into appointments (vet_id, pet_id, owner_id, slot_at, reason, type, payment_id)
  values (p_vet_id, p_pet_id, p_owner_id, p_slot_at, p_reason, p_type, p_payment_id)
  returning id into v_appointment_id;
  return v_appointment_id;
end;
$$;

create function confirm_walk_booking(
  p_payment_id uuid,
  p_walker_id uuid,
  p_pet_id uuid,
  p_owner_id uuid,
  p_slot_at timestamptz,
  p_duration_label text,
  p_address text
) returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_booking_id uuid;
begin
  update payments set status = 'paid' where id = p_payment_id and owner_id = p_owner_id;
  insert into walk_bookings (walker_id, pet_id, owner_id, slot_at, duration_label, address, payment_id)
  values (p_walker_id, p_pet_id, p_owner_id, p_slot_at, p_duration_label, p_address, p_payment_id)
  returning id into v_booking_id;
  return v_booking_id;
end;
$$;

create function confirm_lab_test_booking(
  p_payment_id uuid,
  p_package_id uuid,
  p_pet_id uuid,
  p_owner_id uuid,
  p_slot_at timestamptz,
  p_address text
) returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_booking_id uuid;
begin
  update payments set status = 'paid' where id = p_payment_id and owner_id = p_owner_id;
  insert into lab_test_bookings (package_id, pet_id, owner_id, slot_at, address, payment_id)
  values (p_package_id, p_pet_id, p_owner_id, p_slot_at, p_address, p_payment_id)
  returning id into v_booking_id;
  return v_booking_id;
end;
$$;

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table profiles enable row level security;
alter table vet_profiles enable row level security;
alter table walker_profiles enable row level security;
alter table pets enable row level security;
alter table vet_slots enable row level security;
alter table walker_slots enable row level security;
alter table lab_test_packages enable row level security;
alter table payments enable row level security;
alter table appointments enable row level security;
alter table walk_bookings enable row level security;
alter table lab_test_bookings enable row level security;
alter table chat_threads enable row level security;
alter table chat_messages enable row level security;

-- profiles: everyone can see their own row; vet/walker rows are public
-- (needed for the "find a vet/walker" directory).
create policy "View own profile" on profiles
  for select using (auth.uid() = id);
create policy "View public professional profiles" on profiles
  for select using (role in ('vet', 'walker'));
create policy "Update own profile" on profiles
  for update using (auth.uid() = id);

-- vet_profiles / walker_profiles: public read (directory browsing),
-- write restricted to the professional themself.
create policy "Public read vet profiles" on vet_profiles
  for select using (true);
create policy "Vet manages own profile" on vet_profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Public read walker profiles" on walker_profiles
  for select using (true);
create policy "Walker manages own profile" on walker_profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- pets: owner has full control; an assigned vet/walker can view (not edit)
-- a pet they have an active appointment/walk with.
create policy "Owner manages own pets" on pets
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Assigned professional can view pet" on pets
  for select using (
    exists (select 1 from appointments a where a.pet_id = pets.id and a.vet_id = auth.uid())
    or exists (select 1 from walk_bookings w where w.pet_id = pets.id and w.walker_id = auth.uid())
  );

-- Availability slots: public read (to show booking options), the owning
-- professional manages their own.
create policy "Public read vet slots" on vet_slots
  for select using (true);
create policy "Vet manages own slots" on vet_slots
  for all using (auth.uid() = vet_id) with check (auth.uid() = vet_id);

create policy "Public read walker slots" on walker_slots
  for select using (true);
create policy "Walker manages own slots" on walker_slots
  for all using (auth.uid() = walker_id) with check (auth.uid() = walker_id);

-- Lab test catalog: public read; writes are admin-only (service role bypasses RLS).
create policy "Public read lab packages" on lab_test_packages
  for select using (true);

-- Payments: an owner can see their own payment history. No insert/update
-- policy is defined for regular users on purpose — only Edge Functions
-- (using the service role key, which bypasses RLS) may write here.
create policy "Owner can view own payments" on payments
  for select using (auth.uid() = owner_id);

-- Appointments: owner has full control of their own bookings; the assigned
-- vet can view and update status (e.g. mark completed / cancel).
create policy "Owner manages own appointments" on appointments
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Vet can view assigned appointments" on appointments
  for select using (auth.uid() = vet_id);
create policy "Vet can update assigned appointments" on appointments
  for update using (auth.uid() = vet_id);

-- Walk bookings: same pattern, for walkers.
create policy "Owner manages own walk bookings" on walk_bookings
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Walker can view assigned walks" on walk_bookings
  for select using (auth.uid() = walker_id);
create policy "Walker can update assigned walks" on walk_bookings
  for update using (auth.uid() = walker_id);

-- Lab test bookings: owner-only (no individual professional is assigned).
create policy "Owner manages own lab bookings" on lab_test_bookings
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Chat: only the two participants in a thread can see or post in it.
create policy "Participants can view thread" on chat_threads
  for select using (auth.uid() = owner_id or auth.uid() = professional_id);
create policy "Participants can create thread" on chat_threads
  for insert with check (auth.uid() = owner_id or auth.uid() = professional_id);

create policy "Participants can view messages" on chat_messages
  for select using (
    exists (
      select 1 from chat_threads t
      where t.id = chat_messages.thread_id
      and (t.owner_id = auth.uid() or t.professional_id = auth.uid())
    )
  );
create policy "Participants can send messages" on chat_messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from chat_threads t
      where t.id = chat_messages.thread_id
      and (t.owner_id = auth.uid() or t.professional_id = auth.uid())
    )
  );
