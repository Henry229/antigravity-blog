-- ============================================================================
-- Migration: Fix Function search_path for SQL Injection Protection
-- Date: 2025-01-11
-- Description: Add search_path to all functions to prevent SQL injection attacks
-- Reference: https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable
-- ============================================================================

-- NOTE: This migration should be applied AFTER your project functions are created
-- Adjust function names and signatures based on your actual database schema

-- Example: Auth-related functions
-- ALTER FUNCTION public.handle_new_user() SET search_path = public, auth;
-- ALTER FUNCTION public.handle_updated_at() SET search_path = public;

-- Example: Custom functions (adjust based on your schema)
-- ALTER FUNCTION public.your_function_name() SET search_path = public;

-- To find all functions without search_path:
-- SELECT n.nspname AS schema_name, p.proname AS function_name
-- FROM pg_proc p
-- JOIN pg_namespace n ON n.oid = p.pronamespace
-- WHERE n.nspname = 'public' AND p.prokind = 'f';
