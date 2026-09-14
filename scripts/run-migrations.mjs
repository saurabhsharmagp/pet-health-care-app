// Applies any supabase/migrations/*.sql file not yet recorded in
// _migrations_applied (tracked in this same database), then re-runs
// seed.sql. A stand-in for `supabase db push` so we don't need CLI login.
//
// Run with: node --env-file=scripts/.env scripts/run-migrations.mjs

import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const supabaseDir = join(__dirname, '..', 'supabase');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('Missing DATABASE_URL. Copy scripts/.env.example to scripts/.env and fill it in.');
  process.exit(1);
}

const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

async function main() {
  await client.connect();

  await client.query(`
    create table if not exists public._migrations_applied (
      filename text primary key,
      applied_at timestamptz not null default now()
    );
  `);

  const { rows: appliedRows } = await client.query('select filename from public._migrations_applied');
  const applied = new Set(appliedRows.map((r) => r.filename));

  const migrationsDir = join(supabaseDir, 'migrations');
  const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`Skipping migrations/${file} (already applied)`);
      continue;
    }
    console.log(`Running migrations/${file}...`);
    const sql = readFileSync(join(migrationsDir, file), 'utf8');
    try {
      await client.query('begin');
      await client.query(sql);
      await client.query('insert into public._migrations_applied (filename) values ($1)', [file]);
      await client.query('commit');
      console.log('  ok');
    } catch (err) {
      await client.query('rollback');
      console.error(`  FAILED: ${err.message}`);
      throw err;
    }
  }

  console.log('Running seed.sql...');
  const seedSql = readFileSync(join(supabaseDir, 'seed.sql'), 'utf8');
  try {
    await client.query(seedSql);
    console.log('  ok');
  } catch (err) {
    console.log(`  skipped (${err.message.split('\n')[0]})`);
  }

  console.log('\nDone.');
  await client.end();
}

main().catch(async (err) => {
  await client.end();
  process.exit(1);
});
