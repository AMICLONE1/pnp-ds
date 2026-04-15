# PowerNetPro — UI/UX Redesign Project Report

**Prepared for:** UI/UX Designer
**Date:** March 2026
**Purpose:** Figma redesign brief for website and web application

---

## 1. What Is PowerNetPro?

PowerNetPro is a digital solar energy platform built for India. It lets people benefit from solar power without installing anything on their property. Think of it like a subscription to solar energy — users reserve a share of a solar plant, and their electricity bills automatically get reduced every month.

There are two sides to the business:

**Consumer Side** — For everyday people (renters, apartment dwellers, homeowners) who want to cut their electricity bills. They reserve solar capacity online in minutes, and credits are applied directly to their bills. No panels, no installation, no hassle.

**Host Side** — For building owners, housing societies, offices, factories, and schools who have large rooftops. PowerNetPro installs solar panels on their roof at zero cost to them. The host gets cheap electricity for 15 years, then owns the system outright.

---

## 2. The Two Audiences

### Audience A: Consumers
- Urban residents, mostly 25–45 years old
- Living in apartments or rented homes (can't install solar)
- Monthly electricity bills of ₹2,000 or more
- Want to save money and do something for the environment
- Not technically minded — simplicity is critical
- Motivated by: savings first, environment second

### Audience B: Hosts (Building Owners / Facilities)
- Residential housing societies, commercial offices, warehouses, schools
- Monthly electricity bills of ₹50,000 or more
- Rooftop space of 4,000+ sq. ft.
- Decision-makers: facility managers, RWA presidents, CFOs
- Motivated by: cost reduction, zero upfront investment, long-term ownership

These two audiences have entirely different needs, tones, and journeys. The design must serve both without mixing them up.

---

## 3. What Needs to Be Designed

There are three distinct products to design:

### Product 1: Marketing Website (Public-Facing)
What visitors see before they sign up. Two separate landing pages — one for consumers, one for hosts.

### Product 2: User Web App (Consumer Dashboard)
What registered consumers use to manage their solar reservations, track savings, pay bills, and connect their utility provider.

### Product 3: Host Web App (Host Dashboard)
What host partners use to monitor their solar plant's performance, track revenue, and manage financials.

> **Note:** There is also an Admin Dashboard (for the PowerNetPro team to manage everything internally). This does not need a public-facing redesign but should be designed consistently.

---

## 4. Marketing Website — Screen Inventory

### 4.1 Consumer Landing Page (`/`)

The main homepage. Needs to convert a visitor into a sign-up in one scroll.

**Sections to design (in order):**

| # | Section | Purpose |
|---|---------|---------|
| 1 | Navigation Header | Logo, nav links, Login + Sign Up buttons |
| 2 | Hero | Bold headline, subtext, primary CTA ("Start Saving"), trust stats |
| 3 | Live Stats Bar | Animated counters: users saved, CO₂ offset, total savings |
| 4 | Savings Calculator | Interactive: user enters monthly bill → see instant savings estimate |
| 5 | Benefits Grid | 4–6 cards: No Installation, Save 75%, Exit Anytime, CO₂ Tracking, etc. |
| 6 | How It Works | 3-step process: Reserve → Connect Utility → Save |
| 7 | Problem vs Solution | Side-by-side: "Old way" vs "PowerNetPro way" |
| 8 | Utility Compatibility Checker | Dropdown: pick state + electricity provider → confirm compatibility |
| 9 | Trust Section | Certifications, media logos, partner badges |
| 10 | Blog Highlights | 2–3 recent articles |
| 11 | Footer | Links, legal, social, newsletter signup |
| 12 | Sticky Mobile CTA | Fixed button at bottom on mobile: "Reserve Now" |

### 4.2 Host Landing Page (`/host-landing`)

A completely separate page for building owners. Different tone — more professional, business-focused.

**Sections to design:**

| # | Section | Purpose |
|---|---------|---------|
| 1 | Navigation Header | Same logo, but different nav links for hosts |
| 2 | Hero | Bold headline about zero-cost solar installation, CTA ("Get Free Assessment") |
| 3 | Key Numbers | ₹10–12/unit tariff, 15-year PPA, 100% CAPEX covered |
| 4 | How It Works | 4-step process: Assessment → Proposal → Installation → Monitoring |
| 5 | Who Qualifies | Eligibility checklist: rooftop size, bill amount, building types |
| 6 | What's Included | Full O&M, Insurance, DISCOM approvals, Net metering |
| 7 | Long-term Benefits | Year 1–15 savings + Free ownership after year 15 |
| 8 | Building Types | Cards for: Housing Societies, Offices, Warehouses, Schools |
| 9 | FAQ | Common questions from facility managers |
| 10 | Contact / Lead Form | Name, phone, property type, electricity bill range |
| 11 | Footer | Standard footer |

### 4.3 Supporting Pages

These need clean, consistent designs — not heavy marketing, just well-structured content:

- **Login** (`/login`) — Email/password form, Google sign-in option, "Forgot password" link
- **Sign Up** (`/signup`) — Registration form with minimal fields
- **Forgot Password** (`/forgot-password`) — Email input + send link
- **Reset Password** (`/reset-password`) — New password form
- **Waitlist** (`/waitlist`) — Early access signup form with value props
- **Help Center** (`/help`) — Searchable FAQ, categories, contact link
- **Contact** (`/contact`) — Contact form + email/phone
- **Blog Post** (`/blog/[slug]`) — Article layout with reading progress
- **Cookie Policy / Privacy Policy / Terms / Refund** — Text-heavy, clean layout

---

## 5. Consumer Web App — Screen Inventory

These are screens visible only after a user logs in.

### 5.1 Dashboard (`/dashboard`)

The first thing a user sees after login. Should feel like a personal command center.

**Components on this screen:**
- Welcome banner with user's name
- 4 stat cards: Capacity Reserved (kW), Lifetime Savings (₹), CO₂ Offset (tons), This Month's Credit
- Solar generation chart (real-time or daily graph)
- Active allocations list (which projects they're invested in)
- Recent activity feed
- Quick action buttons: Reserve More, View Bills, Connect Utility
- Empty state (for new users with nothing reserved yet)

### 5.2 Reserve Solar Capacity (`/reserve`)

Browse available solar projects and reserve capacity.

**Components:**
- Project cards (name, location, available kW, price per kWh, status)
- Filter/sort bar
- Capacity selector (slider: 1 kW – 100 kW)
- Price summary panel
- "Proceed to Payment" CTA

### 5.3 Payment (`/reserve/payment`)

- Order summary
- Razorpay payment integration (styled container)
- Security trust signals

### 5.4 Payment Success (`/reserve/success`)

- Confetti animation
- Confirmation summary
- Next steps (connect utility, go to dashboard)

### 5.5 Connect Utility Provider (`/connect`)

Link their electricity provider so credits are applied automatically.

**Components:**
- State selector
- DISCOM (electricity provider) selector
- Consumer number input
- Verification status
- Benefits sidebar explaining why this matters

### 5.6 Multiple Utilities (`/connect/multiple`)

For users with more than one electricity account — same flow, supports adding multiple.

### 5.7 Bills (`/bills`)

View electricity bills with solar credits applied.

**Components:**
- Bill list (date, total, solar credit applied, net payable)
- Credit history chart
- Manual bill entry option (for uploading a bill)
- Bill payment button

### 5.8 Settings (`/settings`)

Four sections, accessed via a sidebar:
- **Profile** — Name, email, phone, address, KYC status (Aadhaar/PAN)
- **Notifications** — Toggle: email, SMS, push alerts
- **Security** — Change password, active sessions
- **Connected Accounts** — Linked utility providers

---

## 6. Host Web App — Screen Inventory

Accessed via separate login. Professional, data-focused interface.

### 6.1 Host Dashboard (`/host`)

Overview of the solar plant's performance.

**Components:**
- Welcome banner
- 4 stat cards: Total Generation (kWh), Revenue This Month, Pending Payments, Efficiency %
- Real-time generation chart (hourly/daily)
- Payment due card (next payment date + amount)
- Alerts panel (maintenance notices, anomalies)
- Quick actions (View Plants, View Analytics, Download Report)

### 6.2 Plants Management (`/host/plants`)

Manage the solar plants linked to the host's account.

**Components:**
- Plant overview cards (name, location, capacity, status, current generation)
- Add plant button (admin-initiated, may not be self-serve)
- Plant status badges (Active, Maintenance, Offline)

### 6.3 Analytics (`/host/analytics`)

Detailed generation performance. The most data-heavy screen.

**Components:**
- Date range selector (Today, Week, Month, Custom)
- Generation analytics chart (line/bar, kWh over time)
- Irradiance correlation chart (sunlight vs. generation)
- KPI cards (peak generation, average efficiency, best day)
- Performance comparison table (plant vs. plant)
- Efficiency ring visualisation (circular progress gauge)
- Weekly/monthly pattern heatmap

### 6.4 Financials (`/host/financials`)

Revenue and payment tracking.

**Components:**
- Financial KPI row (total revenue, amount received, amount pending)
- Revenue chart over time
- Billing history table (date, amount, status)
- Payment status overview (pie chart or status badges)
- Plant-by-plant revenue breakdown

---

## 7. Admin Dashboard — Screen Inventory

Internal tool for the PowerNetPro operations team. No public access.

| Screen | Key Content |
|--------|------------|
| Admin Dashboard | Platform stats, revenue chart, user growth, generation by month |
| Users | User list, search, role/KYC status, user detail view |
| Projects | Solar project list, capacity status, edit/create |
| Generations | Energy generation logs per project |
| Payments | Payment records, status, user linkage |
| Waitlist | Early access signups, export |
| Admin Login | Separate login screen |

---

## 8. Navigation Structure

### Consumer App Navigation (Sidebar or Top Bar after login)
- Dashboard
- Reserve Capacity
- My Bills
- Connect Utility
- Settings
- Logout

### Host App Navigation (Sidebar)
- Dashboard
- My Plants
- Analytics
- Financials
- Logout

### Admin App Navigation (Sidebar)
- Dashboard
- Users
- Projects
- Generations
- Payments
- Waitlist
- Logout

### Public Website Navigation (Header)
- Logo (links to `/`)
- For Consumers (links to `/`)
- For Hosts (links to `/host-landing`)
- Blog
- Help
- Login
- Sign Up (primary CTA button)

---

## 9. Key User Journeys to Map in Figma

### Journey 1: First-Time Consumer (New Visitor → Reserved)
1. Lands on homepage
2. Checks savings with calculator
3. Clicks "Start Saving"
4. Signs up
5. Browses projects
6. Selects capacity
7. Pays
8. Sees success screen
9. Connects utility provider
10. Dashboard shows first allocation

### Journey 2: Returning Consumer (Monthly Bill Check)
1. Logs in → Dashboard
2. Sees this month's credit
3. Clicks Bills
4. Views bill with credit applied
5. Pays remaining amount

### Journey 3: Host Inquiry (Building Owner → Lead)
1. Lands on host landing page
2. Reads how it works
3. Checks eligibility
4. Fills contact/lead form
5. Receives confirmation

### Journey 4: Host Monitoring (Daily Check)
1. Logs into host dashboard
2. Checks today's generation
3. Goes to Analytics for detailed view
4. Checks Financials for payment status

---

## 10. Design Language

### Colors (Current — Designer Can Refresh)

| Role | Color | Hex |
|------|-------|-----|
| Primary (Deep Green) | Forest Green | `#0D2818` |
| Primary Light | Medium Green | `#1B5E3E` |
| Accent / CTA | Gold / Amber | `#FFB800` |
| Background | Off-White | `#FAFAF8` |
| Dark Background | Charcoal | `#1A1A1A` |
| Energy Blue (charts) | Cyan | `#00BCD4` |
| Success | Green | `#4CAF50` |
| Warning | Orange | `#FF9800` |
| Error | Red | `#F44336` |

> The current brand uses deep forest green + gold as the primary palette. This should be maintained for brand consistency unless explicitly changed.

### Typography (Current)

| Use | Font | Notes |
|-----|------|-------|
| Headings | Space Grotesk | Bold, modern |
| Body | Inter | Clean, highly readable |
| Numbers / Stats | JetBrains Mono | Monospace for data |

### Spacing & Style
- Generous white space throughout
- Card-based layouts (information in contained cards)
- Rounded corners (medium radius, not sharp)
- Subtle shadows for depth
- Glassmorphism (frosted glass effect) on key cards
- Gradient backgrounds in hero sections

### Component Patterns to Design in Figma

1. **Stat Card** — Icon + label + number + trend arrow (up/down)
2. **Project Card** — Image/icon + name + location + kW + price + CTA
3. **Bill Card** — Date + total + credit badge + net payable + status
4. **Alert/Toast** — Success, Warning, Error, Info variants
5. **Form Fields** — Input, Dropdown, Checkbox, Radio
6. **Buttons** — Primary (Gold), Secondary (Outline), Ghost, Danger
7. **Badge/Tag** — Status indicators (Active, Pending, Verified, etc.)
8. **Empty State** — Illustration + message + action button
9. **Loading Skeleton** — Placeholder cards while data loads
10. **Navigation Sidebar** — Collapsible, with active state

---

## 11. Responsive Design Requirements

Design every screen in three sizes:

| Breakpoint | Width | Notes |
|-----------|-------|-------|
| Mobile | 390px (iPhone 14 standard) | Most consumer traffic expected here |
| Tablet | 768px | Secondary |
| Desktop | 1440px | Primary for host and admin dashboards |

**Mobile-specific considerations:**
- Bottom sticky CTA on landing page ("Reserve Now")
- Sidebar navigation becomes a hamburger menu
- Charts simplify (less data, swipeable)
- Calculator is touch-friendly
- All tap targets minimum 44×44px

---

## 12. Tone & Visual Personality

| Attribute | Description |
|-----------|------------|
| **Trust** | This involves money and energy contracts. Design must feel safe and credible. |
| **Simplicity** | Consumers are not technical. Every screen must be immediately understandable. |
| **Premium** | Not budget — premium sustainability product for India's aspirational middle class. |
| **Data-Confident** | Numbers and savings are the product. Data must be visually prominent. |
| **Modern** | Clean, contemporary — no dated skeuomorphism or heavy gradients. |

---

## 13. What the Designer Should Deliver

### Phase 1 — Marketing Website (Priority)
- Consumer landing page (desktop + mobile)
- Host landing page (desktop + mobile)
- Login / Sign Up / Forgot Password screens
- Waitlist page

### Phase 2 — Consumer Web App
- Dashboard
- Reserve flow (project list → payment → success)
- Connect Utility screen
- Bills screen
- Settings (all 4 tabs)

### Phase 3 — Host Web App
- Host Dashboard
- Plants screen
- Analytics screen
- Financials screen

### Phase 4 — Supporting Screens
- Help Center
- Contact page
- Blog post template
- Policy pages (simple layout)
- Admin Dashboard (if in scope)

### Design System / Component Library
- Alongside screens, build a Figma component library with all reusable elements so the development team can implement consistently.

---

## 14. What to Avoid

- Do not use multiple competing color accents — stick to green + gold
- Do not design desktop-only — mobile is equally important
- Do not overload screens with information — one primary action per screen
- Do not use generic stock photography — this is a tech product, prefer abstract/data visuals or real solar imagery
- Do not ignore empty states and loading states — they are part of the experience
- Do not design the consumer app and host app identically — they serve different professional contexts

---

## 15. Reference Summary

| Item | Detail |
|------|--------|
| Live website | powernetpro.com |
| Product type | B2C + B2B SaaS, India market |
| Currency | Indian Rupee (₹) |
| Language | English |
| Platform | Web (browser-based, no native mobile app currently) |
| Screens to design | ~35 unique screens across 3 products |
| Primary CTA (consumer) | "Reserve Now" / "Start Saving" |
| Primary CTA (host) | "Get Free Assessment" |
| Payment provider | Razorpay (Indian payment gateway) |
| Auth provider | Supabase (standard email + password) |

---

*End of Report*
