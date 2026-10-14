-- Edalkaup pipeline schema update #6
-- Run once in Supabase Dashboard → SQL Editor → New query → paste → Run
-- Project: fakjyfokweehxsonfbez
--
-- Cars on the way to Iceland stay status = 'live'. in_transit swaps the
-- public badge from green «Til sölu» to amber «Á leiðinni».
-- expected_arrival is optional display text such as «nóv 2026».
-- The site prefixes it as «Væntanlegur: nóv 2026». NULL hides the line.
--
-- The Volvo XC60 T6 is marked in transit with no arrival date.
-- Re-running this script does not clear an arrival date set later.

ALTER TABLE cars ADD COLUMN IF NOT EXISTS in_transit boolean NOT NULL DEFAULT false;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS expected_arrival text;

UPDATE cars
SET in_transit = true
WHERE id = '3fe233e6-b914-4cdf-868f-2acfa87884c4'
  AND in_transit = false;

NOTIFY pgrst, 'reload schema';
