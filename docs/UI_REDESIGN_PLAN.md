# PowerNetPro Landing Page - Complete UI/UX Redesign Plan

## 🎯 Executive Summary

This document outlines a comprehensive redesign of the PowerNetPro landing page, transforming it from a standard corporate website into an immersive, scroll-driven storytelling experience that captivates users and drives conversions.

---

## 📊 Current State Analysis

### Issues Identified:
1. **Excessive White Space** - Sections feel disconnected and sparse
2. **Generic Content** - Copy lacks emotional impact and specificity
3. **Basic Animations** - Simple fade-ins don't create memorable experiences
4. **Repetitive Layout** - Similar card-based sections throughout
5. **Weak Visual Hierarchy** - Nothing truly commands attention
6. **Missing Micro-interactions** - No delightful surprises for users
7. **Poor Content Density** - Too much scrolling for too little value

---

## 🎨 Design Philosophy

### Core Principles:
1. **Scroll-Driven Storytelling** - Each scroll reveals new narrative layers
2. **Delightful Micro-interactions** - Every hover, click, scroll feels intentional
3. **Visual Density Without Clutter** - Rich content that breathes
4. **Progressive Disclosure** - Information reveals at the right moment
5. **Emotional Design** - Create feelings, not just features

### Inspiration References:
- Linear.app (scroll animations)
- Stripe.com (gradient mastery)
- Vercel.com (dark mode elegance)
- Apple.com (product storytelling)
- Framer.com (motion design)

---

## 🌈 Updated Color System

```
Primary Palette:
├── Deep Forest:     #0A1F12 (backgrounds)
├── Forest:          #0D2818 (primary dark)
├── Forest Glow:     #1B5E3E (hover states)
├── Solar Gold:      #FFB800 (CTAs, highlights)
├── Gold Shimmer:    #FFD54F (gradients)
├── Pure White:      #FFFFFF (text on dark)
├── Off White:       #FAFAF8 (light backgrounds)
└── Charcoal:        #1A1A1A (text on light)

Accent Gradients:
├── Hero Gradient:   linear-gradient(135deg, #0D2818 0%, #1B5E3E 50%, #0A1F12 100%)
├── Gold Gradient:   linear-gradient(135deg, #FFB800 0%, #FFD54F 50%, #F57C00 100%)
├── Energy Gradient: linear-gradient(135deg, #00BCD4 0%, #4CAF50 100%)
└── Aurora Gradient: linear-gradient(135deg, #FFB800 0%, #4CAF50 33%, #00BCD4 66%, #1B5E3E 100%)
```

---

## 📐 Page Structure Redesign

### Section 1: Hero (100vh) - "The Hook"
**Goal:** Instantly communicate value and create wonder

#### New Design:
```
┌─────────────────────────────────────────────────────────────┐
│  ╭─────────────────────────────────────────────────────────╮│
│  │     [Animated Navbar - Shrinks on scroll]               ││
│  ╰─────────────────────────────────────────────────────────╯│
│                                                             │
│        ┌───────────────────────────────────────┐            │
│        │    🌞 Animated Solar Orb (3D)         │            │
│        │    Floating in center                 │            │
│        │    Morphs with mouse movement         │            │
│        └───────────────────────────────────────┘            │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          ₹2,000                                       │  │
│  │     ───────────────                                   │  │
│  │     SAVED MONTHLY    ← Number counts up dramatically  │  │
│  │                                                       │  │
│  │   "The future of energy is digital."                 │  │
│  │   "And it starts with your electricity bill."        │  │
│  │                                                       │  │
│  │   [ Enter Your Bill ₹ ______ ]  ← Inline calculator  │  │
│  │   [ See Your Savings →        ]                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐                            │
│  │1K+ │  │₹50Cr│  │500MT│  │4.9★│  ← Floating trust pills  │
│  │User│  │Saved│  │CO₂  │  │Rate│                          │
│  └────┘  └────┘  └────┘  └────┘                            │
│                                                             │
│           ↓ Scroll to explore                              │
│          ╔═══════════════╗                                 │
│          ║ Animated wave ║ ← Energy flowing down           │
│          ╚═══════════════╝                                 │
└─────────────────────────────────────────────────────────────┘
```

#### Animations:
- **Headline Typewriter Effect** - Text reveals character by character
- **3D Solar Orb** - Reactive to mouse movement, pulsing glow
- **Number Counter** - ₹0 → ₹2,000 with easing
- **Trust Pills Float** - Gentle bobbing animation
- **Scroll-triggered Aurora** - Colors shift as you scroll down
- **Parallax Stars/Particles** - Depth effect on scroll

