# PowerNetPro Phase 2 - Complete Test Scenarios

## Overview

This document contains step-by-step test scenarios for all Phase 2 features using the mock Vedvyas Solar Park project.

---

## 🎯 Test Environment Setup

**Before starting:** Follow TESTING_SETUP.md to create test accounts and data.

Test Accounts:
- Admin: `admin@powernetpro.test` / `AdminTest123!@#`
- Host: `host@vedvyas.test` / `HostTest123!@#`
- Consumer: `consumer@powernetpro.test` / `ConsumerTest123!@#`

---

## 📋 Test Scenario 1: Admin Creates Project with PPA

**Purpose:** Test PPA PDF upload during project creation

**Steps:**
1. Login to admin dashboard: `/admin/login`
2. Go to `/admin/projects`
3. Click "Create New Project" button
4. Fill in form:
   ```
   Project Details:
   - SPV ID: SPV-PNP-TEST-002
   - Project Name: Test Solar Farm
   - Total Capacity: 50 kW
   - Rate per kWh: ₹7.50
   - Location: Delhi
   - State: Delhi
   - Description: Testing PPA upload feature
   
   Host Details:
   - Business Name: Test Solar Host
   - Contact Name: John Doe
   - Contact Email: host2@test.com
   - Contact Phone: 9876543210
   - Password: TestHost123!@#
   
   Data Logger:
   - Serial ID: DLS-TEST-001
   - API Key: test-api-key-12345
   
   PPA Document:
   - Click to upload PDF file (max 10MB)
   - Select any PDF file
   ```

5. Click "Create Project" button

**Expected Results:**
- ✅ Form validates all fields
- ✅ PDF file is uploaded to Supabase Storage
- ✅ Host account is automatically created
- ✅ Project appears in projects list with DRAFT status
- ✅ PPA agreement is created
- ✅ Generation snapshots are seeded
- ✅ Success message appears

**Verify:**
- [ ] New project visible in `/admin/projects` list
- [ ] Status is "DRAFT"
- [ ] Host email appears in host column
- [ ] Can click "View PPA" and see document

---

## 📋 Test Scenario 2: Admin Toggles Project Status (DRAFT → ACTIVE)

**Purpose:** Test project visibility control

**Steps:**
1. In `/admin/projects` page
2. Click on the Test Solar Farm project row
3. In the project details, find the "Status" dropdown
4. Change from "DRAFT" to "ACTIVE"
5. Click "Save" or "Update Project"

**Expected Results:**
- ✅ Status changes to ACTIVE in database
- ✅ Project now visible to consumers
- ✅ Confirmation message appears

**Verify:**
- [ ] Status shows "ACTIVE" in admin projects list
- [ ] Logout and login as consumer
- [ ] Go to `/reserve`
- [ ] Both projects visible (Vedvyas + Test Solar Farm)

---

## 📋 Test Scenario 3: Admin Views PPA Document

**Purpose:** Test signed URL generation and PDF viewing

**Steps:**
1. In `/admin/projects` page
2. Find the Test Solar Farm project
3. Click "View PPA" button (📄 icon or link)

**Expected Results:**
- ✅ Modal opens with iframe
- ✅ PDF document displays
- ✅ Can scroll through document
- ✅ Download button works

**Verify:**
- [ ] PDF opens in iframe modal
- [ ] Modal title shows project name
- [ ] Can download PDF
- [ ] Close button works

---

## 📋 Test Scenario 4: Admin Searches Projects

**Purpose:** Test project search functionality

**Steps:**
1. Go to `/admin/projects`
2. In search bar, type: "test"
3. Press Enter or wait for auto-search

