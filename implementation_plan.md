# Separate Login Pages and RBAC Implementation

Currently, the project uses a single `/login` page that checks the user's role after login and redirects them to the appropriate dashboard (`/host`, `/dashboard`). The `/admin` routes are protected client-side via [app/admin/layout.tsx](file:///d:/07/PNP-DS/app/admin/layout.tsx), while `/host` routes are protected server-side via [middleware.ts](file:///d:/07/PNP-DS/middleware.ts).

To create dedicated login pages for each role and enforce a robust Role-Based Access Control (RBAC) system, I propose the following changes:

## 1. Create Dedicated Login Pages
We will separate the unified login page into three distinct pages, each tailored for its specific audience:

#### [MODIFY] [app/login/page.tsx](file:///d:/07/PNP-DS/app/login/page.tsx) (User Login)
- **Purpose**: Exclusively for standard electricity consumers (Users).
- **Changes**: Remove the host verification check `fetch("/api/host/verify")`. If the logged-in user's role is not `USER`, display an error or redirect them to their correct login page.

#### [NEW] `app/host/login/page.tsx` (Host Login)
- **Purpose**: Exclusively for Host partners managing solar plants.
- **Changes**: Duplicate the login UI but change the branding (e.g., "Host Portal"). Validate that the signing-in user has the `HOST` role. If successful, redirect to `/host`.

#### [NEW] `app/admin/login/page.tsx` (Admin Login)
- **Purpose**: Exclusively for internal Administrators.
- **Changes**: Provide a secure, minimalist login interface. Validate that the user has the `ADMIN` role. If successful, redirect to `/admin/dashboard` or `/admin/users`.

## 2. Centralize RBAC in Middleware
Currently, [middleware.ts](file:///d:/07/PNP-DS/middleware.ts) handles Host protection, but Admin protection is done client-side. We should enforce all RBAC rules centrally in [middleware.ts](file:///d:/07/PNP-DS/middleware.ts).

#### [MODIFY] [middleware.ts](file:///d:/07/PNP-DS/middleware.ts)
- **Define Route Groups**:
  - `ADMIN_ROUTES = ["/admin"]`
  - `HOST_ROUTES = ["/host"]`
  - `USER_ROUTES = ["/dashboard", "/bills", "/reserve", "/connect"]`
- **Enforce Authentication & Redirection**:
  - Unauthenticated users accessing `ADMIN_ROUTES` -> Redirect to `/admin/login`.
  - Unauthenticated users accessing `HOST_ROUTES` -> Redirect to `/host/login`.
  - Unauthenticated users accessing `USER_ROUTES` -> Redirect to `/login`.
- **Enforce Role Isolation (Prevent Cross-Access)**:
  - If a `USER` tries to access `/host` or `/admin`, redirect to `/dashboard`.
  - If a `HOST` tries to access `/dashboard` or `/admin`, redirect to `/host`.
  - If an `ADMIN` tries to access `/dashboard` or `/host`, redirect to `/admin`.

## 3. Clean Up Client-Side Checks
Since [middleware.ts](file:///d:/07/PNP-DS/middleware.ts) will handle security at the edge, we can simplify our React layouts.

#### [MODIFY] [app/admin/layout.tsx](file:///d:/07/PNP-DS/app/admin/layout.tsx)
- **Changes**: Remove the client-side `fetch("/api/admin/verify")` check and the `<AdminSkeleton />` loading state. The middleware guarantees only Admins reach this layout, improving page load performance and security.

## Verification Plan
1. **Manual Testing - Unauthenticated Access**:
   - Attempt to visit `/dashboard`, `/admin`, and `/host` while logged out. Verify they redirect to `/login`, `/admin/login`, and `/host/login` respectively.
2. **Manual Testing - Authentication**:
   - Login as a User on `/login` -> Should redirect to `/dashboard`.
   - Login as a Host on `/host/login` -> Should redirect to `/host`.
   - Login as an Admin on `/admin/login` -> Should redirect to `/admin`.
3. **Manual Testing - Cross-Role Access**:
   - While logged in as a User, attempt to visit `/admin` -> Should redirect back to `/dashboard`.
   - While logged in as an Admin, attempt to visit `/host` -> Should redirect back to `/admin`.
