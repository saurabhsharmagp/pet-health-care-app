import pg from 'pg';

const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function main() {
  await client.connect();

  const profiles = await client.query('select role, name, email from profiles order by role, name');
  console.log('profiles:');
  for (const row of profiles.rows) console.log(`  [${row.role}] ${row.name} <${row.email}>`);

  const vets = await client.query('select v.specialty, v.price_value, p.name from vet_profiles v join profiles p on p.id = v.id order by p.name');
  console.log('vet_profiles:');
  for (const row of vets.rows) console.log(`  ${row.name} — ${row.specialty} — ₹${row.price_value}`);

  const walkers = await client.query('select w.price_value, w.walk_types, p.name from walker_profiles w join profiles p on p.id = w.id order by p.name');
  console.log('walker_profiles:');
  for (const row of walkers.rows) console.log(`  ${row.name} — ₹${row.price_value} — ${row.walk_types}`);

  const pets = await client.query('select pt.name, pt.species, pt.breed, p.name as owner from pets pt join profiles p on p.id = pt.owner_id order by p.name, pt.name');
  console.log('pets:');
  for (const row of pets.rows) console.log(`  ${row.name} (${row.species}, ${row.breed}) — owner: ${row.owner}`);

  await client.end();
}

main().catch(async (err) => {
  console.error(err);
  await client.end();
  process.exit(1);
});