**Expected Results:**
- ✅ Projects filtered by name
- ✅ Shows Test Solar Farm and maybe others matching "test"
- ✅ Vedvyas may not show (doesn't match "test")

**Variations:**
- Search by location: type "delhi"
- Search by SPV ID: type "SPV-PNP"
- Search by logger serial: type "DLS-TEST"

---

## 📋 Test Scenario 5: Admin Views Credits Ledger

**Purpose:** Test credit tracking for users

**Steps:**
1. Go to `/admin/credits`
2. Observe the page

**Expected Results:**
- ✅ Page loads with credit entries
- ✅ Stat cards show:
  - Total Pending Credits
  - Total Applied Credits
  - Total Expired Credits
  - Active Credit Users (count)

**Verify:**
- [ ] Credit entries visible in table
- [ ] Columns: User, Amount (₹), Type, Status, Period, Description, Date
- [ ] At least one entry for consumer user

---

## 📋 Test Scenario 6: Admin Filters Credits by Status

**Purpose:** Test credit status filtering

**Steps:**
1. In `/admin/credits`
2. Click "Status" dropdown
3. Select "PENDING"
4. Credits table updates

**Expected Results:**
- ✅ Only PENDING credits shown
- ✅ Count reflects filtered results
- ✅ Stat cards update accordingly

**Verify:**
- [ ] Try different status filters: PENDING, APPLIED, EXPIRED
- [ ] Each filter works correctly
- [ ] "All" shows everything

---

## 📋 Test Scenario 7: Admin Filters Credits by Type

**Purpose:** Test credit type filtering

**Steps:**
1. In `/admin/credits`
2. Click "Type" dropdown
3. Select "GENERATION"
4. Credits table updates

**Expected Results:**
- ✅ Only GENERATION type credits shown
- ✅ Other types (ADJUSTMENT, REFUND) hidden
- ✅ Count reflects filtered results

**Verify:**
- [ ] Try different type filters
- [ ] Can combine status + type filters
- [ ] Pagination works with filters

---

## 📋 Test Scenario 8: Admin Searches Credits by User

**Purpose:** Test credit search by user name/email

**Steps:**
1. In `/admin/credits`
2. In search bar, type: "Consumer" or "consumer@"
3. Press Enter

**Expected Results:**
- ✅ Credits filtered to matching user
- ✅ Shows all credits for that user
- ✅ Can see user email in results

**Verify:**
- [ ] Search by full name works
- [ ] Search by email works
- [ ] Search is case-insensitive
- [ ] Partial matches work

---

## 📋 Test Scenario 9: Admin Paginates Credits

**Purpose:** Test pagination of credit ledger

**Steps:**
1. In `/admin/credits`
2. If many credits exist, go to next page
3. Click page numbers at bottom

**Expected Results:**
- ✅ Shows 20 credits per page
- ✅ Pagination controls work
- ✅ Can navigate between pages
- ✅ Page number updates

**Verify:**
- [ ] "Previous" button works
- [ ] "Next" button works
- [ ] Page numbers update
- [ ] Back to page 1 after going forward

---

## 🏢 Test Scenario 10: Host Logs In & Sees Dashboard

**Purpose:** Test host authentication and dashboard

**Steps:**
1. Go to `/host/login`
2. Login with: `host@vedvyas.test` / `HostTest123!@#`
3. Should redirect to `/host`

**Expected Results:**
- ✅ Login successful
- ✅ Redirects to `/host` dashboard
- ✅ Shows host-specific data
- ✅ Welcome message shows host name

**Verify:**
- [ ] Dashboard loads
- [ ] Shows solar plants
- [ ] Shows generation data
- [ ] Shows financials section

---

## 🏢 Test Scenario 11: Host Views Financials Dashboard

**Purpose:** Test host financial features

**Steps:**
1. Login as host
2. Go to `/host/financials`
3. Observe all sections

**Expected Results:**
- ✅ Page loads with multiple sections
- ✅ KPI cards visible (Revenue, Billing, etc.)
- ✅ Billing history table shows data
- ✅ Payment status overview visible
- ✅ Revenue charts visible

**Verify:**
- [ ] Can see billing history
- [ ] Can see payment status breakdown
- [ ] Can see revenue trends
- [ ] Tax calculations display
- [ ] Currency shows in ₹

---

## 🏢 Test Scenario 12: Host Downloads PPA Document

**Purpose:** Test host access to signed PPA URL

**Steps:**
1. Login as host
2. Go to `/host/financials` or home
3. Look for "View PPA" or "Download Agreement" button

**Expected Results:**
- ✅ Can access their PPA document
- ✅ PDF opens or downloads
- ✅ Can view agreement details

**Verify:**
- [ ] PDF is accessible
- [ ] Is their actual PPA (not another host's)
- [ ] Signed URL valid

---

## 👤 Test Scenario 13: Consumer Views Available Projects

**Purpose:** Test project visibility for consumers

**Steps:**
1. Go to `/reserve` (no login needed)
2. Observe projects displayed

**Expected Results:**
- ✅ Only ACTIVE projects shown
- ✅ Shows Vedvyas Solar Park
- ✅ Shows Test Solar Farm (after toggling to ACTIVE)
- ✅ Does NOT show DRAFT projects
- ✅ Shows project details: capacity, rate, savings

**Verify:**
- [ ] Vedvyas (ACTIVE) is visible
- [ ] Test Solar Farm (ACTIVE) is visible
- [ ] Any DRAFT projects are hidden
- [ ] Can see capacity available
- [ ] Can see ₹/kWh rate

---

## 👤 Test Scenario 14: Consumer Logs In & Sees Dashboard

**Purpose:** Test consumer authentication

**Steps:**
1. Go to `/login`
2. Login with: `consumer@powernetpro.test` / `ConsumerTest123!@#`
3. Should redirect to consumer dashboard

**Expected Results:**
- ✅ Login successful
- ✅ Redirects to `/` or `/dashboard`
- ✅ Shows personalized content

**Verify:**
- [ ] Dashboard loads
- [ ] Shows username/email
- [ ] Can navigate to reserved projects

---

## 👤 Test Scenario 15: Consumer Views Their Credits

**Purpose:** Test consumer credit visibility

**Steps:**
1. Login as consumer
2. Go to `/settings` or credit section
3. Look for credits display

**Expected Results:**
- ✅ Shows user's total credits
- ✅ Shows credit breakdown
- ✅ Shows applied vs pending credits

**Verify:**
- [ ] Can see credit balance
- [ ] Can see credit history
- [ ] Credits match what admin sees

---

## 👤 Test Scenario 16: Consumer Reserves Capacity

**Purpose:** Test end-to-end consumer purchase flow

**Steps:**
1. Login as consumer (if not already)
2. Go to `/reserve`
3. Click on Vedvyas Solar Park
4. Click "Reserve Capacity"
5. Select amount (e.g., 5 kW)
6. Review and confirm
7. Complete payment

**Expected Results:**
- ✅ Can select capacity
- ✅ Allocation created
- ✅ Credits calculated
- ✅ Payment processed

**Verify:**
- [ ] Allocation appears in user's account
- [ ] Capacity blocks marked as ALLOCATED
- [ ] Generation credits start flowing

---

## 🔒 Test Scenario 17: Security - Unauthorized Access

**Purpose:** Test authentication enforcement

**Steps:**
1. Try to access `/admin/projects` without login
2. Try to access `/host` without login
3. Try to access `/admin/credits` without admin role

**Expected Results:**
- ✅ Redirects to login page
- ✅ Shows "Authentication required" error
- ✅ Admin endpoints return 401

**Verify:**
- [ ] Non-authenticated users blocked
- [ ] Non-admin users blocked from admin
- [ ] Non-host users blocked from host dashboard

---

## 🔒 Test Scenario 18: Data Isolation

**Purpose:** Test that users only see their own data

**Steps:**
1. Login as consumer
2. Try to see other user's credits (via URL manipulation if possible)
3. Login as host
4. Try to see other host's PPA

**Expected Results:**
- ✅ Cannot see other users' data
- ✅ RLS prevents unauthorized access
- ✅ Each user sees only their records

**Verify:**
- [ ] Consumer can't see other user credits
- [ ] Host can't see other host's PPA
- [ ] Admin can see all (intentional)

---

## 📱 Test Scenario 19: Responsive Design

**Purpose:** Test UI on different screen sizes

**Steps:**
1. Open admin projects page
2. Resize browser to mobile size (375px width)
3. Check if layout adapts
4. Test on tablet size (768px)

**Expected Results:**
- ✅ Layout adapts to screen size
- ✅ Navigation stays functional
- ✅ Tables are scrollable if needed
- ✅ Modals display correctly

**Verify:**
- [ ] Mobile: Can use dashboard
- [ ] Tablet: Can view all sections
- [ ] Desktop: Optimal layout

---

## 🐛 Test Scenario 20: Error Handling

**Purpose:** Test error scenarios

**Steps:**

**Scenario A: Network Error**
1. Go to projects page
2. Disconnect internet
3. Try to load data

**Scenario B: Invalid Input**
1. Try to upload non-PDF file
2. Try to upload file > 10MB

**Scenario C: Database Error**
1. Stop database connection
2. Try API call

**Expected Results:**
- ✅ Shows friendly error messages
- ✅ Suggests remediation
- ✅ Doesn't crash

**Verify:**
- [ ] Error messages are clear
- [ ] User can retry
- [ ] Can see actual error in console

---

## ✅ Quick Testing Checklist

### Admin Features
- [ ] Create project with PPA upload
- [ ] Toggle project status DRAFT→ACTIVE
- [ ] View PPA document in modal
- [ ] Search projects
- [ ] View credits ledger
- [ ] Filter credits by status
- [ ] Filter credits by type
- [ ] Search credits by user
- [ ] Paginate through credits

### Host Features
- [ ] Login to host dashboard
- [ ] View financials dashboard
- [ ] See billing history
- [ ] See payment status
- [ ] View revenue charts
- [ ] Download their PPA
- [ ] See generation data

### Consumer Features
- [ ] View ACTIVE projects only
- [ ] Login to consumer account
- [ ] See own credits
- [ ] Reserve capacity
- [ ] View allocations

### Security
- [ ] Cannot access without login
- [ ] Cannot access other roles' areas
- [ ] Cannot see other users' data

### UI/UX
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Error handling works
- [ ] Icons display correctly

---

## 🎯 Success Criteria

Phase 2 testing is successful when:

- ✅ All 20 test scenarios pass
- ✅ No 500 errors on any endpoint
- ✅ All features work as documented
- ✅ Security is enforced
- ✅ Data is isolated per user
- ✅ UI is responsive
- ✅ Error handling is graceful

---

**Ready to test! Start with Scenario 1 and work through all 20. 🚀**
