-- Edalkaup pipeline schema update #3
-- Run once in Supabase Dashboard → SQL Editor → New query → paste → Run
-- Project: fakjyfokweehxsonfbez

-- Publish safeguard: a car cannot go status='live' unless a human has
-- explicitly confirmed its price and specs. Defaults to false for every row —
-- including existing 'live' rows, since none of them were ever actually
-- reviewed (that's the bug this migration exists to stop happening again).

ALTER TABLE cars ADD COLUMN IF NOT EXISTS price_verified boolean DEFAULT false;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS specs_verified boolean DEFAULT false;
