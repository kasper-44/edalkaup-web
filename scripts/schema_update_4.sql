-- Edalkaup pipeline schema update #4
-- Run once in Supabase Dashboard → SQL Editor → New query → paste → Run
-- Project: fakjyfokweehxsonfbez

-- EV spec fields that used to be crammed into the free-text "engine" string
-- (and were wrong for one model — see transform_maps.py history). Broken out
-- so different trims of the same model (e.g. GMC Sierra EV Denali "Max Range"
-- vs "Extended Range") can carry their own verified numbers instead of
-- sharing one hardcoded default. All nullable — most non-EV rows won't use
-- them, and range/towing are left empty until sourced separately.

ALTER TABLE cars ADD COLUMN IF NOT EXISTS battery_kwh numeric;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS horsepower_hp integer;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS range_km integer;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS towing_kg integer;
