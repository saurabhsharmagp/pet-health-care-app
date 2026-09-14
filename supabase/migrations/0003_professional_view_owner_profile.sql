-- The doctor/walker portals need an owner's name/phone/email for their
-- patient/client detail screens. The original "profiles" policies only let
-- someone view their own row or a public vet/walker row, so a vet/walker
-- had no way to read an owner's profile at all. This mirrors the existing
-- "Assigned professional can view pet" policy: a vet/walker can view an
-- owner's profile if they have an appointment, walk booking, or chat
-- thread connecting them.
create policy "Assigned professional can view owner profile" on profiles
  for select using (
    exists (select 1 from appointments a where a.owner_id = profiles.id and a.vet_id = auth.uid())
    or exists (select 1 from walk_bookings w where w.owner_id = profiles.id and w.walker_id = auth.uid())
    or exists (select 1 from chat_threads t where t.owner_id = profiles.id and t.professional_id = auth.uid())
  );
