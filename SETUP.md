# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
# or
pnpm install
```

## Step 2: Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click "Run" to execute the schema

This will create:
- All necessary tables
- Row Level Security policies
- Triggers for auto-creating user profiles
- Sample project data

## Step 3: Verify Environment Variables

Check that `.env.local` has your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kmwinrwqavqvclnevyxp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

## Step 4: Run the App

```bash
npm run dev
```

Visit http://localhost:3000

## Step 5: Test the Flow

1. **Sign Up**: Create a new account at `/signup`
2. **Browse Projects**: Go to `/reserve` and select a project
3. **Reserve Capacity**: Choose capacity and complete payment (simulated)
4. **Connect Utility**: Link your electricity provider at `/connect`
5. **View Dashboard**: See your solar summary at `/dashboard`

## Troubleshooting

### Database Errors

If you see database errors:
- Make sure you ran the schema.sql file
- Check that RLS policies are enabled
- Verify your Supabase credentials in `.env.local`

### Authentication Issues

If login/signup doesn't work:
- Check Supabase Auth settings
- Ensure email confirmation is disabled (for development)
- Verify redirect URLs in Supabase dashboard

### Build Errors

If you see TypeScript errors:
- Run `npm install` again
- Delete `.next` folder and rebuild
- Check that all dependencies are installed

## Next Steps

- Integrate Razorpay for real payments
- Add email notifications
- Connect BBPS API for bill fetching
- Deploy to Vercel

