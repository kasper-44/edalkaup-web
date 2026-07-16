-- Edalkaup pipeline schema update #2
-- Run once in Supabase Dashboard → SQL Editor → New query → paste → Run
-- Project: fakjyfokweehxsonfbez

-- Fixes /stjorn's "sort by newest first": the code called .order('created_at', ...)
-- but the table never had that column — only unpopulated created_day/month/year
-- integers (never written by any insert path) and a random (non-time-ordered) uuid id.

ALTER TABLE cars ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Backfill existing rows. last_seen_at is the closest real timestamp we have
-- for rows the daily sync has touched; anything left over (older/manual rows)
-- falls back to now() so sorting is at least stable, not null-first.
UPDATE cars SET created_at = last_seen_at WHERE created_at IS NULL AND last_seen_at IS NOT NULL;
UPDATE cars SET created_at = now() WHERE created_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_cars_created_at ON cars (created_at);
