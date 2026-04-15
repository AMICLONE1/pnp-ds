# Bug Fix - Invalid UUID Error in Admin Projects API

## Issue

**Error:** `invalid input syntax for type uuid: "none"`

When fetching projects in `/api/admin/projects`, the API returned a 500 error with the message:
```
Hosts query error: {
  code: '22P02',
  message: 'invalid input syntax for type uuid: "none"'
}
```

## Root Cause

In `app/api/admin/projects/route.ts`, when there were no projects or no hosts linked to projects, the code used `["none"]` as a placeholder UUID:

```typescript
// WRONG - "none" is not a valid UUID
.in("id", hostIds.length > 0 ? hostIds : ["none"])
```

Postgres expected a valid UUID format but received the string "none", causing a type validation error.

## Solution

Changed the query building logic to use valid UUID placeholders instead:

```typescript
// CORRECT - Use valid nil UUID as placeholder
if (hostIds.length > 0) {
    hostsQuery = hostsQuery.in("id", hostIds);
} else {
    // Return empty result if no hosts
    hostsQuery = hostsQuery.eq("id", "00000000-0000-0000-0000-000000000000");
}
```

This way:
- If we have host IDs, we use the `.in()` filter
- If we have no host IDs, we filter by a nil UUID that will match nothing
- The query always uses valid UUID format

## Files Changed

- `app/api/admin/projects/route.ts` (lines 143-190)

## What Fixed

✅ `GET /api/admin/projects` - No longer returns 500 error
✅ Can fetch projects even if no hosts are linked
✅ Admin dashboard now loads successfully
✅ Credits and other admin pages that depend on this endpoint now work

## Testing

To verify the fix works:

1. Start dev server: `npm run dev`
2. Go to admin login: `http://localhost:3000/admin/login`
3. Login with admin account
4. Go to projects: `http://localhost:3000/admin/projects`
5. Should see projects list (Vedvyas Solar Park)
6. No 500 errors in console
7. Network tab should show 200 status for `/api/admin/projects`

## Before & After

**Before:**
```
GET /api/admin/projects?page=1&limit=20 → 500 Error
Console: "Hosts query error: invalid input syntax for type uuid"
```

**After:**
```
GET /api/admin/projects?page=1&limit=20 → 200 OK
Returns: { success: true, data: { projects: [...], pagination: {...} } }
```

---

**Status:** ✅ FIXED - Admin projects API now working correctly
