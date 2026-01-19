# Supabase Setup Instructions

## Current Status
The website is running with placeholder Supabase credentials. To enable full functionality (authentication, database features), you need to configure your actual Supabase project.

## Quick Setup Steps

### 1. Create/Access Supabase Project
- Go to https://supabase.com/dashboard
- Create a new project or select an existing one
- Wait for the project to finish setting up

### 2. Get Your Credentials
- In your Supabase project dashboard, go to **Settings** → **API**
- Copy the following values:
  - **Project URL** (looks like: `https://xxxxx.supabase.co`)
  - **anon/public key** (a long JWT token)

### 3. Update Environment Variables
Open `.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### 4. Set Up Database Schema
- In Supabase Dashboard, go to **SQL Editor**
- Click **New Query**
- Open the file `supabase/schema.sql` in this project
- Copy all contents and paste into the SQL Editor
- Click **Run** to create all tables and policies

### 5. (Optional) Add Sample Projects
- In SQL Editor, open and run `supabase/seed_projects.sql`
- This will add 2 sample solar projects for testing

### 6. Restart Development Server
After updating `.env.local`:
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## What Works Without Real Credentials
- Basic website navigation
- UI components and styling
- Static pages

## What Requires Real Credentials
- User authentication (signup/login)
- Dashboard features
- Project reservations
- Bill management
- All database operations

## Troubleshooting

### "Invalid Supabase URL" Error
- Make sure the URL starts with `https://` and ends with `.supabase.co`
- No trailing slashes

### "Invalid API Key" Error
- The anon key should be a long JWT token
- Copy the entire key without any spaces

### Database Errors
- Make sure you've run the `schema.sql` file
- Check that Row Level Security (RLS) policies are enabled
- Verify your project is fully initialized in Supabase

## Need Help?
- Supabase Documentation: https://supabase.com/docs
- Project README: See `README.md` for more details
