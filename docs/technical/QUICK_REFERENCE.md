# PowerNetPro Phase 2 - Quick Reference

## 🎯 What Was Built

| Feature | Status | Location |
|---------|--------|----------|
| PPA PDF Upload | ✅ Done | `/api/admin/projects` (POST) |
| Project Live/Draft | ✅ Done | Project status field |
| Credits Admin Page | ✅ Done | `/admin/credits` |
| Logger API Key | ✅ Done | `projects.logger_api_key` |
| Admin UI Redesign | ✅ Done | Sidebar + Icons |

---

## 🔧 Database Setup (REQUIRED)

### SQL Migration
```bash
# File: supabase/migrations/20260409_complete_schema_fixes.sql
# Action: Copy → Supabase SQL Editor → Run

# Adds:
# - data_logger_serial_id column
# - logger_api_key column  
# - 15 performance indexes
# - ppa-documents bucket
```

### Storage Policies (REQUIRED)
```
Supabase > Storage > ppa-documents > Policies

Policy 1: Authenticated users can read PPA documents
Policy 2: Authenticated users can upload PPA documents
```

---

## 🧪 Test Everything

### Run Tests
```bash
cd d:/PowerNetPro/PNP-DSnew
bash test-endpoints.sh
```

### Check Database
```sql
-- Verify columns added
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name IN ('data_logger_serial_id', 'logger_api_key');

-- Should show 2 rows
```

### Check Storage
```
Supabase Dashboard > Storage > ppa-documents
Should see: 2 policies, file_size_limit: 10485760 bytes
```

---

## 🚀 Admin Features

### Admin Projects Page
```
URL: /admin/projects
Features:
- View all projects (paginated)
- Create new project with PPA upload
- Set project status (DRAFT/ACTIVE)
- View PPA document (iframe modal)
- Search by name, location, ID
- Filter by status
```

### Admin Credits Page
```
URL: /admin/credits  
Features:
- View credit ledger (all users)
- Search by user name/email
- Filter by status: PENDING/APPLIED/EXPIRED
- Filter by type: GENERATION/ADJUSTMENT/REFUND
- Pagination: 20 items/page
- Stat cards (pending, applied, expired, active users)
```

---

## 📊 Key Files

### Created (NEW)
```
app/admin/credits/page.tsx                    - Credits UI
app/api/admin/credits/route.ts                - Credits API
app/api/admin/projects/[id]/ppa-url/route.ts  - Admin PPA URL
app/api/host/ppa-url/route.ts                 - Host PPA URL
lib/utils/admin/useCredits.ts                 - Credits hook
supabase/migrations/20260409_complete_schema_fixes.sql - DB migration
DATABASE_SETUP_GUIDE.md                       - Setup instructions
TESTING_REPORT.md                             - Test results
PHASE2_IMPLEMENTATION_SUMMARY.md              - Full summary
```

### Modified (IMPORTANT)
```
app/api/admin/projects/route.ts               - PDF upload + logger_api_key
lib/utils/admin/useProjects.ts                - Multipart form handling
components/admin/AdminSidebar.tsx             - Logo redesign
app/admin/projects/page.tsx                   - IndianRupee icons
```

---

## 🔑 API Quick Reference

### Admin Protected Endpoints
```
GET  /api/admin/projects?page=1&limit=20&status=all&search=
GET  /api/admin/projects/:id/ppa-url
POST /api/admin/projects (multipart/form-data)
GET  /api/admin/credits?page=1&limit=20&status=&type=&search=
```

### Host Protected Endpoints
```
GET  /api/host/ppa-url
GET  /api/host/dashboard
GET  /api/host/billing/current
```

### Public Endpoints
```
GET  /api/projects (returns ACTIVE only)
```

---

## ⚡ Common Tasks

### Create Project with PPA
```javascript
const formData = new FormData();
formData.append('spv_id', 'SPV-001');
formData.append('name', 'Project Name');
formData.append('total_kw', 100);
formData.append('rate_per_kwh', 7.5);
formData.append('location', 'Mumbai');
formData.append('state', 'Maharashtra');
formData.append('data_logger_serial_id', 'DL-12345');
formData.append('logger_api_key', 'api-key-here');
formData.append('host_business_name', 'Host Company');
formData.append('host_contact_name', 'John Doe');
formData.append('host_contact_email', 'john@example.com');
formData.append('host_contact_phone', '9876543210');
formData.append('host_password', 'SecurePassword123!');
formData.append('ppa_document', pdfFile); // File object

await fetch('/api/admin/projects', {
  method: 'POST',
  body: formData
});
```

### Toggle Project Status
```javascript
// In admin projects page, change status dropdown
// Values: DRAFT, ACTIVE, MAINTENANCE, RETIRED
// DRAFT projects hidden from /reserve page
```

### View PPA as Admin
```javascript
const response = await fetch('/api/admin/projects/project-id/ppa-url');
const { url } = await response.json();
// Use url in iframe or download link
```

### View PPA as Host
```javascript
const response = await fetch('/api/host/ppa-url');
const { url } = await response.json();
// Use url in iframe or download link
```

---

## 🚨 Troubleshooting

| Error | Solution |
|-------|----------|
| `GET /api/admin/projects 500` | Run database migration first |
| `Authentication required` | Login at `/admin/login` or `/host/login` |
| `Column does not exist` | Run migration, wait for Supabase to process |
| `PDF upload fails` | Check bucket exists + policies are set |
| `Can't view PPA` | Verify signed URL not expired (1 hour) |

---

## 📞 Support

### Documentation Files
- **Setup Guide:** `DATABASE_SETUP_GUIDE.md`
- **Test Results:** `TESTING_REPORT.md`
- **Full Summary:** `PHASE2_IMPLEMENTATION_SUMMARY.md`
- **Plan Details:** `.claude/plans/ancient-launching-conway.md`

### Emergency Steps
1. Restart dev server: `npm run dev`
2. Clear browser cache: Ctrl+Shift+Delete
3. Check Supabase status: Visit status.supabase.com
4. Check env variables: `.env.local` has Supabase URL + keys

---

**Status: READY FOR DATABASE SETUP & TESTING ✅**

Next: Run database migration from `supabase/migrations/20260409_complete_schema_fixes.sql`
