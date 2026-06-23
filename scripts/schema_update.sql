-- Edalkaup pipeline schema update
-- Run once in Supabase Dashboard → SQL Editor → New query → paste → Run
-- Project: fakjyfokweehxsonfbez

-- 1) Add columns for the original North-American listing price.
--    The pipeline fills these; you decide price_isk yourself.
ALTER TABLE cars ADD COLUMN IF NOT EXISTS price_original numeric;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS price_currency text;   -- 'USD' or 'CAD'

-- 2) Track when a car was last seen on Auto.dev (for sold-detection auditing).
ALTER TABLE cars ADD COLUMN IF NOT EXISTS last_seen_at timestamptz;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS vin text;

-- 3) Allow the three lifecycle states: draft (hidden), live (on site), sold (hidden).
--    Drop the old status CHECK constraint (whatever it is named) and recreate it.
DO $$
DECLARE
  c text;
BEGIN
  SELECT conname INTO c
  FROM pg_constraint
  WHERE conrelid = 'cars'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) ILIKE '%status%';
  IF c IS NOT NULL THEN
    EXECUTE format('ALTER TABLE cars DROP CONSTRAINT %I', c);
  END IF;
END $$;

ALTER TABLE cars
  ADD CONSTRAINT cars_status_check
  CHECK (status IN ('draft', 'live', 'sold', 'in-transit'));

-- 4) Default new rows to 'draft' so nothing publishes before you price it.
ALTER TABLE cars ALTER COLUMN status SET DEFAULT 'draft';

-- 5) Helpful index for the daily VIN re-check.
CREATE INDEX IF NOT EXISTS idx_cars_vin ON cars (vin);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars (status);
