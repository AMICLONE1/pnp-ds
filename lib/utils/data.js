export const faqData = [
  {
    question: "What is Digital Solar and how does it work?",
    answer: "Digital Solar allows you to access clean solar energy without installing panels on your property. You reserve capacity from community solar projects, and the energy generated creates credits that automatically offset your electricity bills.",
    category: "Getting Started"
  },
  {
    question: "Do I need to own my home to participate?",
    answer: "No! Digital Solar is perfect for renters, apartment dwellers, and anyone who can't install panels. As long as you pay an electricity bill, you can participate and save.",
    category: "Eligibility"
  },
  {
    question: "How much can I save on my electricity bills?",
    answer: "Most users save between ₹500-2,000 per month depending on their capacity reservation. Our calculator can give you a personalized estimate based on your current usage.",
    category: "Savings"
  },
  {
    question: "Is there any installation required?",
    answer: "Zero installation required. No technicians visiting your home, no permits, no hardware. Everything is managed digitally through our platform.",
    category: "Getting Started"
  },
  {
    question: "How do solar credits appear on my bill?",
    answer: "Credits are automatically applied to your utility bill each month. You'll see them as a line item showing the energy generated from your reserved capacity, reducing your total bill.",
    category: "Billing"
  },
  {
    question: "What happens if the solar project generates less energy than expected?",
    answer: "We guarantee 75% of forecasted generation. This means even during cloudy periods or monsoon season, you're protected against significant shortfalls.",
    category: "Guarantees"
  },
  {
    question: "Can I change my capacity reservation later?",
    answer: "Yes! You can increase your capacity at any time. Decreasing capacity or cancelling follows our 30-day notice policy with pro-rated refunds.",
    category: "Flexibility"
  },
  {
    question: "Which utilities are supported?",
    answer: "We currently support major utilities across Maharashtra, Karnataka, Tamil Nadu, and Gujarat. Use our compatibility checker to see if your utility is supported.",
    category: "Eligibility"
  },
];

// Testimonial Data
export const testimonialData = [
  {
    content: "I've been saving over ₹1,800 every month since joining PowerNet Pro. As someone living in an apartment, I never thought I could go solar. This is revolutionary!",
    author: "Priya Sharma",
    role: "Apartment Resident",
    location: "Mumbai",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    savings: "₹1,800/month"
  },
  {
    content: "The setup took literally 5 minutes. No technicians, no roof inspections, nothing. Just sign up and start saving. Wish I knew about this years ago.",
    author: "Rajesh Kumar",
    role: "IT Professional",
    location: "Bangalore",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    savings: "₹2,100/month"
  },
  {
    content: "Finally, clean energy that works for tenants! I've moved twice since joining and my solar credits follow me. Best green decision I've made.",
    author: "Ananya Patel",
    role: "Tenant",
    location: "Pune",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    savings: "₹1,500/month"
  },
  {
    content: "As a small business owner, every rupee counts. Digital Solar has reduced our electricity costs by 35%. The team support is exceptional too.",
    author: "Mohammed Ismail",
    role: "Business Owner",
    location: "Chennai",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed",
    savings: "₹4,200/month"
  },
];

