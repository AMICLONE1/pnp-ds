-- ============================================
-- FIX: RLS Infinite Recursion on "users" table
-- Created: 2026-02-12
-- Problem: Policies on hosts/ppa_agreements/etc.
--          use subqueries on public.users to check
--          admin role, triggering users RLS evaluation
--          which causes infinite recursion (42P17).
--          ALSO: Any self-referential admin policy on
--          the users table itself causes recursion.
-- Solution: SECURITY DEFINER functions that bypass
--           RLS when checking user roles.
-- ============================================

-- 1. Create helper function to get current user's role (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. Convenience check functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT public.get_user_role() = 'ADMIN'::user_role;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_host()
RETURNS boolean AS $$
  SELECT public.get_user_role() = 'HOST'::user_role;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 3. Helper to get current user's host_id (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_host_id()
RETURNS UUID AS $$
  SELECT id FROM public.hosts WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- 4. FIX USERS TABLE - Drop any self-referential
--    admin policies that cause recursion
-- ============================================

-- Drop ALL known problematic policies on users table
-- (These might have been added via Supabase dashboard)
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
DROP POLICY IF EXISTS "Admin full access" ON public.users;
DROP POLICY IF EXISTS "admin_read_all_users" ON public.users;
DROP POLICY IF EXISTS "admin_manage_users" ON public.users;
DROP POLICY IF EXISTS "Enable read access for admin users" ON public.users;
DROP POLICY IF EXISTS "Enable update for admin users" ON public.users;
DROP POLICY IF EXISTS "Enable delete for admin users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for admin users" ON public.users;

-- Also drop and recreate the base policies to be safe
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Recreate clean users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Admin access to users: uses SECURITY DEFINER function (no recursion)
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (public.is_admin());

-- ============================================
-- 5. Drop and recreate ALL host-related policies
-- ============================================

-- === HOSTS TABLE ===
DROP POLICY IF EXISTS "Admins can manage hosts" ON public.hosts;
CREATE POLICY "Admins can manage hosts" ON public.hosts
    FOR ALL USING (public.is_admin());

-- === PPA AGREEMENTS TABLE ===
DROP POLICY IF EXISTS "Hosts can view own PPAs" ON public.ppa_agreements;
CREATE POLICY "Hosts can view own PPAs" ON public.ppa_agreements
    FOR SELECT USING (host_id = public.get_host_id());

DROP POLICY IF EXISTS "Admins can manage PPAs" ON public.ppa_agreements;
CREATE POLICY "Admins can manage PPAs" ON public.ppa_agreements
    FOR ALL USING (public.is_admin());

-- === HOST PAYMENTS TABLE ===
DROP POLICY IF EXISTS "Hosts can view own payments" ON public.host_payments;
CREATE POLICY "Hosts can view own payments" ON public.host_payments
    FOR SELECT USING (host_id = public.get_host_id());

DROP POLICY IF EXISTS "Admins can manage host payments" ON public.host_payments;
CREATE POLICY "Admins can manage host payments" ON public.host_payments
    FOR ALL USING (public.is_admin());

-- === HOST INVOICES TABLE ===
DROP POLICY IF EXISTS "Hosts can view own invoices" ON public.host_invoices;
CREATE POLICY "Hosts can view own invoices" ON public.host_invoices
    FOR SELECT USING (host_id = public.get_host_id());

DROP POLICY IF EXISTS "Admins can manage host invoices" ON public.host_invoices;
CREATE POLICY "Admins can manage host invoices" ON public.host_invoices
    FOR ALL USING (public.is_admin());

-- === HOST ALERTS TABLE ===
DROP POLICY IF EXISTS "Hosts can view own alerts" ON public.host_alerts;
CREATE POLICY "Hosts can view own alerts" ON public.host_alerts
    FOR SELECT USING (host_id = public.get_host_id());

DROP POLICY IF EXISTS "Hosts can acknowledge own alerts" ON public.host_alerts;
CREATE POLICY "Hosts can acknowledge own alerts" ON public.host_alerts
    FOR UPDATE USING (host_id = public.get_host_id());

DROP POLICY IF EXISTS "Admins can manage host alerts" ON public.host_alerts;
CREATE POLICY "Admins can manage host alerts" ON public.host_alerts
    FOR ALL USING (public.is_admin());

-- === PROJECTS TABLE (host policy) ===
DROP POLICY IF EXISTS "Hosts can view own projects" ON public.projects;
CREATE POLICY "Hosts can view own projects" ON public.projects
    FOR SELECT USING (host_id = public.get_host_id());

-- === AUDIT LOG (existing policy from schema.sql also has the same bug) ===
DROP POLICY IF EXISTS "Admins can view audit log" ON public.audit_log;
CREATE POLICY "Admins can view audit log" ON public.audit_log
    FOR SELECT USING (public.is_admin());
