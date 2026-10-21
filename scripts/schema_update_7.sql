-- Edalkaup pipeline schema update #7
-- Run once in Supabase Dashboard → SQL Editor → New query → paste → Run
-- Project: fakjyfokweehxsonfbez
--
-- price_reduced shows the yellow VERÐ LÆKKAÐ ribbon.
-- previous_price_isk is the struck-through price beside the current one.
-- in_transit shows the blue Á LEIÐINNI ribbon (column also added in update #6).
--
-- The public site already shows these three listings from code until the
-- columns exist. A stored boolean wins after this script, so /stjorn can
-- toggle either ribbon. Re-running sets these three rows again.

ALTER TABLE cars ADD COLUMN IF NOT EXISTS in_transit boolean NOT NULL DEFAULT false;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS expected_arrival text;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS price_reduced boolean NOT NULL DEFAULT false;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS previous_price_isk numeric;

UPDATE cars
SET price_reduced = true,
    previous_price_isk = 3890000
WHERE id = '1b9200de-ce7e-4e23-9ac8-e3ae1c1312b5';

UPDATE cars
SET price_reduced = true,
    previous_price_isk = 2890000
WHERE id = 'f3f4c0da-fec8-4d8b-9749-8eca50ffd153';

UPDATE cars
SET in_transit = true
WHERE id = '0079429b-bf08-4216-a170-432c95ddd8d6'
  AND in_transit = false;

NOTIFY pgrst, 'reload schema';
