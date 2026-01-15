export const donorData = {
  name: "Pak Sopian Hadianto",
  waqfPrincipal: 125000,
  netYield2025: 6909,
  yieldToImpact: 94,
  totalBeneficiaries: 20,
  indirectBeneficiaries: 44,
  barakahScore: 9.2,
  waqifSince: 2024,
  portfolio: [
    { name: "IDB Sovereign Sukuk", allocation: 75000, yield: 5.2, type: "Ijarah" },
    { name: "GIFR Infrastructure Sukuk", allocation: 50000, yield: 6.8, type: "Musharakah" }
  ],
  projects: [
    {
      id: "EDU-COX",
      name: "Hadianto Learning Center",
      location: "Cox's Bazar, Bangladesh",
      status: "OPERATIONAL",
      allocated: 4145.40,
      beneficiaries: 12,
      image: "🏫",
      progress: 100,
      lastUpdate: "8 Jan 2026",
      category: "Education",
      lat: 21.1833,
      lng: 92.1500
    },
    {
      id: "LIV-TUR",
      name: "Syrian Women's Tailoring Cooperative",
      location: "Gaziantep, Türkiye",
      status: "SCALING",
      allocated: 2763.60,
      beneficiaries: 8,
      image: "🧵",
      progress: 75,
      lastUpdate: "22 Dec 2025",
      category: "Livelihood",
      lat: 37.0662,
      lng: 37.3833
    }
  ]
};

export const beneficiaryStories = [
  {
    id: "fatima",
    name: "Fatima Begum",
    age: 9,
    projectId: "EDU-COX",
    category: "Education",
    location: "Cox's Bazar",
    emoji: "👧🏽",
    gradientLight: "from-amber-100 to-emerald-100",
    gradientDark: "from-amber-900/30 to-emerald-900/30",
    tagColorLight: "bg-emerald-100 text-emerald-700",
    tagColorDark: "bg-emerald-900/50 text-emerald-400",
    title: "Fatima's Journey",
    quote: "For the first time since fleeing Myanmar, my daughter dreams of becoming a teacher.",
    quoteAuthor: "Rahima, mother of Fatima",
    fullStory: `Fatima Begum arrived at Kutupalong refugee camp in 2017, at just 3 years old. She had never known a classroom, never held a pencil, never read a single word.

When the Hadianto Learning Center opened its doors in early 2025, Fatima was among the first 12 children to enroll. Her mother Rahima, a widow who lost her husband during the exodus from Myanmar, had one dream: that her daughter would have the education she never could.

**Progress Report (January 2026):**
- Reading Level: Grade 2 ✅ (started at Grade 0)
- Math Skills: Basic arithmetic mastered
- Attendance: 94% (only missed days due to illness)
- Health: Good condition, receiving nutrition support

Fatima now reads stories to younger children at the camp. Her favorite subject is mathematics, and she helps her mother count their small earnings from selling vegetables.

*"When I grow up, I want to teach other children like me. I want them to know that even refugees can become teachers."* — Fatima

**Your Impact:** Your Waqf contributed $345.45 to Fatima's education this year. This perpetual investment will continue supporting her and future students indefinitely.`,
    stats: {
      readingLevel: "Grade 2",
      attendance: "94%",
      yearsSupported: 1,
      yourContribution: 345.45
    }
  },
  {
    id: "mariam",
    name: "Mariam Al-Hassan",
    age: 34,
    projectId: "LIV-TUR",
    category: "Livelihood",
    location: "Gaziantep",
    emoji: "👩🏻‍🦱",
    gradientLight: "from-purple-100 to-pink-100",
    gradientDark: "from-purple-900/30 to-pink-900/30",
    tagColorLight: "bg-purple-100 text-purple-700",
    tagColorDark: "bg-purple-900/50 text-purple-400",
    title: "Mariam's Cooperative",
    quote: "From refugee to entrepreneur. Mariam now employs 3 other Syrian women in her tailoring business.",
    quoteAuthor: "Income multiplier: 5.14x",
    fullStory: `Mariam Al-Hassan fled Aleppo in 2015 with her three children after her tailor shop was destroyed in the conflict. She arrived in Gaziantep with nothing but her skills and determination.

For years, she worked odd jobs — cleaning houses, washing dishes — barely earning enough to feed her children. Her tailoring skills, honed over 15 years in Syria, sat dormant.

**The Transformation:**
In mid-2025, Mariam received a $350 micro-grant from the GIFR Syrian Women's Tailoring Cooperative. With this seed funding, she purchased a sewing machine and basic supplies.

Within 6 months, Mariam's business grew beyond her expectations:
- **Month 1-2:** Took orders from neighbors, earned $180/month
- **Month 3-4:** Hired her first employee, another Syrian refugee
- **Month 5-6:** Expanded to 3 employees, monthly revenue hit $1,200

**Current Status (January 2026):**
- Employees: 3 Syrian refugee women
- Monthly Revenue: $1,800
- Income Multiplier: 5.14x the initial investment
- Products: Traditional Syrian dresses, modern alterations, school uniforms

*"I never imagined I would be an employer. Now I can send all my children to school, and I've given three other mothers the same hope."* — Mariam

**Your Impact:** Your Waqf contributed $230.30 to Mariam's cooperative. This single investment has created 4 sustainable incomes.`,
    stats: {
      employees: 3,
      monthlyRevenue: 1800,
      incomeMultiplier: "5.14x",
      yourContribution: 230.30
    }
  }
];

export const yieldHistoryData = [
  { month: 'Jul', yield: 580 },
  { month: 'Aug', yield: 590 },
  { month: 'Sep', yield: 575 },
  { month: 'Oct', yield: 585 },
  { month: 'Nov', yield: 600 },
  { month: 'Dec', yield: 610 },
  { month: 'Jan', yield: 595 }
];

export const beneficiaryChartData = [
  { name: 'Education', direct: 12, indirect: 26 },
  { name: 'Livelihood', direct: 8, indirect: 18 }
];

export const sdgList = [
  { icon: '📚', name: 'SDG 4: Quality Education' },
  { icon: '⚖️', name: 'SDG 5: Gender Equality' },
  { icon: '💼', name: 'SDG 8: Decent Work' },
  { icon: '🤝', name: 'SDG 10: Reduced Inequalities' }
];
