# Digital Solar - Community Solar Platform

A modern web application that enables users to participate in solar energy projects without installing panels on their property. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **User Authentication**: Secure signup and login with Supabase Auth
- **Project Browsing**: View available solar projects across India
- **Capacity Reservation**: Reserve solar capacity (1-100 kW) with real-time pricing
- **Payment Integration**: Ready for Razorpay integration (currently simulated)
- **Utility Connection**: Link electricity provider to receive automatic credits
- **Dashboard**: Track capacity, savings, and environmental impact
- **Bill Management**: View bills with applied solar credits
- **Responsive Design**: Beautiful, modern UI that works on all devices

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Supabase account (free tier works)
- (Optional) Razorpay account for payments

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Set Up Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or use an existing one
3. Copy your project URL and anon key
4. Run the database schema:

   - Go to SQL Editor in Supabase Dashboard
   - Copy the contents of `supabase/schema.sql`
   - Paste and run it in the SQL Editor

### 3. Configure Environment Variables

The `.env.local` file is already created with your Supabase credentials. If you need to update it:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 4. Run the Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── reserve/           # Reservation flow
│   ├── connect/           # Utility connection
│   ├── bills/             # Bills page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── layout/           # Layout components
├── lib/                   # Utilities and config
│   ├── supabase/         # Supabase clients
│   ├── utils.ts          # Helper functions
│   └── constants.ts      # App constants
├── supabase/             # Database schema
│   └── schema.sql        # Complete database schema
└── public/               # Static assets
```

## 🎨 Design System

The app uses a custom design system with:

- **Primary Colors**: Forest green (#1B4332) and Gold (#D4A03A)
- **Typography**: Space Grotesk (headings) and Inter (body)
- **Components**: Reusable UI components built with Tailwind CSS

## 🔐 Authentication Flow

1. User signs up → Supabase creates auth user
2. Database trigger creates public.users record
3. User is automatically logged in
4. Session managed via secure cookies

## 📊 Database Schema

The database includes:

- **users**: User profiles and utility information
- **projects**: Solar projects with capacity and pricing
- **allocations**: User's reserved solar capacity
- **payments**: Payment records (Razorpay integration ready)
- **credits**: Monthly solar credits applied to bills
- **bills**: Electricity bills with credit applications
- **notifications**: User notifications

All tables have Row Level Security (RLS) enabled for data protection.

## 🚧 Current Status

### ✅ Completed

- Project setup and configuration
- Database schema and migrations
- Authentication (signup, login, logout)
- Landing page with hero section
- Project listing and selection
- Capacity reservation flow
- Payment page (simulated)
- Dashboard with stats
- Utility connection page
- Bills page (with mock data)
- Responsive design
- Protected routes middleware

### 🔄 To Do (Future Enhancements)

- [ ] Integrate Razorpay for real payments
- [ ] Add BBPS API integration for bill fetching
- [ ] Implement email notifications (Resend)
- [ ] Add admin panel
- [ ] Real-time credit calculations
- [ ] Bill payment integration
- [ ] KYC verification flow
- [ ] Advanced analytics and reporting

## 🧪 Testing

Currently, the app uses simulated payments. To test the full flow:

1. Sign up for a new account
2. Browse and select a project
3. Choose capacity and proceed to payment
4. Complete payment (currently simulated)
5. Connect your utility provider
6. View your dashboard

## 📝 Notes

- Payment flow is currently simulated for development
- Bills page shows mock data (will be replaced with real bill fetching)
- All API routes are protected with authentication
- Database uses Row Level Security (RLS) for data protection

## 🤝 Contributing

This is a private project. For questions or issues, please contact the development team.

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ for clean energy accessibility