---

### Section 2: The Problem (100vh) - "Create Tension"
**Goal:** Make users feel the pain of traditional electricity

#### New Design Concept: "Split Screen Reveal"
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌────────────────────┐    ┌────────────────────┐          │
│  │   😤 THE OLD WAY    │    │   ✨ THE NEW WAY    │          │
│  │                     │    │                     │          │
│  │  [Animated Bills    │    │  [Animated Solar   │          │
│  │   Piling Up]        │ ←→ │   Credits Flowing] │          │
│  │                     │    │                     │          │
│  │  ₹5,000/month       │    │  ₹1,500/month      │          │
│  │  Rising 8% yearly   │    │  Locked rates      │          │
│  │  No control         │    │  Full transparency │          │
│  │  Dirty energy       │    │  100% renewable    │          │
│  └────────────────────┘    └────────────────────┘          │
│                                                             │
│           ↕ Drag slider to compare                         │
│        ═══════════●═══════════                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Animation: 
- **Horizontal Scroll Reveal** - As user scrolls, old way slides left, new way slides in
- **Draggable Comparison Slider** - Interactive before/after
- **Bills Burning Animation** - Visual metaphor for wasted money
- **Energy Flow Lines** - SVG animated paths showing energy credits

---

### Section 3: How It Works (150vh) - "The Journey"
**Goal:** Make the process feel effortless

#### New Design: "Scroll-Locked Steps"
Each step locks the scroll until animation completes, then releases.

