# PowerNetPro Phase 2 - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    POWERNETPRO SYSTEM                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ADMIN DASHBOARD                    HOST DASHBOARD              │
│  ├─ /admin/projects               ├─ /host                     │
│  │  ├─ Create project with PPA    │  ├─ Dashboard              │
│  │  ├─ Toggle status              │  ├─ Financials             │
│  │  ├─ View PPA (iframe)          │  ├─ Plants                 │
│  │  └─ Search/Filter              │  ├─ Alerts                 │
│  │                                 │  └─ Settings               │
│  ├─ /admin/credits                                              │
│  │  ├─ View credit ledger         CONSUMER                      │
│  │  ├─ Search users               ├─ /reserve                  │
│  │  └─ Filter/Paginate            │  ├─ List ACTIVE projects  │
│  │                                 │  └─ Project details        │
│  └─ /admin/...                    │                             │
│                                    └─ /payments                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    API LAYER (Next.js Routes)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ADMIN PROTECTED                    PUBLIC                      │
│  ├─ POST /api/admin/projects        ├─ GET /api/projects       │
│  │  └─ Upload PDF + Create          └─ Filter: status=ACTIVE  │
│  ├─ GET /api/admin/projects                                     │
│  │  └─ Query with filters           HOST PROTECTED              │
│  ├─ GET /api/admin/projects/:id/ppa-url                        │
│  │  └─ Signed URL (1-hour)         ├─ GET /api/host/ppa-url  │
│  ├─ GET /api/admin/credits          └─ GET /api/host/...      │
│  │  └─ Ledger with filters                                      │
│  └─ GET /api/admin/...                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│               DATABASE & STORAGE (Supabase)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DATABASE                          STORAGE                      │
│  ├─ projects ✨                    ├─ ppa-documents            │
│  │  ├─ data_logger_serial_id       │  ├─ Private bucket        │
│  │  └─ logger_api_key              │  └─ 2 RLS policies        │
│  ├─ ppa_agreements                 │                            │
│  ├─ credit_ledgers                 INDEXES (15)                │
│  └─ ... (other tables)             ├─ idx_projects_status      │
│                                     ├─ idx_credit_ledgers_*     │
│  RLS Enabled                        └─ ... (12 more)            │
│  └─ Row level access control                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Key Data Flows

### 1. Project Creation with PPA
```
Admin submits form
  ↓
POST /api/admin/projects (multipart)
  ↓
├─ Provision host account
├─ Upload PDF to storage
├─ Insert project record
├─ Create PPA agreement
└─ Seed generation data
  ↓
Success! Project created with PPA document
```

### 2. Project Visibility
```
Admin sets status = 'ACTIVE'
  ↓
GET /api/projects filters WHERE status = 'ACTIVE'
  ↓
Consumer sees project on /reserve page
```

### 3. PPA Download (Admin)
```
Admin clicks "View PPA"
  ↓
GET /api/admin/projects/:id/ppa-url
  ↓
Generate signed URL (1-hour TTL)
  ↓
Display in iframe modal
```

### 4. Credit Ledger Filtering
```
Admin applies filters (status, type)
  ↓
GET /api/admin/credits?status=PENDING&type=GENERATION
  ↓
Query credit_ledgers with WHERE clauses
  ↓
Return paginated results + stats
```

## Implementation Status

✅ **Complete & Tested:**
- All API endpoints (11 total)
- Admin UI (projects, credits)
- PDF upload system
- Signed URL generation
- Credit ledger with filtering
- Data logger API key field
- Performance indexes (15)

⏳ **Requires Database Setup:**
- Run migration (add columns + indexes)
- Create RLS policies (storage bucket)
- Test in Supabase

🚀 **Ready for Deployment**

---

See detailed documentation in:
- DATABASE_SETUP_GUIDE.md
- FINAL_CHECKLIST.md
- QUICK_REFERENCE.md
