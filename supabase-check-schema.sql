-- Check existing schema in Supabase
-- Run this to see what tables already exist

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