```
Step 1: CHOOSE YOUR CAPACITY
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │                                                 │    │
│     │    ▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░  3.5 kW               │    │
│     │                                                 │    │
│     │    [Interactive 3D Slider with haptic feel]    │    │
│     │                                                 │    │
│     │    ← Drag to select your capacity →            │    │
│     │                                                 │    │
│     │    Monthly Savings: ₹1,750                     │    │
│     │    CO₂ Offset: 4.2 tons/year                   │    │
│     │    Powers: 🏠 Small Apartment                  │    │
│     │                                                 │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Step 2: CONNECT YOUR UTILITY
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │                                                 │    │
│     │    Select Your State                           │    │
│     │    ┌─────────────────────────────────────────┐ │    │
│     │    │  🔍 Maharashtra                     ▼   │ │    │
│     │    └─────────────────────────────────────────┘ │    │
│     │                                                 │    │
│     │    ┌────────┐ ┌────────┐ ┌────────┐            │    │
│     │    │ MSEDCL │ │ BEST   │ │ Adani  │ ← Cards   │    │
│     │    │   ✓    │ │        │ │        │   flip in │    │
│     │    └────────┘ └────────┘ └────────┘            │    │
│     │                                                 │    │
│     │    [Animated connection line drawing]          │    │
│     │                                                 │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Step 3: WATCH CREDITS FLOW
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │                                                 │    │
│     │    [Real-time Dashboard Preview]               │    │
│     │                                                 │    │
│     │    ┌──────────┐        ┌──────────┐           │    │
│     │    │ GENERATED│ ──→→→→ │ CREDITED │           │    │
│     │    │  45 kWh  │  ~~~~  │   ₹360   │           │    │
│     │    └──────────┘        └──────────┘           │    │
│     │                                                 │    │
│     │    📊 Live updating chart animation            │    │
│     │                                                 │    │
│     │    "Your April bill would have been ₹4,200"   │    │
│     │    "You paid only ₹2,100. That's 50% off!"    │    │
│     │                                                 │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Animations:
- **Step Number Morph** - 1 → 2 → 3 morphs smoothly
- **Slider Haptic Feedback** - Visual bounce on interaction
- **Connection Line SVG Draw** - Animated path drawing
- **Energy Flow Particles** - Little dots flowing between elements
- **Counter Animations** - All numbers animate when in view

---

### Section 4: Social Proof (100vh) - "Build Trust"
**Goal:** Overwhelming evidence of success

#### New Design: "Testimonial Theater"
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     "1,247 families saved ₹1.8 Cr this month"              │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                                                         ││
│  │   [3D Carousel of Video Testimonials]                  ││
│  │                                                         ││
│  │    ┌─────┐     ┌───────────┐     ┌─────┐              ││
│  │    │     │     │           │     │     │              ││
│  │    │ ◀   │     │  🎬 PLAY  │     │  ▶  │              ││
│  │    │     │     │           │     │     │              ││
│  │    └─────┘     │  Sandeep  │     └─────┘              ││
│  │                │  Mumbai   │                          ││
│  │                │  ₹18K/yr  │                          ││
│  │                │  saved    │                          ││
│  │                └───────────┘                          ││
│  │                                                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│     ★★★★★ 4.9/5 from 847 reviews                          │
│                                                             │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ Scroll │ │ The    │ │ Better │ │ Your   │ │ Live   │   │
│  │ .in    │ │ Print  │ │ India  │ │ Story  │ │ Mint   │   │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │
│     ↑ Press logos marquee (infinite scroll)               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Animations:
- **3D Card Carousel** - Testimonials rotate in 3D space
- **Video Play Morph** - Card expands into video player
- **Star Rating Sparkle** - Stars animate with sparkle effect
- **Logo Marquee** - Infinite horizontal scroll of press logos
- **Number Ticker** - Live updating count of families helped

---

### Section 5: Interactive Demo (100vh) - "Let Them Play"
**Goal:** Let users experience the product before signup

#### New Design: "Bill Calculator Experience"
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              "See Your Savings in Real-Time"               │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │    YOUR MONTHLY BILL                                │  │
│  │    ┌────────────────────────────────────────────┐   │  │
│  │    │  ₹  [    5,000   ]                         │   │  │
│  │    └────────────────────────────────────────────┘   │  │
│  │                                                      │  │
│  │    ┌─────────────────────────────────────────────┐  │  │
│  │    │ BEFORE                    AFTER             │  │  │
│  │    │                                             │  │  │
│  │    │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     ▓▓▓▓▓▓▓▓▓         │  │  │
│  │    │       ₹5,000              ₹2,500            │  │  │
│  │    │                                             │  │  │
│  │    │       [---------YOU SAVE---------]          │  │  │
│  │    │              ₹2,500/month                   │  │  │
│  │    │              ₹30,000/year                   │  │  │
│  │    │              7.5 tons CO₂                   │  │  │
│  │    │                                             │  │  │
│  │    └─────────────────────────────────────────────┘  │  │
│  │                                                      │  │
│  │    ┌──────────────────────────────────────────────┐ │  │
│  │    │ That's like getting 6 months of FREE power! │ │  │
│  │    │            🎉 every single year              │ │  │
│  │    └──────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  │           [ Get This Savings → ]                    │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Animations:
- **Input Glow Effect** - Field glows as user types
- **Bar Chart Animation** - Bars animate to show comparison
- **Savings Counter** - Numbers count up with celebration
- **Confetti Burst** - When savings exceed ₹2000
- **Environmental Impact Visualization** - Trees planted animation

---

### Section 6: Comparison (100vh) - "Eliminate Doubt"
**Goal:** Clear comparison that favors digital solar

#### New Design: "Interactive Battle Cards"
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│             "Why Digital Solar Wins"                        │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐│
│  │                                                        ││
│  │   ┌──────────────┐        VS        ┌──────────────┐  ││
│  │   │              │                  │              │  ││
│  │   │ DIGITAL SOLAR│                  │ROOFTOP SOLAR │  ││
│  │   │     ☀️        │                  │     🏠       │  ││
│  │   │              │                  │              │  ││
│  │   │ ✅ No install │                  │ ❌ Installation│ ││
│  │   │ ✅ Any home   │                  │ ❌ Owned roof  │ ││
│  │   │ ✅ Flexible   │                  │ ❌ Fixed size  │ ││
│  │   │ ✅ Portable   │                  │ ❌ Location    │ ││
│  │   │ ✅ Instant    │                  │ ❌ 2-4 weeks   │ ││
│  │   │ ✅ ₹0 upfront │                  │ ❌ ₹2-5 Lakh   │ ││
│  │   │              │                  │              │  ││
│  │   │ WINNER! 🏆   │                  │              │  ││
│  │   └──────────────┘                  └──────────────┘  ││
│  │                                                        ││
│  └────────────────────────────────────────────────────────┘│
│                                                             │
│        [ Perfect for: Renters | Apartments | Moving Soon ] │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Animations:
- **Card Flip on Hover** - Each feature flips to show detail
- **VS Animation** - Electric spark between cards
- **Checkmark Pop** - Green checks pop in sequentially
- **Winner Animation** - Trophy slides in with confetti
- **Tag Slide** - Use case tags slide in from bottom

---

### Section 7: FAQ Accordion (Auto-height) - "Answer Everything"
**Goal:** Eliminate remaining objections

#### New Design: "Smart FAQ"
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              "Still have questions?"                        │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐│
│  │                                                        ││
│  │  [ 🔍 Search questions...                          ]  ││
│  │                                                        ││
│  │  ┌──────────────────────────────────────────────────┐ ││
│  │  │ ▸ How does Digital Solar actually work?          │ ││
│  │  └──────────────────────────────────────────────────┘ ││
│  │  ┌──────────────────────────────────────────────────┐ ││
│  │  │ ▾ Is this legal and regulated?                   │ ││
│  │  │                                                  │ ││
│  │  │   Yes! Digital Solar operates under MERC/CERC   │ ││
│  │  │   guidelines. We're fully compliant with all    │ ││
│  │  │   state and central electricity regulations...   │ ││
│  │  │                                                  │ ││
│  │  │   [Read full answer →]                          │ ││
│  │  └──────────────────────────────────────────────────┘ ││
│  │  ┌──────────────────────────────────────────────────┐ ││
│  │  │ ▸ What if I move to a different city?            │ ││
│  │  └──────────────────────────────────────────────────┘ ││
│  │  ┌──────────────────────────────────────────────────┐ ││
│  │  │ ▸ Can I cancel anytime?                          │ ││
│  │  └──────────────────────────────────────────────────┘ ││
│  │                                                        ││
│  │  Popular: [Savings] [Installation] [Bills] [Legal]    ││
│  │                                                        ││
│  └────────────────────────────────────────────────────────┘│
│                                                             │
│                [ Contact Support 💬 ]                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Animations:
- **Smooth Accordion** - Content slides with spring physics
- **Search Highlight** - Matching text highlights as you type
- **Icon Rotation** - Arrow smoothly rotates on expand
- **Tag Pills Bounce** - Popular tags bounce on hover

---

### Section 8: Final CTA (100vh) - "The Close"
**Goal:** Irresistible call to action

#### New Design: "Immersive CTA"
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │     🌅 Full-screen animated gradient background     │  │
│   │                                                     │  │
│   │                                                     │  │
│   │            "Join 1,247 families who                │  │
│   │             switched this month"                    │  │
│   │                                                     │  │
│   │    ┌─────────────────────────────────────────────┐ │  │
│   │    │                                             │ │  │
│   │    │   ┌─────────────────────────────────────┐   │ │  │
│   │    │   │  📧 Enter your email                │   │ │  │
│   │    │   └─────────────────────────────────────┘   │ │  │
│   │    │                                             │ │  │
│   │    │   ┌─────────────────────────────────────┐   │ │  │
│   │    │   │  📱 Enter your phone                │   │ │  │
│   │    │   └─────────────────────────────────────┘   │ │  │
│   │    │                                             │ │  │
│   │    │   [ 🚀 Start Saving Now ]                  │ │  │
│   │    │                                             │ │  │
│   │    │   ✓ No credit card required                │ │  │
│   │    │   ✓ 2-minute setup                         │ │  │
│   │    │   ✓ Cancel anytime                         │ │  │
│   │    │                                             │ │  │
│   │    └─────────────────────────────────────────────┘ │  │
│   │                                                     │  │
│   │     [Live counter: 3 people signed up in last hr]  │  │
│   │                                                     │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Animations:
- **Aurora Background** - Shifting gradient animation
- **Form Field Glow** - Fields glow on focus
- **Button Pulse** - CTA button pulses subtly
- **Live Counter** - Real-time signup count
- **Success Animation** - Confetti + redirect on signup

---

## 🎬 Animation Specifications

### Scroll-Based Animations (Using Framer Motion + GSAP)

#### 1. Text Highlight on Scroll
```javascript
// Highlight text as user scrolls past
// Words light up gold as they enter viewport
"Save ₹2,000/month" → each word highlights sequentially
```

#### 2. Sticky Section Transitions
```javascript
// Sections pin while content animates
// Then release and scroll to next section
Section pins → Content animates in → Section releases
```

#### 3. Parallax Depth Layers
```javascript
// Background moves slower than foreground
// Creates depth illusion
Background: 0.3x scroll speed
Midground: 0.6x scroll speed
Foreground: 1x scroll speed
```

#### 4. Horizontal Scroll Within Vertical
```javascript
// Vertical scroll triggers horizontal movement
// For comparison and feature sections
Scroll down → Content moves left
```

#### 5. Number Morphing
```javascript
// Numbers animate with easing
// Count up with randomized intermediate values
0 → random jumps → target value
```

### Micro-interactions

#### Buttons
- **Hover**: Scale 1.02, shadow increase, slight glow
- **Press**: Scale 0.98, shadow decrease
- **Focus**: Ring animation

#### Cards
- **Hover**: Lift up 8px, shadow spreads
- **3D Tilt**: Follow mouse position for perspective
- **Border Gradient**: Animated gradient border on hover

#### Form Fields
- **Focus**: Border animates to gold
- **Valid**: Green checkmark slides in
- **Error**: Red shake animation

#### Icons
- **Hover**: Subtle bounce or rotation
- **Active**: Fill animation

---

## 📝 Copywriting Improvements

### Hero Section
**Before:** "Save ₹2,000/month on Electricity Bills"
**After:** "Stop Paying Full Price for Electricity"

**Before:** "No Installation. No Hassle. Just Savings."
**After:** "Go Solar in 60 Seconds. No Roof Required."

### Value Propositions
**Before:** Generic features
**After:** Benefit-focused with specifics

| Feature | Weak Copy | Strong Copy |
|---------|-----------|-------------|
| No Install | "No installation required" | "Keep your landlord happy—zero construction" |
| Savings | "Lower bills" | "The average family saves ₹24,000 per year" |
| Green | "Environmental impact" | "You'll offset 7.5 tons of CO₂—that's 340 trees!" |
| Easy | "Quick setup" | "Most people finish setup during their coffee break" |

### Social Proof
**Before:** "1,000+ Users"
**After:** "1,247 families chose PowerNetPro this month"

### CTA Buttons
**Before:** "Start Saving Now"
**After:** "Calculate My Savings" (first CTA - low commitment)
         "Get Started Free" (final CTA - removes risk)

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- Stack all grid layouts
- Reduce animation complexity
- Touch-optimized interactions
- Sticky bottom CTA bar
- Simplified hero (no 3D)

### Tablet (768px - 1024px)
- 2-column grids
- Full animations
- Touch + mouse support

### Desktop (> 1024px)
- Full experience
- All animations
- 3D effects
- Mouse-following interactions

---

## ⚡ Performance Considerations

### Animation Performance
- Use `transform` and `opacity` only
- Implement `will-change` sparingly
- Use CSS animations where possible
- GSAP ScrollTrigger for scroll-based
- Lazy load heavy components

### Loading Strategy
1. **Critical Path**: Hero content loads first
2. **Progressive Enhancement**: Animations load after content
3. **Lazy Loading**: Below-fold sections load on scroll
4. **Preloading**: Preload next section assets

### Bundle Optimization
- Code split by route
- Dynamic imports for heavy components
- Tree shake unused Framer Motion features

---

## 🛠️ Technical Implementation

### New Components to Create

1. **TextHighlighter** - Scroll-based text highlighting
2. **StickySection** - Pin and animate sections
3. **ParallaxLayer** - Multi-depth parallax
4. **NumberMorph** - Animated number transitions
5. **CardTilt** - 3D tilt effect on hover
6. **ComparisonSlider** - Before/after comparison
7. **TestimonialCarousel** - 3D card carousel
8. **FAQAccordion** - Animated accordion
9. **AuroraBackground** - Animated gradient
10. **ConfettiCelebration** - Success celebration

### Animation Libraries
- **Framer Motion** - Primary animation library
- **GSAP + ScrollTrigger** - Scroll-based animations
- **Lottie** - Complex vector animations
- **Three.js** (optional) - 3D effects

---

## 📋 Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Update color system and typography
- [ ] Create base animation components
- [ ] Implement new hero section
- [ ] Add scroll-based text highlighting

### Phase 2: Core Sections (Week 2)
- [ ] Build comparison slider section
- [ ] Create interactive how-it-works
- [ ] Implement testimonial carousel
- [ ] Add savings calculator experience

### Phase 3: Polish (Week 3)
- [ ] Add micro-interactions
- [ ] Implement FAQ accordion
- [ ] Create final CTA section
- [ ] Performance optimization

### Phase 4: Testing (Week 4)
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Animation performance audit
- [ ] User testing and iterations

---

## 🎯 Success Metrics

- **Scroll Depth**: Target 80% reach bottom
- **Time on Page**: Target 3+ minutes average
- **CTA Clicks**: Target 15% click rate
- **Conversion**: Target 5% signup rate
- **Performance**: Target 90+ Lighthouse score

---

## 📎 Appendix: Component Library

### Animation Variants
```typescript
// Standard entrance animations
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};
```

### Scroll Trigger Setup
```typescript
// GSAP ScrollTrigger for text highlighting
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('.highlight-word').forEach((word) => {
  gsap.to(word, {
    scrollTrigger: {
      trigger: word,
      start: 'top 80%',
      end: 'top 20%',
      scrub: true
    },
    color: '#FFB800',
    textShadow: '0 0 20px rgba(255,184,0,0.5)'
  });
});
```

---

**Document Version:** 1.0
**Last Updated:** January 2026
**Author:** UI/UX Design Team

---

*Ready to proceed with implementation? Reply "Let's build it!" to start Phase 1.*
