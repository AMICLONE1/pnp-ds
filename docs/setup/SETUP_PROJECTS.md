# Setup Mock Solar Projects (100kW and 150kW)

## Quick Setup Instructions

To add the two mock solar projects to your database:

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**

### Step 2: Run the Seed Script
1. Open the file: `supabase/seed_projects.sql`
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify Projects Created
After running, you should see:
- **Solar Park Alpha**: 100kW (Bengaluru, Karnataka)
- **Solar Farm Beta**: 150kW (Mumbai, Maharashtra)

Both projects will have:
- Status: ACTIVE
- All capacity blocks available (100 blocks for Alpha, 150 blocks for Beta)
- Commission dates set
- Rate per kWh configured

### Step 4: Check in Application
1. Go to `/reserve` page
2. You should see both projects listed
3. Users can now reserve capacity from these projects

---

## Projects Details

### Project 1: Solar Park Alpha
- **Capacity**: 100kW
- **Location**: Bengaluru, Karnataka
- **Rate**: ₹6.05 per kWh
- **SPV ID**: SPV-PNP-001
- **Commission Date**: 2024-01-15

### Project 2: Solar Farm Beta
- **Capacity**: 150kW
- **Location**: Mumbai, Maharashtra
- **Rate**: ₹6.20 per kWh
- **SPV ID**: SPV-PNP-002
- **Commission Date**: 2024-03-20

---

## Troubleshooting

### If projects don't appear:
1. Check Supabase logs for errors
2. Verify the `projects` table exists
3. Check RLS policies allow reading projects
4. Ensure status is 'ACTIVE' (uppercase)

### If you get duplicate key errors:
- The projects already exist
- The script will update them (ON CONFLICT DO UPDATE)
- This is safe to run multiple times

---

## Next Steps

After projects are created:
1. Test the `/reserve` page
2. Try reserving capacity
3. Verify projects appear in the dashboard

