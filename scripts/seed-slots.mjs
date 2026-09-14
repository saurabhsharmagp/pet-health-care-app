// Seeds upcoming availability for every vet and walker, since the schema
// models real per-professional calendars (vet_slots / walker_slots) rather
// than the old mock's fixed date strings. Generates slots relative to
// "today" so they're always bookable — safe to re-run (clears future
// unbooked slots first so it doesn't pile up duplicates).
//
// Run with: node --env-file=scripts/.env scripts/seed-slots.mjs

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in scripts/.env');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

// hour/minute are IST (UTC+5:30); India has no DST so this is safe year-round.
function slotAt(daysFromNow, hour, minute = 0) {
  const now = new Date();
  const utcHour = hour - 5;
  const utcMinute = minute - 30;
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysFromNow, utcHour, utcMinute)
  ).toISOString();
}

const DAY_TIME_PAIRS = [
  { day: 1, hours: [[9, 30], [11, 0], [16, 0]] },
  { day: 2, hours: [[10, 0], [14, 30]] },
  { day: 3, hours: [[9, 0], [13, 0], [17, 30]] },
  { day: 4, hours: [[9, 30], [18, 0]] },
];

async function seedFor(table, idColumn, ids) {
  for (const id of ids) {
    await supabase.from(table).delete().eq(idColumn, id).eq('is_booked', false).gte('slot_at', new Date().toISOString());
    const rows = [];
    for (const { day, hours } of DAY_TIME_PAIRS) {
      for (const [hour, minute] of hours) {
        rows.push({ [idColumn]: id, slot_at: slotAt(day, hour, minute) });
      }
    }
    const { error } = await supabase.from(table).insert(rows);
    if (error) throw error;
    console.log(`  seeded ${rows.length} slots for ${id}`);
  }
}

async function main() {
  const { data: vets, error: vetError } = await supabase.from('vet_profiles').select('id');
  if (vetError) throw vetError;
  console.log(`Seeding vet_slots for ${vets.length} vets...`);
  await seedFor('vet_slots', 'vet_id', vets.map((v) => v.id));

  const { data: walkers, error: walkerError } = await supabase.from('walker_profiles').select('id');
  if (walkerError) throw walkerError;
  console.log(`Seeding walker_slots for ${walkers.length} walkers...`);
  await seedFor('walker_slots', 'walker_id', walkers.map((w) => w.id));

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