// Blog Data
export const blogData = [
  {
    id: "blog-1",
    title: "How Digital Solar is Changing the Energy Landscape in India",
    excerpt: "Discover how community solar projects are making clean energy accessible to urban residents across India.",
    description: "Solar panels may seem complicated—we'll make it simple.",
    date: "March 10, 2024",
    updatedDate: "Feb 23, 2026",
    readingTime: "6 min read",
    category: "Announcements",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=60",
    slug: "changing-energy-landscape",
    author: {
      name: "Emily Walker",
      role: "Written by",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
    },
    editor: {
      name: "Kristina Zagame",
      role: "Edited by"
    },
    takeaways: [
      "Solar cells are typically made from a material called silicon, which generates electricity through a process known as the photovoltaic effect.",
      "Solar inverters convert DC electricity into AC electricity, the electrical current appliances run on when plugged into a standard wall socket.",
      "Other types of solar technology include solar hot water and concentrated solar power. They both use the sun's energy but work differently than traditional solar panels."
    ],
    toc: [
      { id: "what-is-solar", title: "To start, what exactly is solar energy?" },
      { id: "how-it-works", title: "How solar panels work: The photovoltaic effect explained" },
      { id: "what-made-of", title: "What are solar panels made of?" },
      { id: "how-generate", title: "How do solar panels generate electricity for your home?" },
      { id: "tech-types", title: "What types of solar technology exist?" }
    ],
    content: `
      <h2 id="what-is-solar">To start, what exactly is solar energy?</h2>
      <p>Solar energy is the light and heat that come from the sun. To understand how it's produced, let's start with the smallest form of solar energy: the photon.</p>
      <p><strong>Photons</strong> are waves and particles created in the sun's core (the hottest part of the sun) through a process called nuclear fusion. The sun's core is a whopping 27 million degrees Fahrenheit. This extreme temperature and pressure causes hydrogen atoms to smash into each other and fuse into helium, releasing an incredible amount of energy in the form of photons.</p>
      <p>These photons then travel from the sun's core to its surface—a journey that can take over 100,000 years! Once they reach the surface, they zoom through space at the speed of light, reaching Earth in just about eight minutes.</p>
      <p>The amount of solar energy that hits the Earth's surface in one hour is enough to power the entire world for a year. The challenge is capturing and converting it efficiently—and that's exactly what solar panels do. India alone receives an average of 4–7 kWh of solar energy per square meter per day, making it one of the most solar-rich countries in the world.</p>

      <h2 id="how-it-works">How solar panels work: The photovoltaic effect explained</h2>
      <p>When those photons reach your solar panels, they hit the solar cells. This is where the magic happens—specifically, the <strong>photovoltaic (PV) effect</strong>. Solar cells are made of semiconductor materials, most commonly silicon.</p>
      <p>The silicon is treated to create an electric field, with one side having a positive charge and the other a negative charge. When a photon hits the cell, its energy knocks an electron loose from an atom in the silicon. The electric field then pushes that electron toward the negative side of the cell, creating a flow of electricity.</p>
      <p>This flow of electrons is called <strong>direct current (DC) electricity</strong>. A single solar cell produces only a tiny amount of power, but when you connect many cells together into a solar panel—and many panels together into a solar array—you get enough electricity to power a home, business, or even an entire city block.</p>
      <p>The efficiency of this process depends on several factors: the quality of the silicon, the angle of the panels relative to the sun, local weather conditions, and even the temperature of the panels themselves. Interestingly, very high temperatures can actually reduce panel efficiency, which is why proper installation and ventilation matters.</p>

      <h2 id="what-made-of">What are solar panels made of?</h2>
      <p>Most solar panels are made primarily of <strong>silicon solar cells</strong>, but they contain several other important components that work together to generate and protect your electricity production.</p>
      <p>A typical solar panel consists of:</p>
      <ul>
        <li><strong>Silicon solar cells</strong> – the core component that converts sunlight into electricity via the photovoltaic effect.</li>
        <li><strong>Metal conductive plates and wires</strong> – collect and transfer the electrons released by the solar cells.</li>
        <li><strong>A glass casing</strong> – protects the cells from weather and physical damage while allowing sunlight to pass through.</li>
        <li><strong>An anti-reflective coating</strong> – increases the amount of sunlight absorbed rather than reflected away.</li>
        <li><strong>A protective back sheet</strong> – shields the back of the panel from moisture, UV exposure, and temperature changes.</li>
        <li><strong>An aluminum frame</strong> – provides structural support and allows for easy mounting on rooftops or ground arrays.</li>
      </ul>
      <p>There are three main types of silicon solar cells used in panels: <strong>monocrystalline</strong>, <strong>polycrystalline</strong>, and <strong>thin-film</strong>. Monocrystalline panels are the most efficient and durable—typically converting 15–22% of sunlight into electricity—but they're also the most expensive. Polycrystalline panels are slightly less efficient but more affordable, while thin-film panels are lightweight and flexible but generally less efficient than crystalline options.</p>

      <h2 id="how-generate">How do solar panels generate electricity for your home?</h2>
      <p>Your solar panels don't directly power your appliances. There are a few important steps between the sunlight hitting your panels and the electricity reaching your TV, refrigerator, or air conditioner.</p>
      <p>Here's the full journey of solar electricity in a home system:</p>
      <ol>
        <li><strong>Sunlight hits the panels</strong> – Solar cells absorb photons and generate DC electricity.</li>
        <li><strong>The inverter converts DC to AC</strong> – A solar inverter transforms the DC electricity your panels produce into alternating current (AC) electricity, which is what your home appliances and the electrical grid use.</li>
        <li><strong>Your home uses the electricity</strong> – The AC electricity flows through your home's electrical panel, powering your devices just like utility electricity does.</li>
        <li><strong>Excess electricity goes to the grid or battery</strong> – If your panels produce more power than you're using, the surplus can be sent back to the grid (earning you credits through net metering) or stored in a home battery like a Tesla Powerwall for later use.</li>
        <li><strong>You draw from the grid at night</strong> – Without a battery, your home pulls electricity from the grid when panels aren't producing (at night or during heavy cloud cover). With net metering, the credits you earned during the day offset these nighttime costs.</li>
      </ol>
      <p>In a community solar or digital solar model—like Digital Solar—you don't need panels on your roof at all. Instead, you subscribe to capacity at a shared solar farm. The energy generated flows into the grid and your utility applies equivalent credits directly to your electricity bill each month.</p>

      <h2 id="tech-types">What types of solar technology exist?</h2>
      <p>Solar panels are the most well-known solar technology, but they're far from the only way humans harness the sun's energy. Here's a look at the major solar technologies available today:</p>
      <h3>Photovoltaic (PV) Solar Panels</h3>
      <p>This is the technology we've been discussing throughout this article—solar cells that convert sunlight directly into electricity. PV panels are used in residential rooftop systems, community solar farms, utility-scale installations, and even small consumer products like solar-powered chargers.</p>
      <h3>Solar Hot Water (Solar Thermal)</h3>
      <p><strong>Solar thermal systems</strong> use the sun's heat—rather than its light—to warm water directly. Rooftop collectors absorb solar heat and transfer it to a fluid that heats your home's water supply. These systems are particularly popular in countries with high solar irradiance and can reduce water heating bills by 50–80%.</p>
      <h3>Concentrated Solar Power (CSP)</h3>
      <p><strong>Concentrated solar power</strong> plants use mirrors or lenses to focus a large area of sunlight onto a small point. The intense heat is used to boil water and drive a steam turbine—similar to a conventional power plant, but fueled by the sun. CSP plants can also store heat energy, allowing them to generate electricity even after sunset.</p>
      <h3>Building-Integrated Photovoltaics (BIPV)</h3>
      <p>BIPV systems integrate solar cells directly into building materials—solar roof tiles, solar windows, solar facades—rather than mounting panels on top of existing structures. Companies like Tesla have popularized solar roof tiles as a more aesthetically integrated alternative to traditional panels.</p>
      <h3>Floating Solar (Floatovoltaics)</h3>
      <p>Floating solar farms are installed on the surface of reservoirs, lakes, and ponds. They're particularly promising in land-scarce regions and have the added benefit of reducing water evaporation from the reservoirs they float on. India has been increasingly investing in floating solar projects across its major water bodies.</p>
      <p>Each technology has its strengths and ideal use cases. For most households and renters today, community solar and traditional rooftop PV represent the most accessible pathways to clean, affordable solar energy.</p>
    `
  },
  {
    id: "blog-2",
    title: "5 Simple Ways to Reduce Your Electricity Bill This Summer",
    excerpt: "Practical tips to keep your home cool and your energy costs low during the peak summer months.",
    date: "March 05, 2024",
    category: "Tips & Tricks",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=60",
    slug: "reduce-electricity-bill-summer",
    author: {
      name: "Emily Walker",
      role: "Written by",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
    },
    editor: {
      name: "Kristina Zagame",
      role: "Edited by"
    },
    updatedDate: "Feb 23, 2026",
    readingTime: "5 min read",
    content: "<p>Content for this article is coming soon...</p>"
  },
  {
    id: "blog-3",
    title: "Understanding Solar Credits: A Comprehensive Guide",
    excerpt: "Learn how solar credits are calculated and applied to your utility bills automatically.",
    date: "February 28, 2024",
    category: "Education",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop&q=60",
    slug: "understanding-solar-credits",
    author: {
      name: "Emily Walker",
      role: "Written by",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
    },
    editor: {
      name: "Kristina Zagame",
      role: "Edited by"
    },
    updatedDate: "Feb 23, 2026",
    readingTime: "4 min read",
    content: "<p>Content for this article is coming soon...</p>"
  },
  {
    id: "blog-4",
    title: "Why Tenants Love Digital Solar More Than Traditional Rooftop",
    excerpt: "Exploring the flexibility and portability benefits of digital solar for those who don't own their roofs.",
    date: "February 20, 2024",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop&q=60",
    slug: "tenants-love-digital-solar",
    author: {
      name: "Emily Walker",
      role: "Written by",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
    },
    editor: {
      name: "Kristina Zagame",
      role: "Edited by"
    },
    updatedDate: "Feb 23, 2026",
    readingTime: "7 min read",
    content: "<p>Content for this article is coming soon...</p>"
  }
];