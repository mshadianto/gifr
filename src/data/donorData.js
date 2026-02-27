export const donorData = {
  name: "Pak MS Hadianto",
  waqfPrincipal: 125000,
  netYield2025: 6909,
  yieldToImpact: 94,
  totalBeneficiaries: 89,
  indirectBeneficiaries: 196,
  barakahScore: 9.2,
  waqifSince: 2024,
  projectCountries: ["Bangladesh", "Turkey", "Indonesia"],
  portfolio: [
    { name: "IDB Sovereign Sukuk", allocation: 75000, yield: 5.2, type: "Ijarah" },
    { name: "GIFR Infrastructure Sukuk", allocation: 50000, yield: 6.8, type: "Musharakah" }
  ],
  projects: [
    {
      id: "EDU-COX",
      name: "Hadianto Learning Center",
      location: "Cox's Bazar, Bangladesh",
      country: "Bangladesh",
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
      country: "Turkey",
      status: "SCALING",
      allocated: 2763.60,
      beneficiaries: 8,
      image: "🧵",
      progress: 75,
      lastUpdate: "22 Dec 2025",
      category: "Livelihood",
      lat: 37.0662,
      lng: 37.3833
    },
    {
      id: "EDU-IDN-1",
      name: "Pesantren Al-Hadianto Digital",
      location: "Tasikmalaya, Jawa Barat",
      country: "Indonesia",
      status: "OPERATIONAL",
      allocated: 1800.00,
      beneficiaries: 45,
      image: "🕌",
      progress: 85,
      lastUpdate: "15 Feb 2026",
      category: "Education",
      lat: -7.3274,
      lng: 108.2207,
      currency: "IDR",
      allocatedLocal: 28800000
    },
    {
      id: "LIV-IDN-2",
      name: "Koperasi UMKM Syariah Perempuan",
      location: "Padang, Sumatera Barat",
      country: "Indonesia",
      status: "SCALING",
      allocated: 1200.00,
      beneficiaries: 24,
      image: "🧕",
      progress: 60,
      lastUpdate: "1 Feb 2026",
      category: "Livelihood",
      lat: -0.9471,
      lng: 100.4172,
      currency: "IDR",
      allocatedLocal: 19200000
    },
    {
      id: "WQF-IDN-3",
      name: "Masjid Produktif Al-Falah",
      location: "Yogyakarta, DI Yogyakarta",
      country: "Indonesia",
      status: "PLANNING",
      allocated: 900.00,
      beneficiaries: 0,
      image: "🏗️",
      progress: 25,
      lastUpdate: "10 Feb 2026",
      category: "Waqf Produktif",
      lat: -7.7956,
      lng: 110.3695,
      currency: "IDR",
      allocatedLocal: 14400000
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
    country: "Bangladesh",
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
    country: "Turkey",
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
  },
  {
    id: "aisyah",
    name: "Aisyah Nurjanah",
    age: 16,
    projectId: "EDU-IDN-1",
    category: "Education",
    location: "Tasikmalaya",
    country: "Indonesia",
    emoji: "👩🏽‍🎓",
    gradientLight: "from-blue-100 to-emerald-100",
    gradientDark: "from-blue-900/30 to-emerald-900/30",
    tagColorLight: "bg-blue-100 text-blue-700",
    tagColorDark: "bg-blue-900/50 text-blue-400",
    title: "Perjalanan Digital Aisyah",
    quote: "Sekarang saya bisa belajar coding dan mengajar teman-teman di pesantren.",
    quoteAuthor: "Aisyah, santri di Pesantren Al-Hadianto",
    fullStory: `Aisyah Nurjanah adalah santri kelas XI di Pesantren Al-Hadianto, Tasikmalaya. Sebelum program digitalisasi pesantren dimulai, akses teknologi di pesantren sangat terbatas.

Melalui program Waqf Digital Pesantren yang didanai dari hasil investasi Bapak Hadianto, pesantren kini memiliki laboratorium komputer dengan 20 unit dan koneksi internet.

**Laporan Perkembangan (Februari 2026):**
- Kemampuan Coding: Python dasar & web design
- Nilai Akademis: Naik 30% sejak program dimulai
- Mengajar: Melatih 10 santri lain dalam literasi digital
- Rencana: Ingin membuat aplikasi untuk pesantren se-Indonesia

Aisyah kini menjadi mentor digital bagi santri-santri lain. Ia mengajarkan dasar-dasar pemrograman dan desain web setiap hari Sabtu di laboratorium komputer pesantren.

*"Dulu saya pikir santri hanya belajar kitab kuning. Sekarang kami buktikan santri juga bisa menguasai teknologi."* — Aisyah

**Dampak Waqf Anda:** Kontribusi Waqf Bapak sebesar $40 (Rp 640.000) per tahun untuk pendidikan Aisyah. Investasi ini akan terus mengalir selamanya melalui mekanisme Waqf.`,
    stats: {
      digitalSkills: "Advanced",
      studentsTrainedByHer: 10,
      academicImprovement: "30%",
      yourContribution: 40
    }
  },
  {
    id: "ibu-sri",
    name: "Ibu Sri Wahyuni",
    age: 38,
    projectId: "LIV-IDN-2",
    category: "Livelihood",
    location: "Padang",
    country: "Indonesia",
    emoji: "👩🏽‍🍳",
    gradientLight: "from-orange-100 to-yellow-100",
    gradientDark: "from-orange-900/30 to-yellow-900/30",
    tagColorLight: "bg-orange-100 text-orange-700",
    tagColorDark: "bg-orange-900/50 text-orange-400",
    title: "Koperasi Rendang Ibu Sri",
    quote: "Dari modal Rp 5 juta, sekarang omzet koperasi kami Rp 25 juta per bulan.",
    quoteAuthor: "Pengali pendapatan: 5x",
    fullStory: `Ibu Sri Wahyuni adalah seorang janda dengan 3 anak di Padang, Sumatera Barat. Sebelum bergabung dengan Koperasi UMKM Syariah, beliau menjual rendang dengan modal seadanya.

Melalui program pembiayaan syariah tanpa riba dari GIFR, Ibu Sri menerima modal usaha Rp 5.000.000 dengan akad Qardh Hasan.

**Perkembangan (Februari 2026):**
- Bulan 1-2: Memperbesar produksi rendang, omzet Rp 8 juta/bulan
- Bulan 3-4: Merekrut 3 ibu rumah tangga sebagai karyawan
- Bulan 5-6: Mulai menerima pesanan catering, omzet Rp 25 juta/bulan

**Status Saat Ini:**
- Karyawan: 6 ibu rumah tangga
- Omzet Bulanan: Rp 25.000.000
- Pengali Pendapatan: 5x dari modal awal
- Produk: Rendang, gulai, dan catering syariah

*"Alhamdulillah, sekarang saya bisa menyekolahkan ketiga anak saya. Dan 6 ibu lainnya juga punya penghasilan tetap."* — Ibu Sri

**Dampak Waqf Anda:** Kontribusi Waqf Bapak sebesar $25 (Rp 400.000) untuk modal usaha Ibu Sri. Satu investasi telah menciptakan 7 mata pencaharian berkelanjutan.`,
    stats: {
      employees: 6,
      monthlyRevenue: "Rp 25 juta",
      incomeMultiplier: "5x",
      yourContribution: 25
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
  { name: 'Education', direct: 57, indirect: 126 },
  { name: 'Livelihood', direct: 32, indirect: 70 },
  { name: 'Waqf Produktif', direct: 0, indirect: 0 }
];

export const sdgList = [
  { icon: '🏠', name: 'SDG 1: No Poverty' },
  { icon: '📚', name: 'SDG 4: Quality Education' },
  { icon: '⚖️', name: 'SDG 5: Gender Equality' },
  { icon: '💼', name: 'SDG 8: Decent Work' },
  { icon: '🤝', name: 'SDG 10: Reduced Inequalities' },
  { icon: '🏘️', name: 'SDG 11: Sustainable Communities' }
];

export const complianceData = {
  international: {
    label: "Standar Internasional / International Standards",
    standards: [
      { name: "AAOIFI Sharia Standards (Standar Syariah AAOIFI)", status: "Tersertifikasi / Certified", icon: "✅" },
      { name: "KPMG Islamic Finance Audit (Audit Keuangan Syariah KPMG)", status: "Wajar Tanpa Pengecualian / Unqualified", icon: "✅" },
      { name: "ISO 27001 Data Security (Keamanan Data ISO 27001)", status: "Patuh / Compliant", icon: "✅" }
    ]
  },
  indonesia: {
    label: "Kepatuhan Indonesia / Indonesia Compliance (BWI/OJK)",
    standards: [
      { name: "UU No. 41 Tahun 2004 tentang Wakaf", status: "Patuh / Compliant", icon: "✅" },
      { name: "Badan Wakaf Indonesia (BWI) — Nazhir Terdaftar", status: "Terdaftar / Registered", icon: "✅" },
      { name: "Otoritas Jasa Keuangan (OJK) — Regulasi Syariah", status: "Berlisensi / Licensed", icon: "✅" },
      { name: "LKS-PWU (Lembaga Keuangan Syariah Penerima Wakaf Uang)", status: "Bermitra / Partnered", icon: "✅" },
      { name: "Pendaftaran Nazhir (Pengelola Wakaf)", status: "Aktif / Active", icon: "✅" }
    ]
  }
};
