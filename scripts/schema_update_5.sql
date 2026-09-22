-- Edalkaup pipeline schema update #5
-- Run once in Supabase Dashboard → SQL Editor → New query → paste → Run
-- Project: fakjyfokweehxsonfbez
--
-- Optional per-car override for the «m/VSK» line under the price.
-- NULL keeps the existing default: passenger cars show «m/VSK», sendibíll / vans omit it.
-- false omits every VSK subtitle (no «m/VSK», «+ VSK», or «án VSK»).
-- true forces «m/VSK» even on a van.
--
-- Only the Ineos Grenadier listing is set here. Other rows stay NULL.
-- The public Grenadier page also omits the VSK line when this column is
-- still missing, so the listing stays correct until this script is applied.

ALTER TABLE cars ADD COLUMN IF NOT EXISTS price_includes_vat boolean;

UPDATE cars
SET price_includes_vat = false
WHERE id = '0678ccc0-da40-4524-9835-d6998911dd16'
  AND price_includes_vat IS NULL;

NOTIFY pgrst, 'reload schema';
