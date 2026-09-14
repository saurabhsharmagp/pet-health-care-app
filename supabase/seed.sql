-- Catalog data that has no dependency on auth.users, so it's safe to seed
-- directly via SQL. Demo accounts (owner/vet/walker) are created separately
-- by scripts/seed-demo-data.mjs, since creating auth users requires the
-- Supabase Admin API, not plain SQL.

insert into lab_test_packages (name, category, description, included_tests, price, turnaround, fasting, icon, color) values
(
  'Basic Wellness Panel',
  'Preventive Screening',
  'A general health snapshot covering blood count, kidney and liver function — great for annual checkups.',
  array['Complete Blood Count (CBC)', 'Kidney function (BUN, Creatinine)', 'Liver enzymes (ALT, ALP)', 'Blood glucose'],
  899,
  '24-48 hrs',
  true,
  'flask-outline',
  '#0F9D8B'
),
(
  'Complete Blood Count (CBC)',
  'Blood Work',
  'Checks red and white blood cell counts to screen for infection, anemia, and other blood disorders.',
  array['Red blood cell count', 'White blood cell count', 'Platelet count', 'Hemoglobin'],
  399,
  '24 hrs',
  false,
  'water-outline',
  '#FF8C42'
),
(
  'Deworming & Parasite Check',
  'Parasite Screening',
  'Screens for intestinal parasites and giardia using a stool sample.',
  array['Fecal ova & parasite exam', 'Giardia antigen test'],
  349,
  '24 hrs',
  false,
  'bug-outline',
  '#E63946'
),
(
  'Skin Allergy Panel',
  'Dermatology',
  'Identifies environmental and food allergens behind itching, rashes, and recurring skin issues.',
  array['Environmental allergen panel', 'Food allergen panel', 'Skin scrape analysis'],
  1499,
  '3-5 days',
  false,
  'body-outline',
  '#3D8BFD'
),
(
  'Senior Pet Screening',
  'Comprehensive Health',
  'A thorough workup for senior pets covering blood chemistry, thyroid, urine and chest imaging review.',
  array['Full blood chemistry panel', 'Thyroid function (T4)', 'Urinalysis', 'Chest X-ray review'],
  2199,
  '48-72 hrs',
  true,
  'heart-outline',
  '#F4A261'
);
