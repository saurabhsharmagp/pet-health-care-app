import pg from 'pg';

const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function main() {
  await client.connect();

  const tables = await client.query(`
    select table_name from information_schema.tables
    where table_schema = 'public' order by table_name
  `);
  console.log('Tables:', tables.rows.map((r) => r.table_name).join(', '));

  const packages = await client.query('select count(*) from lab_test_packages');
  console.log('lab_test_packages rows:', packages.rows[0].count);

  const policies = await client.query(`
    select tablename, count(*) as policy_count from pg_policies
    where schemaname = 'public' group by tablename order by tablename
  `);
  console.log('RLS policies per table:');
  for (const row of policies.rows) {
    console.log(`  ${row.tablename}: ${row.policy_count}`);
  }

  await client.end();
}

main().catch(async (err) => {
  console.error(err);
  await client.end();
  process.exit(1);
});
