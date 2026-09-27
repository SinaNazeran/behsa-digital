-- The contact form and the panel's «درخواست‌ها» section were removed at the
-- business's request; nothing writes or reads this table any more.
-- IRREVERSIBLE: every stored request is deleted — back up first if needed.
DROP TABLE IF EXISTS "leads" CASCADE;