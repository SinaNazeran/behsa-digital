-- The «گزارش‌ها» header section now builds its items from the report
-- catalogue. Its hand-written child rows are left in place (hidden by the
-- menu editor), so switching the section back to «بزرگ» restores them.
UPDATE "nav_items" SET "kind" = 'reports' WHERE "parent_id" IS NULL AND "href" = '/reports';
