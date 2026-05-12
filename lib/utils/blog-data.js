/**
 * Source of truth for every blog post on the marketing site.
 *
 * Each entry's `content` is raw HTML rendered via dangerouslySetInnerHTML
 * inside a `.blog-content` wrapper. The wrapper's CSS rules live in
 * app/globals.css and style the following authoring primitives:
 *
 *   <aside class="blog-callout blog-callout--tip|info|bottomline">
 *     <span class="blog-callout__label">DID YOU KNOW</span>
 *     <p>...</p>
 *   </aside>
 *
 *   <div class="blog-table"><table>...</table></div>
 *
 *   <a class="blog-cta" href="/host-landing">
 *     <strong>Headline</strong>
 *     <span class="blog-cta__sub">Sub-line</span>
 *   </a>
 *
 * Every H2 used in `toc` MUST carry an `id` matching the toc entry so the
 * sidebar's scrollspy works.
 *
 * Images are sourced from Unsplash with `w=1600&q=80` for hero use. Swap
 * with branded AI imagery later by replacing the `image` field; sitemap and
 * Article JSON-LD will pick up the new URL automatically.
 */

const author = {
  name: "PowerNetPro Team",
  role: "Written by",
};

const DATE = "March 2026";

export const blogData = [
  // =====================================================================
  // 01 — What Is Digital Solar?
  // =====================================================================
  {
    id: "what-is-digital-solar",
    slug: "what-is-digital-solar",
    title: "What Is Digital Solar? How It Works Without Installing Panels",
    excerpt:
      "Digital solar lets you benefit from solar energy without rooftop panels. Learn how virtual solar capacity works and how PowerNetPro makes solar accessible to everyone in India.",
    description:
      "Digital solar lets you benefit from solar energy without rooftop panels. Learn how virtual solar capacity works and how PowerNetPro makes solar accessible to everyone in India.",
    date: DATE,
    readingTime: "8 min read",
    category: "Education",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&auto=format&fit=crop&q=80",
    author,
    toc: [
      { id: "what-exactly-is-digital-solar", title: "What Exactly Is Digital Solar?" },
      { id: "how-digital-solar-works", title: "How Digital Solar Works: Step by Step" },
      { id: "who-is-digital-solar-for", title: "Who Is Digital Solar For?" },
      { id: "digital-vs-rooftop", title: "Digital Solar vs Traditional Rooftop Solar" },
      { id: "how-much-can-you-save", title: "How Much Can You Actually Save?" },
      { id: "is-it-legal", title: "Is Digital Solar Legal and Safe?" },
    ],
    takeaways: [
      "Digital solar lets you reserve capacity from a commercial solar plant — no rooftop or installation needed.",
      "You earn guaranteed credits of ₹7 per unit that directly reduce your electricity bill.",
      "At ₹35,000–40,000 per kW, it's 30–45% cheaper than traditional rooftop solar.",
      "Perfect for apartment dwellers, renters, and anyone without rooftop access.",
      "Your digital solar allocation is portable — it moves when you move.",
    ],
    content: `
<h2 id="what-exactly-is-digital-solar">What Exactly Is Digital Solar?</h2>
<p>India's solar revolution is in full swing. But here's a reality that most solar marketing ignores: over 70% of urban Indians live in apartments, rented homes, or buildings where they simply cannot install solar panels. Does that mean you're locked out? Absolutely not.</p>
<p>Digital solar is a model where you reserve a specific amount of solar capacity (measured in kW) from a large, commercially installed solar plant — without installing anything on your own premises. Think of it like this: instead of buying your own panels, you get a share of a professionally managed solar plant on a commercial building. The electricity your reserved capacity generates earns you credits that directly reduce your electricity bill.</p>
<p>You don't need a rooftop. You don't need to own a home. You don't need to worry about maintenance, cleaning, or repairs. Everything is managed digitally — hence the name.</p>

<h2 id="how-digital-solar-works">How Digital Solar Works: Step by Step</h2>
<h3>Step 1: Solar Plant on a Host Property</h3>
<p>A commercial-scale solar plant (100 kW+) is installed on a host property — a commercial building, housing society, or industrial facility. The host consumes the generated electricity and pays ₹10–12 per unit, far below their grid tariff of ₹18–20.</p>
<h3>Step 2: Reserve Your Capacity Online</h3>
<p>Through PowerNetPro's platform, you browse available capacity and reserve your share (from 1.5 kW). You pay a one-time reservation of approximately ₹35,000–40,000 per kW — significantly less than ₹50,000–70,000 for traditional rooftop solar.</p>
<h3>Step 3: Plant Generates Electricity</h3>
<p>Once operational, IoT-enabled smart meters track generation precisely. The platform calculates your specific share based on your reserved capacity.</p>
<h3>Step 4: Earn Credits on Your Bill</h3>
<p>For every unit generated from your capacity, you receive ₹7 credit. These credits reduce your DISCOM electricity bill directly.</p>
<h3>Step 5: Track Everything in Real-Time</h3>
<p>Monitor daily generation, accumulated credits, bill savings, and CO₂ offset through the PowerNetPro dashboard — all in real time.</p>

<aside class="blog-callout blog-callout--tip">
  <span class="blog-callout__label">Did You Know?</span>
  <p>Each kW of solar capacity generates approximately 4–5 units per day in India. With 2 kW reserved, that's roughly 300 units and ₹2,100 in credits every month.</p>
</aside>

<h2 id="who-is-digital-solar-for">Who Is Digital Solar For?</h2>
<p><strong>Apartment dwellers:</strong> You live on the 5th floor and share a building with 200 families. No say over the rooftop. Digital solar lets you participate anyway.</p>
<p><strong>Renters:</strong> You move every 2–3 years. Traditional solar is property-tied. Digital solar isn't — your reservation moves with you.</p>
<p><strong>Small business owners:</strong> Running a shop or clinic in rented space but paying ₹8–12/unit commercial tariffs? Digital solar offsets that without touching the building.</p>
<p><strong>Eco-conscious individuals:</strong> Want to reduce your carbon footprint regardless of your housing situation.</p>

<h2 id="digital-vs-rooftop">Digital Solar vs Traditional Rooftop Solar</h2>
<div class="blog-table"><table>
  <thead><tr><th>Feature</th><th>Traditional Rooftop</th><th>Digital Solar (PowerNetPro)</th></tr></thead>
  <tbody>
    <tr><td>Rooftop needed?</td><td>Yes — own rooftop mandatory</td><td>No — zero rooftop dependency</td></tr>
    <tr><td>Upfront cost</td><td>₹50,000–70,000 per kW</td><td>₹35,000–40,000 per kW</td></tr>
    <tr><td>Installation time</td><td>3–6 months</td><td>Minutes (online)</td></tr>
    <tr><td>Maintenance</td><td>Your responsibility</td><td>Zero — fully managed</td></tr>
    <tr><td>Portability</td><td>Tied to property</td><td>Transferable across residences</td></tr>
    <tr><td>Monthly return</td><td>Self-consumption / net metering</td><td>Guaranteed ₹7/unit credit</td></tr>
    <tr><td>Best for</td><td>Homeowners with rooftops</td><td>Everyone else</td></tr>
  </tbody>
</table></div>

<h2 id="how-much-can-you-save">How Much Can You Actually Save?</h2>
<p>Let's run a quick example for a 2 kW reservation:</p>
<p><strong>Daily generation:</strong> 2 kW × 5 units/day = 10 units</p>
<p><strong>Monthly generation:</strong> 300 units</p>
<p><strong>Monthly credit:</strong> 300 × ₹7 = ₹2,100</p>
<p><strong>Annual savings:</strong> ₹25,200</p>
<p>With a one-time cost of ~₹75,000, you break even in roughly 3 years and then enjoy 12+ more years of pure savings.</p>
<div class="blog-table"><table>
  <thead><tr><th>Capacity</th><th>Monthly Units</th><th>Monthly Credit</th><th>Annual Savings</th></tr></thead>
  <tbody>
    <tr><td>1.5 kW</td><td>~225</td><td>₹1,575</td><td>₹18,900</td></tr>
    <tr><td>2 kW</td><td>~300</td><td>₹2,100</td><td>₹25,200</td></tr>
    <tr><td>3 kW</td><td>~450</td><td>₹3,150</td><td>₹37,800</td></tr>
    <tr><td>5 kW</td><td>~750</td><td>₹5,250</td><td>₹63,000</td></tr>
  </tbody>
</table></div>

<h2 id="is-it-legal">Is Digital Solar Legal and Safe?</h2>
<p>Yes. PowerNetPro operates within the Electricity Act, 2003 and state-level SERC net metering regulations. The platform does not sell electricity directly to end users. Instead, hosts consume generated electricity and pay PowerNetPro, while users receive bill credits. DISCOMs continue normal billing for everyone.</p>

<aside class="blog-callout blog-callout--bottomline">
  <span class="blog-callout__label">The Bottom Line</span>
  <p>Digital solar removes every barrier that has kept 70%+ of urban Indians from going solar. No rooftop, no installation, no maintenance — just clean energy credits flowing to your electricity bill. At ₹35K–40K per kW with guaranteed ₹7/unit returns, it's one of the smartest energy investments available in India today.</p>
</aside>

<a class="blog-cta" href="/#calculator">
  <strong>Ready to go solar without a rooftop?</strong>
  <span class="blog-cta__sub">Reserve your digital solar capacity today →</span>
</a>
`,
  },

  // =====================================================================
  // 02 — Solar Energy for Renters
  // =====================================================================
  {
    id: "solar-energy-for-renters",
    slug: "solar-energy-for-renters",
    title: "Solar Energy for Renters in India: A Complete Guide (2026)",
    excerpt:
      "Think solar is only for homeowners? This guide shows how renters can access solar benefits, save on bills, and go green without installing a single panel.",
    description:
      "Think solar is only for homeowners? This guide shows how renters can access solar benefits, save on bills, and go green without installing a single panel.",
    date: DATE,
    readingTime: "7 min read",
    category: "Guide",
    image:
      "https://images.unsplash.com/photo-1522444690501-83bf65d36c39?w=1600&auto=format&fit=crop&q=80",
    author,
    toc: [
      { id: "why-traditional-doesnt-work", title: "Why Traditional Solar Doesn't Work for Renters" },
      { id: "how-renters-access-solar", title: "How Renters Can Access Solar in 2026" },
      { id: "real-scenario-priya", title: "Real Scenario: Priya, Software Engineer, Bengaluru" },
      { id: "getting-started-renters", title: "Getting Started: 6 Steps" },
    ],
    takeaways: [
      "Over 20 crore Indians rent their homes and are excluded from traditional solar.",
      "Digital solar eliminates every barrier: no rooftop, no landlord permission, no installation.",
      "Your digital solar allocation is portable — moves when you move to a new city.",
      "Break-even in ~3 years, then 12+ years of pure savings of ₹15,000–60,000+ annually.",
      "Your landlord doesn't need to know, approve, or do anything.",
    ],
    content: `
<h2 id="why-traditional-doesnt-work">Why Traditional Solar Doesn't Work for Renters</h2>
<p><strong>No rooftop access:</strong> In most apartments, the rooftop is common property. Individual tenants have zero control.</p>
<p><strong>Investment risk:</strong> Solar panels last 25 years, but average renters move every 2–3 years. You can't take rooftop panels.</p>
<p><strong>Landlord reluctance:</strong> Even willing landlords hesitate due to structural concerns, maintenance, and DISCOM paperwork.</p>
<p>The very people paying the highest electricity bills (urban renters) are the least able to access the cheapest energy source (solar). That's the gap digital solar fills.</p>

<h2 id="how-renters-access-solar">How Renters Can Access Solar in 2026</h2>
<p>Digital solar eliminates every barrier:</p>
<p><strong>No rooftop needed:</strong> Panels are on a commercial building. You participate through a digital platform.</p>
<p><strong>No physical changes:</strong> Nothing changes at your rented home. Zero landlord permissions.</p>
<p><strong>Portable solar:</strong> Your capacity is linked to you, not the property. Move cities, keep your credits.</p>
<p><strong>Lower cost:</strong> ₹35K–40K/kW versus ₹50K–70K for property-tied traditional solar.</p>

<h2 id="real-scenario-priya">Real Scenario: Priya, Software Engineer, Bengaluru</h2>
<p>Priya is 28, rents a 2BHK, and pays ₹3,500/month for electricity. She reserves 1.5 kW through PowerNetPro for ~₹57,500.</p>
<p><strong>Monthly generation:</strong> 225 units (1.5 kW × 5 units/day × 30 days)</p>
<p><strong>Monthly credit:</strong> 225 × ₹7 = ₹1,575</p>
<p><strong>New effective bill:</strong> ₹3,500 − ₹1,575 = ₹1,925</p>
<p><strong>Annual savings:</strong> ₹18,900</p>
<p>Break-even in ~3 years. Then ₹18,900 saved every year for 12+ years. When she moves to Pune? Credits continue.</p>

<aside class="blog-callout blog-callout--tip">
  <span class="blog-callout__label">About Your Landlord</span>
  <p>Your landlord doesn't need to know, approve, or do anything. Digital solar has zero impact on your rented property. No panels, no wiring, no modifications. Your DISCOM bill continues normally — you simply pay less.</p>
</aside>

<h2 id="getting-started-renters">Getting Started: 6 Steps</h2>
<ol>
  <li>Visit powernetpro.com and create a free account.</li>
  <li>Complete quick KYC (Aadhaar/PAN).</li>
  <li>Browse available solar capacity in your region.</li>
  <li>Select your allocation (starting from 1.5 kW).</li>
  <li>Pay one-time reservation via UPI, card, or net banking.</li>
  <li>Start receiving monthly credits once the plant is active.</li>
</ol>

<aside class="blog-callout blog-callout--bottomline">
  <span class="blog-callout__label">The Bottom Line</span>
  <p>Renting should never mean missing out on solar. Digital solar gives renters the same savings and environmental benefits as homeowners — without any property dependency. With portable credits and zero landlord friction, there's no reason to keep paying full grid prices.</p>
</aside>

<a class="blog-cta" href="/#calculator">
  <strong>Renting shouldn't mean missing out on solar.</strong>
  <span class="blog-cta__sub">Start your digital solar journey →</span>
</a>
`,
  },

  // =====================================================================
  // 03 — Virtual Net Metering Explained
  // =====================================================================
  {
    id: "virtual-net-metering-explained",
    slug: "virtual-net-metering-explained",
    title: "What Is Virtual Net Metering? Explained in Simple Terms",
    excerpt:
      "Virtual net metering lets multiple people share solar from one plant and get bill credits. Learn how VNM works, state regulations, and why it matters for apartment residents.",
    description:
      "Virtual net metering lets multiple people share solar from one plant and get bill credits. Learn how VNM works, state regulations, and why it matters for apartment residents.",
    date: DATE,
    readingTime: "8 min read",
    category: "Regulation",
    image:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1600&auto=format&fit=crop&q=80",
    author,
    toc: [
      { id: "traditional-net-metering", title: "Traditional Net Metering: Quick Refresher" },
      { id: "what-is-vnm", title: "What Is Virtual Net Metering?" },
      { id: "how-vnm-works", title: "How VNM Works: Step by Step" },
      { id: "vnm-vs-group", title: "VNM vs Group Net Metering" },
      { id: "states-supporting-vnm", title: "Which States Support VNM?" },
      { id: "why-vnm-matters", title: "Why VNM Matters for Digital Solar" },
    ],
    takeaways: [
      "Virtual net metering (VNM) lets one solar plant give bill credits to multiple consumers at different locations.",
      "You don't need solar panels on your roof — just a connection within the same DISCOM area.",
      "States like Maharashtra, Karnataka, Delhi, Rajasthan, and Tamil Nadu have active VNM frameworks.",
      "MNRE treats VNM, group net metering, and net billing at par for regulatory purposes.",
      "VNM is the regulatory backbone that makes digital solar platforms like PowerNetPro possible.",
    ],
    content: `
<h2 id="traditional-net-metering">Traditional Net Metering: Quick Refresher</h2>
<p>In standard net metering, you install panels on your roof. A bi-directional meter tracks what you consume vs what you send back to the grid. You only pay for the net difference. Works great — if you own a rooftop.</p>

<h2 id="what-is-vnm">What Is Virtual Net Metering?</h2>
<p>VNM is an extension where the solar plant and the beneficiary don't need to be at the same location. A single plant generates electricity, and the generation is split among multiple consumers based on pre-agreed ratios. Each participant gets credits on their individual DISCOM bill.</p>
<p>The key innovation: you don't need panels on your roof. You just need to be in the same DISCOM service area.</p>

<h2 id="how-vnm-works">How VNM Works: Step by Step</h2>
<ol>
  <li>Solar plant installed at a host location (commercial building, society, factory).</li>
  <li>Multiple consumers register as beneficiaries with agreed generation shares.</li>
  <li>DISCOM's bi-directional meter records total generation.</li>
  <li>Credits allocated to each beneficiary's account based on their ratio.</li>
  <li>Each beneficiary's bill is reduced by their allocated credits.</li>
</ol>

<h2 id="vnm-vs-group">VNM vs Group Net Metering</h2>
<div class="blog-table"><table>
  <thead><tr><th>Feature</th><th>Virtual Net Metering</th><th>Group Net Metering</th></tr></thead>
  <tbody>
    <tr><td>Location</td><td>Different locations within same DISCOM</td><td>Same premises or building</td></tr>
    <tr><td>Consumers</td><td>Same category, different addresses</td><td>Same consumer or group at one site</td></tr>
    <tr><td>Best for</td><td>City-wide digital solar</td><td>Housing society rooftop installations</td></tr>
  </tbody>
</table></div>

<h2 id="states-supporting-vnm">Which States Support VNM?</h2>
<p><strong>Maharashtra (MERC):</strong> Among the most progressive. Clear rules for societies and commercial complexes.</p>
<p><strong>Karnataka (KERC):</strong> Active framework for group and virtual net metering.</p>
<p><strong>Delhi (DERC):</strong> Updated VNM guidelines January 2026, extending to all consumer categories.</p>
<p><strong>Rajasthan (RERC):</strong> Virtual and group net metering for capacities up to 1 MW.</p>
<p><strong>Tamil Nadu (TNERC):</strong> Leading regulatory adoption in the south.</p>
<p>The trend is clear: VNM is going from niche to mainstream across India.</p>

<h2 id="why-vnm-matters">Why VNM Matters for Digital Solar</h2>
<p>VNM is the regulatory backbone that makes PowerNetPro possible. When you reserve capacity, the underlying mechanism is VNM: a plant generates at one location, credits flow to your bill at another. Without VNM, this credit transfer wouldn't work within the DISCOM framework.</p>

<aside class="blog-callout blog-callout--tip">
  <span class="blog-callout__label">Common Question</span>
  <p>Does my landlord need to approve? No. VNM credits are linked to your electricity consumer number, not your property. When you move, your allocation transfers to your new consumer number within the same DISCOM area.</p>
</aside>

<aside class="blog-callout blog-callout--bottomline">
  <span class="blog-callout__label">The Bottom Line</span>
  <p>Virtual net metering is the regulatory breakthrough that unlocks solar for the 70%+ of urban Indians without rooftop access. As more states adopt VNM frameworks, digital solar platforms will become as mainstream as UPI payments.</p>
</aside>

<a class="blog-cta" href="/#calculator">
  <strong>Want VNM benefits without the complexity?</strong>
  <span class="blog-cta__sub">PowerNetPro handles everything →</span>
</a>
`,
  },

  // =====================================================================
  // 04 — How Solar Credits Work
  // =====================================================================
  {
    id: "how-solar-credits-work",
    slug: "how-solar-credits-work",
    title: "How Solar Credits Work on Your Electricity Bill",
    excerpt:
      "Learn exactly how solar generation turns into bill savings, how credits appear on your DISCOM bill, and how digital solar makes it seamless.",
    description:
      "Learn exactly how solar generation turns into bill savings, how credits appear on your DISCOM bill, and how digital solar makes it seamless.",
    date: DATE,
    readingTime: "6 min read",
    category: "Education",
    image:
      "https://images.unsplash.com/photo-1582408921715-18e7806365c1?w=1600&auto=format&fit=crop&q=80",
    author,
    toc: [
      { id: "what-are-credits", title: "What Are Solar Credits?" },
      { id: "credit-flow", title: "From Sunlight to Savings: The Credit Flow" },
      { id: "guaranteed-vs-variable", title: "Guaranteed vs Variable Credits" },
      { id: "savings-by-capacity", title: "Savings by Capacity" },
    ],
    takeaways: [
      "Solar credits are monetary values applied to your bill based on your reserved capacity's generation.",
      "PowerNetPro guarantees ₹7 per unit — fixed and predictable, unlike variable market-linked credits.",
      "Credits are calculated daily via IoT meters and applied to your monthly DISCOM bill.",
      "Excess credits roll forward — building a credit bank for high-consumption months.",
      "You can track generation, credits, and savings in real-time through the PowerNetPro app.",
    ],
    content: `
<h2 id="what-are-credits">What Are Solar Credits?</h2>
<p>A solar credit is a monetary value applied to your bill based on how much electricity your reserved solar capacity generated. On PowerNetPro, the rate is a guaranteed ₹7 per unit (kWh). For every unit produced, you get ₹7 off your bill.</p>

<h2 id="credit-flow">From Sunlight to Savings: The Credit Flow</h2>
<ol>
  <li><strong>Solar Generation:</strong> Panels produce 4–5 units per kW per day on average across India.</li>
  <li><strong>IoT Tracking:</strong> Smart meters transmit real-time generation data to the platform.</li>
  <li><strong>Proportional Allocation:</strong> 2 kW out of 100 kW plant = 2% of total generation is yours.</li>
  <li><strong>Credit Calculation:</strong> Your units × ₹7 = your monthly credit. Example: 300 units = ₹2,100.</li>
  <li><strong>Bill Application:</strong> Credit deducted from your DISCOM bill. ₹3,500 bill − ₹2,100 credit = ₹1,400 to pay.</li>
</ol>

<h2 id="guaranteed-vs-variable">Guaranteed vs Variable Credits</h2>
<p>Some platforms offer variable credits tied to fluctuating market rates. PowerNetPro offers a guaranteed ₹7 per unit — your savings are predictable regardless of tariff changes or DISCOM decisions. This predictability is crucial for budgeting.</p>

<h2 id="savings-by-capacity">Savings by Capacity</h2>
<div class="blog-table"><table>
  <thead><tr><th>Capacity</th><th>Monthly Units</th><th>Monthly Credit</th><th>Annual Savings</th></tr></thead>
  <tbody>
    <tr><td>1.5 kW</td><td>~225</td><td>₹1,575</td><td>₹18,900</td></tr>
    <tr><td>2 kW</td><td>~300</td><td>₹2,100</td><td>₹25,200</td></tr>
    <tr><td>3 kW</td><td>~450</td><td>₹3,150</td><td>₹37,800</td></tr>
    <tr><td>5 kW</td><td>~750</td><td>₹5,250</td><td>₹63,000</td></tr>
  </tbody>
</table></div>

<aside class="blog-callout blog-callout--tip">
  <span class="blog-callout__label">What If Credits Exceed Your Bill?</span>
  <p>Excess credits accumulate and carry forward. You build a credit bank useful for high-consumption summer months when bills spike.</p>
</aside>

<aside class="blog-callout blog-callout--bottomline">
  <span class="blog-callout__label">The Bottom Line</span>
  <p>Solar credits are the simplest way to understand digital solar's value: every unit generated from your capacity = ₹7 off your bill. With guaranteed rates and real-time tracking, you always know exactly how much you're saving.</p>
</aside>

<a class="blog-cta" href="/#calculator">
  <strong>See your potential savings.</strong>
  <span class="blog-cta__sub">Use the PowerNetPro calculator →</span>
</a>
`,
  },

  // =====================================================================
  // 05 — Solar for Apartments
  // =====================================================================
  {
    id: "solar-for-apartments",
    slug: "solar-for-apartments",
    title: "Can You Go Solar If You Live in an Apartment? Here's How",
    excerpt:
      "Apartment living doesn't exclude you from solar. Learn about digital solar, community solar, and VNM options for apartment residents in India.",
    description:
      "Apartment living doesn't exclude you from solar. Learn about digital solar, community solar, and VNM options for apartment residents in India.",
    date: DATE,
    readingTime: "7 min read",
    category: "Guide",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&auto=format&fit=crop&q=80",
    author,
    toc: [
      { id: "why-apartments-excluded", title: "Why Apartments Have Been Left Out" },
      { id: "option-1-digital", title: "Option 1: Digital Solar (Recommended)" },
      { id: "option-2-society", title: "Option 2: Society-Level Installation" },
      { id: "option-3-green-tariff", title: "Option 3: Green Energy Tariff" },
      { id: "why-digital-wins", title: "Why Digital Solar Wins" },
    ],
    takeaways: [
      "India has over 10 crore apartments in urban areas — most excluded from traditional solar.",
      "Digital solar is the best option: no society approval, no installation, immediate savings.",
      "Society-level solar is powerful but requires RWA consensus and months of process.",
      "Green tariffs from DISCOMs support renewables but don't reduce your bill.",
      "Digital solar is the only option that lets a single apartment resident act independently and immediately.",
    ],
    content: `
<h2 id="why-apartments-excluded">Why Apartments Have Been Left Out</h2>
<p>Shared rooftops, society restrictions, consensus challenges among hundreds of owners, and tenant limitations have systematically excluded India's apartment dwellers — the segment paying some of the highest per-unit rates.</p>

<h2 id="option-1-digital">Option 1: Digital Solar (Recommended)</h2>
<p>Reserve capacity from a commercial solar plant through PowerNetPro. Credits flow to your bill. No rooftop, no society approval, no changes to your flat.</p>
<p><strong>Cost:</strong> ₹35K–40K/kW one-time</p>
<p><strong>Savings:</strong> ₹1,000–5,000+/month</p>
<p><strong>Time to start:</strong> Minutes</p>

<h2 id="option-2-society">Option 2: Society-Level Installation</h2>
<p>Collective rooftop solar with group/virtual net metering. Powerful but requires society consensus, RWA approval, DISCOM coordination, and 6–12 months.</p>

<h2 id="option-3-green-tariff">Option 3: Green Energy Tariff</h2>
<p>Some DISCOMs offer green tariffs at a small premium. Supports renewables but doesn't reduce your bill.</p>

<h2 id="why-digital-wins">Why Digital Solar Wins</h2>
<div class="blog-table"><table>
  <thead><tr><th>Factor</th><th>Digital Solar</th><th>Society Solar</th><th>Green Tariff</th></tr></thead>
  <tbody>
    <tr><td>Individual autonomy</td><td>✔ Full</td><td>✘ Needs consensus</td><td>✔ Full</td></tr>
    <tr><td>Cost savings</td><td>✔ ₹7/unit credit</td><td>✔ Shared savings</td><td>✘ May cost more</td></tr>
    <tr><td>Installation needed</td><td>✘ None</td><td>✔ On rooftop</td><td>✘ None</td></tr>
    <tr><td>Time to start</td><td>Minutes</td><td>6–12 months</td><td>Days</td></tr>
    <tr><td>Portability</td><td>✔ Moves with you</td><td>✘ Property-tied</td><td>N/A</td></tr>
  </tbody>
</table></div>

<aside class="blog-callout blog-callout--bottomline">
  <span class="blog-callout__label">The Bottom Line</span>
  <p>Living in an apartment is no longer a barrier to solar. Digital solar gives you individual autonomy, real savings, and zero hassle — all from your phone. No rooftop meeting, no society vote, no landlord permission required.</p>
</aside>

<a class="blog-cta" href="/#calculator">
  <strong>Live in an apartment? Go solar today.</strong>
  <span class="blog-cta__sub">No rooftop needed →</span>
</a>
`,
  },

  // =====================================================================
  // 06 — Solar Cost Comparison
  // =====================================================================
  {
    id: "solar-cost-comparison",
    slug: "solar-cost-comparison",
    title: "Rooftop Solar Costs in India 2026: ₹50K–70K vs ₹35K–40K per kW",
    excerpt:
      "Compare real costs of traditional rooftop solar (₹50K-70K/kW) with digital solar (₹35K-40K/kW). Understand hidden costs and which gives better ROI.",
    description:
      "Compare real costs of traditional rooftop solar (₹50K-70K/kW) with digital solar (₹35K-40K/kW). Understand hidden costs and which gives better ROI.",
    date: DATE,
    readingTime: "9 min read",
    category: "Cost & ROI",
    image:
      "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=1600&auto=format&fit=crop&q=80",
    author,
    toc: [
      { id: "traditional-cost-breakdown", title: "Traditional Rooftop: What ₹50K–70K Gets You" },
      { id: "digital-cost-breakdown", title: "Digital Solar: What ₹35K–40K Gets You" },
      { id: "fifteen-year-tco", title: "15-Year Total Cost of Ownership" },
      { id: "which-should-you-choose", title: "Which Should You Choose?" },
    ],
    takeaways: [
      "Traditional rooftop solar costs ₹50K–70K/kW before subsidies, plus ongoing maintenance.",
      "Digital solar costs ₹35K–40K/kW with zero maintenance fees — everything included.",
      "Over 15 years, digital solar's total cost of ownership is 40–55% lower than traditional rooftop.",
      "Traditional solar requires rooftop ownership, months of installation, and ongoing upkeep.",
      "The lower digital solar price reflects commercial-scale efficiency, not inferior quality.",
    ],
    content: `
<h2 id="traditional-cost-breakdown">Traditional Rooftop: What ₹50K–70K Gets You</h2>
<p><strong>Solar panels:</strong> 40–50% of cost (mono-PERC or bifacial modules)</p>
<p><strong>Inverter:</strong> 15–20% (DC to AC conversion)</p>
<p><strong>Mounting + wiring:</strong> ~20% (structure, switchgear, meters)</p>
<p><strong>Installation + approvals:</strong> Labour, DISCOM net metering (2–6 months)</p>
<p><strong>Annual maintenance:</strong> ₹3,000–5,000/year (cleaning, repairs, inverter replacement at year 10)</p>
<p>After PM Surya Ghar subsidy (up to 40%), effective cost: ₹30K–50K/kW. But you need a rooftop and months of paperwork.</p>

<h2 id="digital-cost-breakdown">Digital Solar: What ₹35K–40K Gets You</h2>
<p><strong>Capacity reservation:</strong> Guaranteed share in a 100 kW+ commercial plant.</p>
<p><strong>Professional management:</strong> Commercial installations are 20–30% more efficient per kW.</p>
<p><strong>Zero maintenance:</strong> All cleaning, repairs, replacements handled by platform.</p>
<p><strong>Real-time monitoring:</strong> IoT tracking of your generation and credits.</p>
<p><strong>Credit guarantee:</strong> Fixed ₹7/unit regardless of market changes.</p>

<h2 id="fifteen-year-tco">15-Year Total Cost of Ownership: 2 kW</h2>
<div class="blog-table"><table>
  <thead><tr><th>Component</th><th>Traditional Rooftop</th><th>Digital Solar</th></tr></thead>
  <tbody>
    <tr><td>Upfront</td><td>₹1,00,000–1,40,000</td><td>₹70,000–80,000</td></tr>
    <tr><td>Govt subsidy</td><td>−₹40,000–60,000</td><td>Included</td></tr>
    <tr><td>Effective upfront</td><td>₹60,000–80,000</td><td>₹70,000–80,000</td></tr>
    <tr><td>15-yr maintenance</td><td>₹45,000–75,000</td><td>₹0</td></tr>
    <tr><td>Inverter replace (yr 10)</td><td>₹15,000–25,000</td><td>₹0</td></tr>
    <tr><td><strong>Total 15-year cost</strong></td><td><strong>₹1,20,000–1,80,000</strong></td><td><strong>₹70,000–80,000</strong></td></tr>
    <tr><td>Rooftop required?</td><td>Yes</td><td>No</td></tr>
  </tbody>
</table></div>

<h2 id="which-should-you-choose">Which Should You Choose?</h2>
<p><strong>Choose traditional if:</strong> You own your home, have a suitable rooftop, plan to stay 10+ years, and are eligible for PM Surya Ghar subsidy.</p>
<p><strong>Choose digital solar if:</strong> You live in an apartment/rental, don't have rooftop access, want zero maintenance, value portability, or want to start immediately.</p>

<aside class="blog-callout blog-callout--bottomline">
  <span class="blog-callout__label">The Bottom Line</span>
  <p>When you factor in maintenance, inverter replacements, and installation hassle, digital solar delivers comparable or better value over 15 years — at 40–55% lower total cost. For the 70%+ of Indians without rooftop access, the choice is clear.</p>
</aside>

<a class="blog-cta" href="/#calculator">
  <strong>Compare your options and calculate savings.</strong>
  <span class="blog-cta__sub">Use the PowerNetPro calculator →</span>
</a>
`,
  },

  // =====================================================================
  // 07 — Solar Subsidy Guide + Myths
  // =====================================================================
  {
    id: "solar-subsidy-guide-myths",
    slug: "solar-subsidy-guide-myths",
    title: "Solar Subsidy in India 2026: PM Surya Ghar Guide + 10 Myths Busted",
    excerpt:
      "Everything about PM Surya Ghar solar subsidy — eligibility, amounts, application, and 10 myths debunked. Plus how digital solar helps without a rooftop.",
    description:
      "Everything about PM Surya Ghar solar subsidy — eligibility, amounts, application, and 10 myths debunked. Plus how digital solar helps without a rooftop.",
    date: DATE,
    readingTime: "10 min read",
    category: "Policy",
    image:
      "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=1600&auto=format&fit=crop&q=80",
    author,
    toc: [
      { id: "what-is-pm-surya-ghar", title: "What Is PM Surya Ghar: Muft Bijli Yojana?" },
      { id: "subsidy-structure", title: "Subsidy Structure" },
      { id: "how-to-apply", title: "How to Apply: 8 Steps" },
      { id: "myths-busted", title: "10 Solar Myths — Busted" },
    ],
    takeaways: [
      "PM Surya Ghar offers up to ₹78,000 subsidy (40% for ≤3 kW systems).",
      "The scheme targets 1 crore households by March 2027 with a ₹75,021 crore budget.",
      "Application is fully digital through pmsuryaghar.gov.in — subsidy credited within 30 days.",
      "Apartment residents can access subsidised solar through digital solar platforms.",
      "Most reasons people give for not going solar are myths. We bust 10 of them.",
    ],
    content: `
<h2 id="what-is-pm-surya-ghar">What Is PM Surya Ghar: Muft Bijli Yojana?</h2>
<p>Launched February 13, 2024 under MNRE with ₹75,021 crore budget. Goal: free electricity to 1 crore households via subsidised rooftop solar. Households generate up to 300 units of free electricity monthly.</p>

<h2 id="subsidy-structure">Subsidy Structure</h2>
<div class="blog-table"><table>
  <thead><tr><th>System Size</th><th>Subsidy Rate</th><th>Approx. Amount</th></tr></thead>
  <tbody>
    <tr><td>Up to 3 kW</td><td>40% of benchmark cost</td><td>₹30,000 – ₹78,000</td></tr>
    <tr><td>3–10 kW</td><td>20% beyond 3 kW</td><td>Additional on top of 3 kW subsidy</td></tr>
    <tr><td>Above 10 kW</td><td>No additional subsidy</td><td>—</td></tr>
  </tbody>
</table></div>

<h2 id="how-to-apply">How to Apply: 8 Steps</h2>
<ol>
  <li>Visit pmsuryaghar.gov.in.</li>
  <li>Register with state, DISCOM, consumer number, mobile, email.</li>
  <li>Log in and fill rooftop solar application.</li>
  <li>Wait for DISCOM feasibility approval.</li>
  <li>Install system via registered vendor.</li>
  <li>Submit details, apply for net meter.</li>
  <li>DISCOM inspection and commissioning certificate.</li>
  <li>Submit bank details → subsidy in 30 days.</li>
</ol>

<h2 id="myths-busted">10 Solar Myths — Busted</h2>
<h3>Myth 1: "Solar is free under this scheme"</h3>
<p><strong>Reality:</strong> Government covers 20–40%. You still pay 60–80%. A 3 kW system costs ~₹1.1–1.3 lakhs after subsidy.</p>
<h3>Myth 2: "Only homeowners qualify"</h3>
<p><strong>Reality:</strong> You need rooftop access and a connection in your name. Digital solar is the alternative for those without rooftops.</p>
<h3>Myth 3: "You need a huge rooftop"</h3>
<p><strong>Reality:</strong> 1 kW needs only ~100 sq ft of shadow-free space.</p>
<h3>Myth 4: "Panels damage your roof"</h3>
<p><strong>Reality:</strong> Modern non-penetrating mounts actually protect the roof from direct sun.</p>
<h3>Myth 5: "Solar doesn't work in monsoon"</h3>
<p><strong>Reality:</strong> Panels generate at 10–25% capacity even on cloudy days. India's annual solar irradiation is among the world's highest.</p>
<h3>Myth 6: "The process takes years"</h3>
<p><strong>Reality:</strong> Application to subsidy credit: 3–6 months. DISCOM approval can be 2–4 weeks.</p>
<h3>Myth 7: "You can sell excess and profit"</h3>
<p><strong>Reality:</strong> Net metering gives credits, not cash. Direct profit from residential grid export is rare in India.</p>
<h3>Myth 8: "Panels need constant maintenance"</h3>
<p><strong>Reality:</strong> No moving parts. Clean every 2–4 weeks, annual check-up. With digital solar, even this is handled for you.</p>
<h3>Myth 9: "Apartment residents can't benefit"</h3>
<p><strong>Reality:</strong> Digital solar platforms offer capacity at effectively subsidised rates (₹35K–40K/kW).</p>
<h3>Myth 10: "Solar will be cheaper next year"</h3>
<p><strong>Reality:</strong> Prices dropped 90%+ over the last decade. Further drops are marginal. Meanwhile, tariffs rise 8–10% yearly. Waiting costs more than acting.</p>

<aside class="blog-callout blog-callout--bottomline">
  <span class="blog-callout__label">The Bottom Line</span>
  <p>The PM Surya Ghar scheme is India's most ambitious solar programme ever. If you have a rooftop, apply now. If you don't, digital solar gives you equivalent access at competitive rates. Either way, stop letting myths hold you back.</p>
</aside>

<a class="blog-cta" href="/#calculator">
  <strong>Don't let myths cost you money.</strong>
  <span class="blog-cta__sub">Explore your solar options →</span>
</a>
`,
  },

  // =====================================================================
  // 08 — Is Digital Solar Legal
  // =====================================================================
  {
    id: "is-digital-solar-legal",
    slug: "is-digital-solar-legal",
    title: "Is Digital Solar Legal in India? Understanding the Electricity Act & SERC Regulations",
    excerpt:
      "Worried about digital solar legality? Full breakdown of how platforms operate within the Electricity Act 2003, SERC regulations, and DISCOM frameworks.",
    description:
      "Worried about digital solar legality? Full breakdown of how platforms operate within the Electricity Act 2003, SERC regulations, and DISCOM frameworks.",
    date: DATE,
    readingTime: "7 min read",
    category: "Regulation",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&auto=format&fit=crop&q=80",
    author,
    toc: [
      { id: "electricity-act-foundation", title: "The Foundation: Electricity Act, 2003" },
      { id: "state-serc-frameworks", title: "State-Level SERC Frameworks" },
      { id: "powernetpro-legal-fit", title: "How PowerNetPro Fits the Legal Framework" },
      { id: "data-protection", title: "Data Protection & Consumer Rights" },
    ],
    takeaways: [
      "Digital solar operates fully within the Electricity Act, 2003 framework.",
      "PowerNetPro does NOT sell electricity to users — users receive bill credits (critical legal distinction).",
      "State SERCs in Maharashtra, Karnataka, Delhi, Rajasthan all support virtual net metering.",
      "MNRE has clarified VNM, group net metering, and net billing are treated at par.",
      "User data is protected under IT Act 2000 and Digital Personal Data Protection Act.",
    ],
    content: `
<h2 id="electricity-act-foundation">The Foundation: Electricity Act, 2003</h2>
<p>India's power sector is governed by this Act. Key provisions for digital solar:</p>
<p><strong>Section 9 (Captive Generation):</strong> Allows any person to operate a captive generating plant for own consumption.</p>
<p><strong>Section 86(1)(e) (SERC Powers):</strong> Empowers SERCs to promote renewable energy and regulate co-generation.</p>
<p>The Act creates legal space for solar generation, net metering, and sharing renewable benefits among consumers.</p>

<h2 id="state-serc-frameworks">State-Level SERC Frameworks</h2>
<p><strong>MERC (Maharashtra):</strong> Comprehensive VNM regulations with clear credit allocation rules.</p>
<p><strong>KERC (Karnataka):</strong> Active VNM framework for apartment complexes and commercial consumers.</p>
<p><strong>DERC (Delhi):</strong> Updated VNM guidelines January 2026, all consumer categories now eligible.</p>
<p><strong>RERC (Rajasthan):</strong> Virtual and group net metering up to 1 MW across all categories.</p>

<h2 id="powernetpro-legal-fit">How PowerNetPro Fits the Legal Framework</h2>

<aside class="blog-callout blog-callout--info">
  <span class="blog-callout__label">Crucial Distinction</span>
  <p>PowerNetPro does NOT directly sell electricity to end users. Direct sale without a license would violate the Act. Instead: hosts consume electricity on-site and pay PowerNetPro. Users receive bill credits. DISCOMs bill everyone normally for net consumption.</p>
</aside>

<p><strong>1. Host arrangement:</strong> Standard B2B power purchase. Host pays ₹10–12/unit for solar electricity consumed on-site.</p>
<p><strong>2. User credits:</strong> Users receive ₹7/unit bill offset — not electricity delivery.</p>
<p><strong>3. DISCOM continuity:</strong> DISCOMs continue billing hosts and users normally. Platform operates within, not outside, DISCOM infrastructure.</p>

<h2 id="data-protection">Data Protection & Consumer Rights</h2>
<p>Compliance with IT Act 2000, Digital Personal Data Protection Act. Encrypted storage, access controls, audit trails. Transparent pricing, clear user agreements, accessible grievance handling.</p>

<aside class="blog-callout blog-callout--bottomline">
  <span class="blog-callout__label">The Bottom Line</span>
  <p>Digital solar is not a grey area — it's built on established legal frameworks: the Electricity Act 2003, state SERC regulations, and DISCOM billing infrastructure. PowerNetPro's credit-based model (not electricity sale) ensures full compliance.</p>
</aside>

<a class="blog-cta" href="/terms">
  <strong>PowerNetPro is 100% legal and regulated.</strong>
  <span class="blog-cta__sub">Read the platform terms →</span>
</a>
`,
  },

  // =====================================================================
  // 09 — Solar Hosting Commercial
  // =====================================================================
  {
    id: "solar-hosting-commercial",
    slug: "solar-hosting-commercial",
    title: "Earn from Your Unused Rooftop: How Solar Hosting Works for Commercial Buildings",
    excerpt:
      "Commercial building with unused rooftop? Solar hosting gives passive income, 40-50% electricity savings, zero investment. Learn how.",
    description:
      "Commercial building with unused rooftop? Solar hosting gives passive income, 40-50% electricity savings, zero investment. Learn how.",
    date: DATE,
    readingTime: "7 min read",
    category: "For Hosts",
    image:
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1600&auto=format&fit=crop&q=80",
    author,
    toc: [
      { id: "what-is-hosting", title: "What Is Solar Hosting?" },
      { id: "host-economics", title: "The Economics: 100 kW Host Example" },
      { id: "who-can-host", title: "Who Can Be a Host?" },
      { id: "become-a-host", title: "How to Become a Host: 7 Steps" },
    ],
    takeaways: [
      "Solar hosting means having a solar plant on your rooftop at zero capital cost.",
      "Hosts save 40–50% on electricity: pay ₹10–12/unit instead of ₹18–20 grid tariff.",
      "Zero maintenance responsibility — all handled by PowerNetPro.",
      "A 100 kW host saves ~₹12.6 lakhs per year on electricity.",
      "Ideal for commercial buildings, factories, housing societies, malls, and warehouses.",
    ],
    content: `
<h2 id="what-is-hosting">What Is Solar Hosting?</h2>
<p>You make your rooftop available for solar installation. PowerNetPro handles everything — design, procurement, installation, grid connectivity, maintenance. You consume the electricity and pay a pre-agreed rate significantly below grid tariffs.</p>

<h2 id="host-economics">The Economics: 100 kW Host Example</h2>
<p><strong>Monthly generation:</strong> ~15,000 units</p>
<p><strong>Your cost:</strong> 15,000 × ₹11 = ₹1,65,000</p>
<p><strong>Previous grid cost:</strong> 15,000 × ₹18 = ₹2,70,000</p>
<p><strong>Monthly savings:</strong> ₹1,05,000</p>
<p><strong>Annual savings:</strong> ₹12,60,000 — with ZERO investment</p>
<div class="blog-table"><table>
  <thead><tr><th>Benefit</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>Capital investment</td><td>₹0 (funded by user reservations)</td></tr>
    <tr><td>Electricity savings</td><td>40–50% off current grid tariff</td></tr>
    <tr><td>Maintenance</td><td>100% handled by PowerNetPro (₹100/kW annual)</td></tr>
    <tr><td>Agreement term</td><td>15 years (matching panel lifespan)</td></tr>
    <tr><td>Building value</td><td>Improved sustainability credentials &amp; property value</td></tr>
  </tbody>
</table></div>

<h2 id="who-can-host">Who Can Be a Host?</h2>
<p>Commercial offices, industrial facilities, housing societies, retail malls, warehouses, hospitals, hotels, educational institutions — any property with adequate shadow-free rooftop, structural integrity, and DISCOM connection.</p>

<h2 id="become-a-host">How to Become a Host: 7 Steps</h2>
<ol>
  <li><strong>Express interest</strong> through powernetpro.com or our sales team.</li>
  <li><strong>Site assessment:</strong> Technical team evaluates your rooftop.</li>
  <li><strong>Financial proposal:</strong> Projected generation, per-unit cost, savings.</li>
  <li><strong>Agreement:</strong> 15-year hosting agreement signed.</li>
  <li><strong>Installation:</strong> EPC partner installs (4–8 weeks for 100 kW).</li>
  <li><strong>Commissioning:</strong> Grid connectivity and net metering processed.</li>
  <li><strong>Start saving:</strong> Day one — solar electricity at lower tariff.</li>
</ol>

<aside class="blog-callout blog-callout--bottomline">
  <span class="blog-callout__label">The Bottom Line</span>
  <p>If you have an unused commercial rooftop, you're sitting on a hidden revenue stream. Solar hosting delivers ₹10+ lakhs in annual savings at zero investment and zero maintenance. Contact PowerNetPro for a free assessment.</p>
</aside>

<a class="blog-cta" href="/host-landing">
  <strong>Turn your rooftop into savings.</strong>
  <span class="blog-cta__sub">Request a free site assessment →</span>
</a>
`,
  },

  // =====================================================================
  // 10 — PPA Explained
  // =====================================================================
  {
    id: "ppa-explained",
    slug: "ppa-explained",
    title: "Power Purchase Agreements (PPA) Explained: A Guide for Building Owners",
    excerpt:
      "What is a solar PPA? Plain-English guide for commercial building owners on power purchase agreements, key terms, and risk-free solar hosting.",
    description:
      "What is a solar PPA? Plain-English guide for commercial building owners on power purchase agreements, key terms, and risk-free solar hosting.",
    date: DATE,
    readingTime: "6 min read",
    category: "For Hosts",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&auto=format&fit=crop&q=80",
    author,
    toc: [
      { id: "what-is-a-ppa", title: "What Is a Power Purchase Agreement?" },
      { id: "key-ppa-terms", title: "Key Terms to Understand" },
      { id: "why-ppa-protects", title: "Why PPAs Protect Building Owners" },
      { id: "what-to-check", title: "What to Check Before Signing" },
    ],
    takeaways: [
      "A PPA is a long-term contract: developer installs solar, you buy the electricity at a discounted rate.",
      "Zero upfront investment — the developer funds everything.",
      "Locked-in tariff of ₹10–12/unit vs ₹18–20 grid rate for the full 15-year term.",
      "Developer handles all maintenance, repairs, and performance guarantees.",
      "If the plant underperforms, compensation mechanisms protect you.",
    ],
    content: `
<h2 id="what-is-a-ppa">What Is a Power Purchase Agreement?</h2>
<p>A PPA is a contract between a power producer (solar developer) and consumer (building owner). The developer installs and maintains a solar plant on your property. You buy the electricity at a pre-agreed rate, cheaper than grid. You don't buy the panels — you buy the power.</p>

<h2 id="key-ppa-terms">Key Terms to Understand</h2>
<p><strong>Tariff:</strong> ₹10–12/unit vs grid ₹18–20. May include small annual escalation (1–3%).</p>
<p><strong>Term:</strong> 15–25 years, matching panel lifespan. PowerNetPro standard: 15 years.</p>
<p><strong>Performance guarantee:</strong> Minimum 85% of estimated annual generation.</p>
<p><strong>Deemed generation:</strong> If you damage the plant, billing continues at estimated levels until repairs.</p>
<p><strong>Maintenance:</strong> 100% developer's responsibility — cleaning, repairs, replacements.</p>
<p><strong>Metering:</strong> Monthly joint readings. Annual calibration at developer's cost.</p>
<p><strong>Damage liability:</strong> Host damage = host pays. Developer fault = developer pays. Joint inspection resolves disputes.</p>

<h2 id="why-ppa-protects">Why PPAs Protect Building Owners</h2>
<div class="blog-table"><table>
  <thead><tr><th>Protection</th><th>How It Works</th></tr></thead>
  <tbody>
    <tr><td>Financial risk</td><td>Zero upfront investment</td></tr>
    <tr><td>Performance risk</td><td>85% generation guarantee</td></tr>
    <tr><td>Maintenance risk</td><td>Fully developer's responsibility</td></tr>
    <tr><td>Price risk</td><td>Locked-in tariff for 15 years</td></tr>
    <tr><td>Technology risk</td><td>Developer handles all equipment issues</td></tr>
  </tbody>
</table></div>

<h2 id="what-to-check">What to Check Before Signing</h2>
<p>Verify: clear tariff and escalation formula, performance guarantee percentage, maintenance cost ownership, damage liability framework, early termination conditions, and end-of-term equipment disposition.</p>

<aside class="blog-callout blog-callout--bottomline">
  <span class="blog-callout__label">The Bottom Line</span>
  <p>A solar PPA is one of the most risk-free contracts a building owner can sign: zero investment, guaranteed savings, zero maintenance, and locked-in pricing. The developer takes all the risk — you take all the savings.</p>
</aside>

<a class="blog-cta" href="/host-landing">
  <strong>Get a no-commitment PPA proposal.</strong>
  <span class="blog-cta__sub">Contact PowerNetPro →</span>
</a>
`,
  },

  // =====================================================================
  // 11 — Housing Societies Solar
  // =====================================================================
  {
    id: "housing-societies-solar",
    slug: "housing-societies-solar",
    title: "Why Housing Societies Should Consider Solar Hosting in 2026",
    excerpt:
      "Housing societies can cut common area electricity by 40-50% at zero investment. Guide for RWAs on solar hosting benefits and process.",
    description:
      "Housing societies can cut common area electricity by 40-50% at zero investment. Guide for RWAs on solar hosting benefits and process.",
    date: DATE,
    readingTime: "7 min read",
    category: "For Hosts",
    image:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1600&auto=format&fit=crop&q=80",
    author,
    toc: [
      { id: "rising-common-area-costs", title: "The Problem: Rising Common Area Costs" },
      { id: "solar-hosting-solution", title: "The Solution: Solar Hosting" },
      { id: "pune-example", title: "Real Example: 200-Flat Society in Pune" },
      { id: "how-to-get-started", title: "How to Get Started" },
    ],
    takeaways: [
      "Common area electricity bills of ₹2–5 lakhs/month can be cut 40–50%.",
      "Zero capital expenditure — no special levy or society loan needed.",
      "A 200-flat society can save ~₹6.7 lakhs annually (₹1 crore over 15 years).",
      "Individual flat owners can also reserve digital solar for personal bills.",
      "Process from first contact to commissioning: 2–4 months.",
    ],
    content: `
<h2 id="rising-common-area-costs">The Problem: Rising Common Area Costs</h2>
<p>Lifts, water pumps, corridor lighting, CCTV, clubhouse, parking — common area electricity at commercial tariffs (₹10–20/unit) drives maintenance charges up relentlessly. For 100–200 flats, monthly bills easily reach ₹2–5 lakhs. This cost flows directly to residents.</p>

<h2 id="solar-hosting-solution">The Solution: Solar Hosting</h2>
<ol>
  <li>PowerNetPro installs solar on your society rooftop — zero cost.</li>
  <li>Society consumes solar electricity for common areas.</li>
  <li>Pay ₹10–12/unit instead of ₹18–20 grid rate.</li>
  <li>All maintenance handled by PowerNetPro.</li>
  <li>Flat owners can also reserve personal digital solar capacity.</li>
</ol>

<h2 id="pune-example">Real Example: 200-Flat Society in Pune</h2>
<p><strong>Monthly consumption:</strong> 8,000 units at ₹18/unit = ₹1,44,000</p>
<p><strong>After 60 kW solar:</strong> 8,000 × ₹11 = ₹88,000</p>
<p><strong>Monthly savings:</strong> ₹56,000</p>
<p><strong>Annual savings:</strong> ₹6,72,000</p>
<p><strong>15-year savings:</strong> ~₹1 crore</p>

<aside class="blog-callout blog-callout--tip">
  <span class="blog-callout__label">For the RWA Committee</span>
  <p>Reduced maintenance charges = happier residents. Zero capex = no special levy. Green credentials = higher property values. Professional maintenance = one less thing to manage.</p>
</aside>

<h2 id="how-to-get-started">How to Get Started</h2>
<ol>
  <li>Raise the topic at the next RWA meeting with these projections.</li>
  <li>Pass a society resolution expressing interest.</li>
  <li>Contact PowerNetPro for free site assessment and proposal.</li>
  <li>Review proposal in general body meeting.</li>
  <li>Sign hosting agreement → installation begins within weeks.</li>
</ol>

<aside class="blog-callout blog-callout--bottomline">
  <span class="blog-callout__label">The Bottom Line</span>
  <p>Housing societies are the ideal solar hosting partners: large rooftops, high electricity consumption, and a built-in community of potential digital solar users. At zero investment and ₹6+ lakhs in annual savings, the only question is why you haven't started yet.</p>
</aside>

<a class="blog-cta" href="/host-landing">
  <strong>Is your society ready to save?</strong>
  <span class="blog-cta__sub">Request a free proposal →</span>
</a>
`,
  },

  // =====================================================================
  // 12 — Future of Energy India
  // =====================================================================
  {
    id: "future-of-energy-india",
    slug: "future-of-energy-india",
    title:
      "The Future of Energy in India: From Grid Dependence to Digital Solar & One Nation One Grid",
    excerpt:
      "India's energy landscape is transforming. From One Nation One Grid to digital solar, understand the trends reshaping how Indians generate and consume electricity.",
    description:
      "India's energy landscape is transforming. From One Nation One Grid to digital solar, understand the trends reshaping how Indians generate and consume electricity.",
    date: DATE,
    readingTime: "9 min read",
    category: "Vision",
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&auto=format&fit=crop&q=80",
    author,
    toc: [
      { id: "current-landscape", title: "India's Current Energy Landscape" },
      { id: "one-nation-one-grid", title: "One Nation One Grid: What It Means" },
      { id: "digital-solar-role", title: "Digital Solar's Role" },
      { id: "six-trends", title: "6 Trends Shaping India's Energy Future" },
      { id: "powernetpro-vision", title: "PowerNetPro's Vision" },
    ],
    takeaways: [
      "India is the world's 3rd-largest electricity consumer with 500 GW non-fossil fuel target by 2030.",
      "One Nation One Grid enables efficient power transfer from solar-rich to demand-heavy states.",
      "Digital solar bridges the gap between macro infrastructure and individual consumer access.",
      "Key trends: P2P energy trading, battery storage, EV-solar convergence, smart grids.",
      "PowerNetPro's roadmap: 10 MW capacity, 15,000 households, 75,000 tonnes CO₂ offset by Year 5.",
    ],
    content: `
<h2 id="current-landscape">India's Current Energy Landscape</h2>
<p>India's installed capacity has crossed 430 GW, with renewables accounting for 40%+ of capacity. The government targets 500 GW non-fossil fuel by 2030 and net-zero by 2070. But the challenge isn't just generation — it's distribution.</p>

<h2 id="one-nation-one-grid">One Nation One Grid: What It Means</h2>
<p>ONOG synchronises India's five regional grids into one system at 50 Hz. Technically achieved in 2013, the focus now is strengthening inter-regional capacity, reducing losses, enabling power flow from surplus to deficit states, and integrating large-scale renewables.</p>
<p>For consumers: more reliable supply, fewer blackouts, and eventually sourcing power from the cheapest generation anywhere in India.</p>

<h2 id="digital-solar-role">Digital Solar's Role</h2>
<p>While ONOG addresses macro transmission, digital solar addresses micro-level access. Together they form a complete value chain:</p>
<p><strong>ONOG ensures:</strong> Power flows efficiently across India at the transmission level.</p>
<p><strong>Digital solar ensures:</strong> Individuals can participate in distributed solar at the consumer level.</p>
<p>Digital solar is the last-mile bridge between India's renewable infrastructure and the individual consumer without rooftop access.</p>

<h2 id="six-trends">6 Trends Shaping India's Energy Future</h2>
<h3>1. Decentralised Generation</h3>
<p>Moving from large centralised plants to solar on every rooftop and community solar in every neighbourhood. Lower transmission losses, higher resilience.</p>
<h3>2. Peer-to-Peer Energy Trading</h3>
<p>Blockchain-based platforms enabling consumers to trade excess solar with each other. PowerNetPro's P2P credit marketplace is under development.</p>
<h3>3. Battery Storage Integration</h3>
<p>Community storage makes solar power available after sunset. Battery costs have fallen 90%+ in a decade.</p>
<h3>4. EV-Solar Convergence</h3>
<p>EV charging stations powered by solar create closed-loop clean transport. PowerNetPro is exploring EV charging at host locations.</p>
<h3>5. Smart Grid &amp; Demand Response</h3>
<p>AI-driven grid management matching real-time generation with consumption, incentivising load-shifting to peak solar hours.</p>
<h3>6. VNM Expansion</h3>
<p>More states notifying VNM regulations every quarter. By 2028, expected nationwide, unlocking digital solar for hundreds of millions.</p>

<h2 id="powernetpro-vision">PowerNetPro's Vision</h2>
<div class="blog-table"><table>
  <thead><tr><th>Milestone</th><th>Target</th></tr></thead>
  <tbody>
    <tr><td>Installed capacity</td><td>100 kW pilot → 10 MW by Year 5</td></tr>
    <tr><td>Households served</td><td>15,000+</td></tr>
    <tr><td>CO₂ offset</td><td>75,000 tonnes annually</td></tr>
    <tr><td>Features</td><td>P2P trading, battery storage, EV charging</td></tr>
    <tr><td>Geographic reach</td><td>Tier 1, 2, and 3 cities across India</td></tr>
  </tbody>
</table></div>

<aside class="blog-callout blog-callout--bottomline">
  <span class="blog-callout__label">The Bottom Line</span>
  <p>India's energy future will be digital, distributed, and solar. The infrastructure is being built, regulations are being notified, the technology is proven. The question isn't whether this future will arrive — it's whether you'll be part of it from the beginning.</p>
</aside>

<a class="blog-cta" href="/#calculator">
  <strong>Be part of India's energy future.</strong>
  <span class="blog-cta__sub">Start your digital solar journey →</span>
</a>
`,
  },
];
