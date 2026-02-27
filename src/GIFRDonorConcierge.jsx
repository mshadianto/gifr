import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Modular imports
import { ImpactSimulator, StoryDetail } from './components/modals';
import { donorData as defaultDonorData, beneficiaryStories, yieldHistoryData, beneficiaryChartData, sdgList, complianceData } from './data/donorData';
import { CHART_COLORS, TABS, MAP_CENTER, MAP_ZOOM, COUNTRIES, IDR_USD_RATE } from './constants';
import { useDarkMode } from './hooks/useDarkMode';
import { formatCurrency, formatProjectCurrency } from './utils/impactCalculator';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// GIFR Donor Concierge - Islamic Philanthropy Dashboard
// Design: Refined Luxury meets Sacred Geometry - Gold, Deep Emerald, Warm Neutrals

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const GIFRDonorConcierge = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showNotification, setShowNotification] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const chatEndRef = useRef(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isExporting, setIsExporting] = useState(false);
  const dashboardRef = useRef(null);

  // Modal states
  const [showImpactSimulator, setShowImpactSimulator] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [countryFilter, setCountryFilter] = useState('all');

  // Use imported data
  const donorData = defaultDonorData;

  // Filtered data by country
  const filteredProjects = countryFilter === 'all'
    ? donorData.projects
    : donorData.projects.filter(p => p.country === countryFilter);
  const filteredStories = countryFilter === 'all'
    ? beneficiaryStories
    : beneficiaryStories.filter(s => s.country === countryFilter);

  // Chart data derived from donor data
  const portfolioChartData = donorData.portfolio.map(item => ({
    name: item.name.split(' ')[0],
    value: item.allocation,
    fullName: item.name
  }));

  // Get project locations from projects
  const projectLocations = donorData.projects.map(p => ({
    id: p.id,
    name: p.name,
    lat: p.lat,
    lng: p.lng,
    location: p.location
  }));

  // PDF Export function
  const exportToPDF = async () => {
    if (!dashboardRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: darkMode ? '#1c1917' : '#fafaf9'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      pdf.addImage(imgData, 'PNG', imgX, 10, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`GIFR-Impact-Report-${donorData.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
    }

    setIsExporting(false);
  };

  const initialMessages = [
    {
      id: 1,
      sender: 'agent',
      name: 'Aminah',
      avatar: '🌙',
      time: '08:30',
      content: `Assalamu'alaikum Pak MS,

I hope this message finds you in the best of health and iman. I have news that will bring warmth to your heart.

Our field coordinator just visited the **Hadianto Learning Center** in Kutupalong Camp. Twelve children sit in the classroom your Waqf built — among them, Fatima Begum, age 9, who now reads at Grade 2 level.

Her mother Rahima said: *"For the first time since fleeing Myanmar, my daughter dreams of becoming a teacher."*

This is the perpetual dividend of your Waqf. 💚`,
      hasMedia: true,
      mediaType: 'impact'
    }
  ];

  useEffect(() => {
    setChatMessages(initialMessages);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // System prompt for Groq AI
  const getSystemPrompt = () => `You are Aminah, the AI Concierge for GIFR (Global Islamic Fund for Refugees). You assist donors with information about their Waqf investments and impact.

IMPORTANT RULES:
- Always respond in the same language as the user's message (Indonesian or English)
- Be warm, professional, and use Islamic greetings when appropriate
- Use markdown formatting for structure (bold, lists, etc.)
- Never invent data - only use the donor data provided below
- Keep responses concise but informative
- End responses with a helpful follow-up question or offer

DONOR DATA:
- Name: ${donorData.name}
- Waqf Principal: $${donorData.waqfPrincipal.toLocaleString()} (perpetual endowment, never spent)
- Net Yield 2025: $${donorData.netYield2025.toLocaleString()}
- Yield-to-Impact Rate: ${donorData.yieldToImpact}% (94% reaches beneficiaries)
- Total Direct Beneficiaries: ${donorData.totalBeneficiaries}
- Indirect Beneficiaries: ${donorData.indirectBeneficiaries}
- Barakah Score: ${donorData.barakahScore}/10 (Exceptional - top 5%)

PORTFOLIO:
1. IDB Sovereign Sukuk - $75,000 (Ijarah structure, 5.2% yield, AAOIFI certified)
2. GIFR Infrastructure Sukuk - $50,000 (Musharakah structure, 6.8% yield, AAOIFI certified)
- Combined weighted yield: 5.84%
- Auditor: KPMG Islamic Finance
- Audit Report: KPMG-GIFR-2025-Q4-FINAL (Unqualified/Clean opinion)

FEE STRUCTURE:
- Gross Yield: $7,350
- Management Fee (5%): $367.50
- Sharia Audit Fee (1%): $73.50
- Net to Impact: $6,909 (94%)

PROJECTS:
1. Hadianto Learning Center (Cox's Bazar, Bangladesh)
   - Status: OPERATIONAL
   - Allocated: $4,145.40
   - Beneficiaries: 12 Rohingya children
   - Progress: 100%
   - Key beneficiary: Fatima Begum, age 9, now reads at Grade 2 level
   - Mother's quote: "For the first time since fleeing Myanmar, my daughter dreams of becoming a teacher."

2. Syrian Women's Tailoring Cooperative (Gaziantep, Türkiye)
   - Status: SCALING
   - Allocated: $2,763.60
   - Beneficiaries: 8 Syrian refugee women
   - Progress: 75%
   - Lead: Mariam, now employs 3 other women
   - Income multiplier: 5.14x

3. Pesantren Al-Hadianto Digital (Tasikmalaya, Jawa Barat, Indonesia)
   - Status: OPERATIONAL
   - Allocated: $1,800 (Rp 28.800.000)
   - Beneficiaries: 45 santri
   - Progress: 85%
   - Key beneficiary: Aisyah Nurjanah, 16, now learning coding
   - Program: Digital literacy for pesantren students

4. Koperasi UMKM Syariah Perempuan (Padang, Sumatera Barat, Indonesia)
   - Status: SCALING
   - Allocated: $1,200 (Rp 19.200.000)
   - Beneficiaries: 24 women entrepreneurs
   - Progress: 60%
   - Lead: Ibu Sri Wahyuni, rendang business with 6 employees
   - Income multiplier: 5x

5. Masjid Produktif Al-Falah (Yogyakarta, Indonesia)
   - Status: PLANNING
   - Allocated: $900 (Rp 14.400.000)
   - Progress: 25%
   - Program: Community economic hub using productive waqf (waqf produktif)

INDONESIA COMPLIANCE:
- Compliant with UU No. 41 Tahun 2004 tentang Wakaf
- Registered Nazhir under Badan Wakaf Indonesia (BWI)
- Partnered with LKS-PWU (Lembaga Keuangan Syariah Penerima Wakaf Uang)
- Licensed under OJK (Otoritas Jasa Keuangan) Sharia regulations
- AAOIFI international standards also apply

SDG ALIGNMENT: SDG 1 (No Poverty), SDG 4 (Education), SDG 5 (Gender Equality), SDG 8 (Decent Work), SDG 10 (Reduced Inequalities), SDG 11 (Sustainable Communities)

LANGUAGE RULES:
- If the user writes in Indonesian (Bahasa Indonesia), respond in Indonesian
- If the user writes in English, respond in English
- Use Indonesian currency format (Rp) when discussing Indonesian projects
- Use USD when discussing international/non-Indonesian projects

For investment simulations, use 5.8% yield and 94% net-to-impact rate.`;

  // Call Groq API
  const callGroqAPI = async (userMessage) => {
    if (!GROQ_API_KEY) {
      return null; // Fall back to keyword responses
    }

    const newHistory = [...conversationHistory, { role: 'user', content: userMessage }];

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: getSystemPrompt() },
            ...newHistory
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        console.error('Groq API error:', response.status);
        return null;
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content;

      if (assistantMessage) {
        setConversationHistory([...newHistory, { role: 'assistant', content: assistantMessage }]);
        return assistantMessage;
      }
      return null;
    } catch (error) {
      console.error('Groq API error:', error);
      return null;
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      name: 'Pak MS',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      content: message
    };

    setChatMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Try Groq API first
    const groqResponse = await callGroqAPI(message);

    if (groqResponse) {
      setIsTyping(false);
      const response = {
        id: chatMessages.length + 2,
        sender: 'agent',
        name: 'Aminah',
        avatar: '🌙',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        content: groqResponse
      };
      setChatMessages(prev => [...prev, response]);
      return;
    }

    // Fallback to keyword-based responses if Groq fails
    setTimeout(() => {
      setIsTyping(false);
      const msg = message.toLowerCase();

      const createResponse = (content, extras = {}) => ({
        id: chatMessages.length + 2,
        sender: 'agent',
        name: 'Aminah',
        avatar: '🌙',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        content,
        ...extras
      });

      let response;

      // Greetings
      if (msg.match(/^(hi|hello|halo|assalam|salam|hey)/)) {
        response = createResponse(`Wa'alaikumussalam warahmatullahi wabarakatuh, Pak MS! 🌙

Alhamdulillah, it's wonderful to hear from you. I'm Aminah, your GIFR Concierge.

Your Waqf is performing beautifully — **$6,909** net impact deployed in 2025, touching **20 lives** directly.

How may I assist you today?`);
      }
      // Thank you
      else if (msg.match(/(thank|terima kasih|jazak|syukr)/)) {
        response = createResponse(`Wa iyyakum, Pak MS. It is an honor to serve you. 🤲

Your generosity is the seed; we are merely the gardeners. The true reward awaits with Allah SWT.

Is there anything else I can help you with?`);
      }
      // Corruption/transparency/fee questions
      else if (msg.match(/(corrupt|korupsi|transparan|transparency|fee|biaya|overhead|admin|where.*money|kemana.*uang)/)) {
        response = createResponse(`Thank you for this important question, Pak MS. Transparency is our foundation.

**Your Waqf: $125,000**
├─ Gross Yield 2025: $7,350
├─ Management Fee (5%): $367.50
├─ Sharia Audit Fee (1%): $73.50
└─ **Net Deployed: $6,909 (94%)**

✅ Audited by: KPMG Islamic Finance
✅ Report: KPMG-GIFR-2025-Q4-FINAL
✅ Opinion: Unqualified (Clean)

Every dollar is traceable on-chain. Would you like the full audit report PDF?`, { hasAudit: true });
      }
      // Audit report request
      else if (msg.match(/(audit|report|laporan|kpmg|pdf|document)/)) {
        response = createResponse(`Here is your audit documentation, Pak MS:

📋 **Latest Audit Report**
├─ Auditor: KPMG Islamic Finance
├─ Report ID: KPMG-GIFR-2025-Q4-FINAL
├─ Period: Q4 2025
├─ Opinion: Unqualified (Clean) ✅
└─ Sharia Compliance: Certified

The report covers:
• Fund flow verification
• Sukuk portfolio compliance
• Impact fund deployment
• Beneficiary verification

Click below to download the complete PDF.`, { hasAudit: true });
      }
      // Reinvestment/add funds
      else if (msg.match(/(10k|10,000|tambah|add|reinvest|invest more|top.?up|\$\d+)/)) {
        const amount = msg.match(/\$?([\d,]+)k?/);
        const investAmount = amount ? parseInt(amount[1].replace(',', '')) * (msg.includes('k') ? 1000 : 1) : 10000;
        const grossYield = investAmount * 0.058;
        const netYield = grossYield * 0.94;

        response = createResponse(`Here's the exact math for a $${investAmount.toLocaleString()} addition:

**Projection @ 5.8% Yield:**
├─ Annual Gross: $${grossYield.toFixed(0)}
├─ After 6% Overhead: $${netYield.toFixed(2)}
└─ **Net Impact/Year: $${netYield.toFixed(0)}**

**What This Creates:**
• ${Math.floor(netYield / 500)} additional child(ren) educated fully
• ${Math.floor(netYield / 350)} partial livelihood packages

**10-Year Perpetual Effect:**
Year 1: ${Math.floor(netYield / 400)}-${Math.ceil(netYield / 350)} beneficiaries
Year 5: ${Math.floor(netYield / 100)}-${Math.ceil(netYield / 80)} beneficiaries
Year 10: ${Math.floor(netYield / 50)}-${Math.ceil(netYield / 40)} beneficiaries

This is sadaqah jariyah — a river that flows as long as the earth turns. 🌊`, { hasSimulation: true });
      }
      // Portfolio/Sukuk questions
      else if (msg.match(/(portfolio|sukuk|invest|saham|yield|return|performa|perform)/)) {
        response = createResponse(`Here's your portfolio overview, Pak MS:

📊 **Sukuk Portfolio ($125,000)**

**1. IDB Sovereign Sukuk** — $75,000
├─ Structure: Ijarah
├─ Yield: 5.2% p.a.
└─ Status: ✅ AAOIFI Certified

**2. GIFR Infrastructure Sukuk** — $50,000
├─ Structure: Musharakah
├─ Yield: 6.8% p.a.
└─ Status: ✅ AAOIFI Certified

**Combined Performance:**
├─ Weighted Avg Yield: 5.84%
├─ 2025 Gross Return: $7,350
└─ Risk Rating: Low-Medium

All instruments undergo quarterly Sharia review by KPMG.`);
      }
      // Fatima/specific beneficiary
      else if (msg.match(/(fatima|fatimah|anak|child|student|murid|girl)/)) {
        response = createResponse(`Let me share Fatima's latest update, Pak MS. 💚

**Fatima Begum, Age 9**
📍 Hadianto Learning Center, Cox's Bazar

**Progress Report (Jan 2026):**
├─ Reading Level: Grade 2 ✅ (was Grade 0)
├─ Math Skills: Basic arithmetic mastered
├─ Attendance: 94%
└─ Health: Good (received nutrition support)

Her mother Rahima said: *"For the first time since fleeing Myanmar, my daughter dreams of becoming a teacher."*

Fatima is one of 12 children directly supported by your Waqf at this center. Would you like to see photos from her classroom?`, { hasMedia: true });
      }
      // Project updates/field reports
      else if (msg.match(/(project|proyek|update|field|lapangan|progress|perkembangan|latest|terbaru)/)) {
        response = createResponse(`Here are your latest project updates, Pak MS:

🏫 **Hadianto Learning Center** (Cox's Bazar)
├─ Status: OPERATIONAL ✅
├─ Allocated: $4,145.40
├─ Beneficiaries: 12 children
├─ Progress: 100%
└─ Last Update: 8 Jan 2026
*"All 12 students now reading at grade level"*

🧵 **Syrian Women's Tailoring Cooperative** (Gaziantep)
├─ Status: SCALING 📈
├─ Allocated: $2,763.60
├─ Beneficiaries: 8 women
├─ Progress: 75%
└─ Last Update: 22 Dec 2025
*"3 women now employed as trainers"*

Would you like detailed reports from either project?`);
      }
      // Livelihood/tailoring/Syria
      else if (msg.match(/(livelihood|tailor|jahit|syria|suriah|women|wanita|mariam|cooperative|koperasi)/)) {
        response = createResponse(`Here's the latest from the Syrian Women's Tailoring Cooperative:

🧵 **Project Details**
├─ Location: Gaziantep, Türkiye
├─ Your Allocation: $2,763.60
├─ Beneficiaries: 8 Syrian refugee women
└─ Status: SCALING 📈

**Impact Highlights:**
• Mariam (lead beneficiary) now employs 3 other women
• Income multiplier: 5.14x
• Average monthly income: $380/woman
• Products sold to local markets

**Sustainability Score:** 8.5/10
The cooperative is on track to be self-sustaining by Q3 2026.

This is the multiplier effect of your Waqf — one investment creating many livelihoods. 🌱`);
      }
      // Barakah score
      else if (msg.match(/(barakah|score|skor|rating|nilai|impact.*score)/)) {
        response = createResponse(`Your Barakah Score explained, Pak MS:

✨ **Barakah Score: 9.2/10** (Exceptional)

**Scoring Components:**
├─ Impact Efficiency: 9.5/10
│   └─ 94% of yield reaches beneficiaries
├─ Beneficiary Reach: 9.0/10
│   └─ 20 direct + 44 indirect lives
├─ Sustainability: 9.0/10
│   └─ Projects trending self-sufficient
├─ Sharia Compliance: 10/10
│   └─ Full AAOIFI certification
└─ Transparency: 9.0/10
    └─ Complete audit trail

**Benchmark:** Average GIFR donor scores 7.8/10

Your Waqf is in the top 5% of impact efficiency. MasyaAllah! 🌟`);
      }
      // SDG/UN goals
      else if (msg.match(/(sdg|sustainable|un |united nation|goal|tujuan)/)) {
        response = createResponse(`Your Waqf aligns with these UN Sustainable Development Goals:

🎯 **SDG Alignment**

**SDG 4: Quality Education** ✅
└─ 12 refugee children in school

**SDG 5: Gender Equality** ✅
└─ 8 women economically empowered

**SDG 8: Decent Work** ✅
└─ Sustainable livelihood programs

**SDG 10: Reduced Inequalities** ✅
└─ Supporting displaced populations

Your impact contributes to global humanitarian goals while fulfilling the Islamic principles of Waqf and sadaqah jariyah.`);
      }
      // Education/Cox's Bazar/Learning Center
      else if (msg.match(/(education|pendidikan|school|sekolah|cox|bangladesh|learning center|hadianto)/)) {
        response = createResponse(`Here's the Hadianto Learning Center update:

🏫 **Hadianto Learning Center**
├─ Location: Kutupalong Camp, Cox's Bazar
├─ Your Allocation: $4,145.40
├─ Beneficiaries: 12 Rohingya children
└─ Status: OPERATIONAL ✅

**Facilities:**
• 2 classrooms (built with your Waqf)
• 1 library corner
• Learning materials for 20 students

**Educational Outcomes:**
├─ Literacy Rate: 100% (was 25%)
├─ Numeracy Rate: 92%
└─ Attendance: 94% average

Named in honor of the Hadianto family's commitment to refugee education. The center will serve children perpetually through your Waqf endowment. 📚`);
      }
      // How does Waqf work
      else if (msg.match(/(how.*work|bagaimana|cara kerja|what.*waqf|apa.*waqf|explain)/)) {
        response = createResponse(`Let me explain how your Waqf works, Pak MS:

📖 **The Waqf Model**

**1. Your Endowment**
└─ $125,000 principal (never spent)

**2. Investment**
└─ Placed in Sharia-compliant Sukuk

**3. Yield Generation**
└─ ~5.8% annual return = $7,350

**4. Deployment**
├─ 6% overhead (management + audit)
└─ 94% to impact = $6,909

**5. Perpetual Impact**
└─ Repeats every year, forever

Unlike regular charity, your principal remains intact. Only the yield is deployed — creating **sadaqah jariyah** (continuous charity) that benefits you in this life and the hereafter.

*"When a person dies, their deeds end except for three: continuous charity, beneficial knowledge, or a righteous child who prays for them."* — Sahih Muslim`);
      }
      // Indonesia projects
      else if (msg.match(/(indonesia|pesantren|umkm|masjid produktif|java|jawa|sumatra|sumatera|yogya|tasik|padang)/)) {
        response = createResponse(`Here are your Indonesian project updates, Pak MS:

🕌 **Pesantren Al-Hadianto Digital** (Tasikmalaya)
├─ Status: OPERATIONAL ✅
├─ Allocated: Rp 28.800.000
├─ Beneficiaries: 45 santri
├─ Progress: 85%
└─ Highlights: Digital literacy program — Aisyah (16) now teaches coding to 10 peers

🧕 **Koperasi UMKM Syariah Perempuan** (Padang)
├─ Status: SCALING 📈
├─ Allocated: Rp 19.200.000
├─ Beneficiaries: 24 women entrepreneurs
├─ Progress: 60%
└─ Highlights: Ibu Sri's rendang cooperative employs 6 women, omzet Rp 25 juta/bulan

🏗️ **Masjid Produktif Al-Falah** (Yogyakarta)
├─ Status: PLANNING 📋
├─ Allocated: Rp 14.400.000
├─ Progress: 25%
└─ Concept: Community economic hub through waqf produktif

All projects comply with BWI regulations and UU 41/2004 tentang Wakaf. 🇮🇩

Would you like to hear more about any specific project?`);
      }
      // Compliance / BWI / OJK
      else if (msg.match(/(compliance|bwi|ojk|uu 41|uu.*wakaf|nazhir|lks-?pwu|regulasi|regulation)/)) {
        response = createResponse(`Your Waqf compliance overview, Pak MS:

🌍 **International Standards:**
├─ AAOIFI Sharia Standards: ✅ Certified
├─ KPMG Islamic Finance Audit: ✅ Clean Opinion
└─ ISO 27001 Data Security: ✅ Compliant

🇮🇩 **Indonesia Compliance:**
├─ UU No. 41/2004 tentang Wakaf: ✅ Compliant
├─ BWI (Badan Wakaf Indonesia): ✅ Registered Nazhir
├─ OJK Sharia Regulation: ✅ Licensed
├─ LKS-PWU: ✅ Partnered
└─ Nazhir Registration: ✅ Active

Your Waqf meets both international AAOIFI standards and Indonesian BWI/OJK requirements. Would you like to see the full audit report?`);
      }
      // Default response
      else {
        response = createResponse(`Thank you for your message, Pak MS. I'm here to help you explore your Waqf impact.

I can assist you with:
• 📊 **Portfolio** — "How is my sukuk performing?"
• 🏫 **Projects** — "Show me project updates"
• 🇮🇩 **Indonesia** — "Show me Indonesia projects"
• 💰 **Transparency** — "Where does my money go?"
• 📈 **Simulation** — "What if I add $10,000?"
• 👧 **Beneficiaries** — "Tell me about Fatima"
• 📋 **Compliance** — "Show BWI/OJK compliance"
• ✨ **Barakah** — "Explain my Barakah score"

What would you like to know? 🤲`);
      }

      setChatMessages(prev => [...prev, response]);
    }, 2000);
  };

  // Geometric Islamic Pattern SVG
  const IslamicPattern = () => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 100 100">
      <defs>
        <pattern id="islamicPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          <circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="0.3"/>
          <path d="M10 0 L10 7 M10 13 L10 20 M0 10 L7 10 M13 10 L20 10" stroke="currentColor" strokeWidth="0.2"/>
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#islamicPattern)"/>
    </svg>
  );

  // Stats Card Component
  const StatCard = ({ icon, label, value, subvalue, color, delay, trend }) => (
    <div
      className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-sm border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,248,245,0.9) 100%)',
        borderColor: 'rgba(212,175,55,0.2)',
        animationDelay: `${delay}ms`
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <svg viewBox="0 0 100 100">
          <polygon points="50,0 100,50 50,100 0,50" fill={color}/>
        </svg>
      </div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-stone-500 tracking-wide uppercase">{label}</p>
          <p className="mt-2 text-3xl font-light text-stone-800" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{value}</p>
          {subvalue && <p className="mt-1 text-sm text-emerald-600 font-medium">{subvalue}</p>}
          {trend && (
            <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${
              trend.direction === 'up' ? 'text-emerald-600' : trend.direction === 'down' ? 'text-red-500' : 'text-stone-500'
            }`}>
              <span>{trend.direction === 'up' ? '▲' : trend.direction === 'down' ? '▼' : '●'}</span>
              <span>{trend.direction === 'up' ? `+${trend.percent}%` : trend.direction === 'stable' ? '' : `-${trend.percent}%`} {trend.label}</span>
            </div>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  // Project Card Component
  const ProjectCard = ({ project, onClick }) => (
    <div 
      onClick={() => onClick(project)}
      className="relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-500 hover:scale-[1.02] group"
      style={{
        background: 'linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%)',
        border: '1px solid rgba(212,175,55,0.15)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
      
      <div className="flex items-start gap-4">
        <div className="text-4xl">{project.image}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-stone-800">{project.name}</h3>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              project.status === 'OPERATIONAL' ? 'bg-emerald-100 text-emerald-700'
                : project.status === 'SCALING' ? 'bg-amber-100 text-amber-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {project.status}
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            📍 {project.location}
            {project.country === 'Indonesia' && ' 🇮🇩'}
            {project.country === 'Bangladesh' && ' 🇧🇩'}
            {project.country === 'Turkey' && ' 🇹🇷'}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wide">Allocated</p>
              <p className="text-lg font-semibold text-stone-700">{formatProjectCurrency(project)}</p>
            </div>
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wide">Beneficiaries</p>
              <p className="text-lg font-semibold text-emerald-600">{project.beneficiaries} lives</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-xs text-stone-500 mb-1">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000"
                style={{ 
                  width: `${project.progress}%`,
                  background: 'linear-gradient(90deg, #10b981, #d4af37)'
                }}
              />
            </div>
          </div>
          
          <p className="text-xs text-stone-400 mt-3">Last update: {project.lastUpdate}</p>
        </div>
      </div>
    </div>
  );

  // Chat Message Component
  const ChatMessage = ({ message }) => (
    <div className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''} animate-fadeIn`}>
      {message.sender === 'agent' && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-lg shadow-lg">
          {message.avatar}
        </div>
      )}
      <div className={`max-w-[80%] ${message.sender === 'user' ? 'ml-auto' : ''}`}>
        <div 
          className={`rounded-2xl p-4 ${
            message.sender === 'user' 
              ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-tr-sm' 
              : 'bg-white border border-stone-200 rounded-tl-sm shadow-sm'
          }`}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          
          {message.hasMedia && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-emerald-50 border border-amber-200/50">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-2xl">
                  📸
                </div>
                <div>
                  <p className="font-medium text-stone-700 text-sm">Fatima reading from her textbook</p>
                  <p className="text-xs text-stone-500">Hadianto Learning Center • Verified</p>
                  <button className="mt-1 text-xs text-emerald-600 font-medium hover:underline">
                    View full gallery →
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {message.hasAudit && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">✅</span>
                <span className="text-sm font-medium text-emerald-700">Audit Report Available</span>
              </div>
              <button className="mt-2 w-full py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                Download KPMG Report PDF
              </button>
            </div>
          )}
          
          {message.hasSimulation && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <span className="text-sm font-medium text-amber-700">Impact Simulation Ready</span>
              </div>
              <button className="mt-2 w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-amber-700 transition-colors">
                Proceed with $10K Reinvestment
              </button>
            </div>
          )}
        </div>
        <p className={`text-xs text-stone-400 mt-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
          {message.time}
        </p>
      </div>
    </div>
  );

  // Quick Action Pills
  const QuickActions = ({ onSelect }) => {
    const actions = [
      "How do I know there's no corruption?",
      "If I add $10k, what happens?",
      "Show me Indonesia projects",
      "Show me the audit report",
      "Latest field updates"
    ];
    
    return (
      <div className="flex flex-wrap gap-2 p-4 border-t border-stone-100">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => onSelect(action)}
            className="px-4 py-2 text-sm bg-stone-100 hover:bg-emerald-100 hover:text-emerald-700 rounded-full transition-all duration-300 text-stone-600"
          >
            {action}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-stone-900' : 'bg-gradient-to-br from-stone-50 via-amber-50/30 to-emerald-50/20'}`} style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Add Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
        }

        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideIn { animation: slideIn 0.5s ease-out; }
        .animate-pulse-gold { animation: pulse-gold 2s infinite; }

        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 4px; }

        .dark-card { background: linear-gradient(135deg, rgba(41,37,36,0.95) 0%, rgba(28,25,23,0.9) 100%); }
        .light-card { background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,248,245,0.9) 100%); }
      `}</style>

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${darkMode ? 'bg-stone-900/80 border-stone-700' : 'bg-white/80 border-amber-100'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🌙</span>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                  <span className="text-[8px]">✓</span>
                </div>
              </div>
              <div>
                <h1 className={`text-xl font-semibold ${darkMode ? 'text-stone-100' : 'text-stone-800'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  GIFR Donor Concierge
                </h1>
                <p className={`text-xs ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>Global Islamic Fund for Refugees</p>
              </div>
            </div>

            {/* Donor Info */}
            <div className="flex items-center gap-4">
              {/* PDF Export Button */}
              <button
                onClick={exportToPDF}
                disabled={isExporting}
                className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-stone-700 text-stone-300 hover:bg-stone-600' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'} ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Export PDF"
              >
                <span className="text-xl">{isExporting ? '⏳' : '📄'}</span>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-amber-500 text-stone-900 hover:bg-amber-400' : 'bg-stone-800 text-amber-400 hover:bg-stone-700'}`}
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
              </button>

              {showNotification && (
                <div className="relative animate-pulse-gold">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-amber-100 text-amber-600 hover:bg-amber-200'}`}
                  >
                    <span className="text-xl">💬</span>
                  </button>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                    1
                  </span>
                </div>
              )}

              <div className={`flex items-center gap-3 pl-4 border-l ${darkMode ? 'border-stone-600' : 'border-stone-200'}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-600 to-stone-700 flex items-center justify-center text-white font-medium">
                  MH
                </div>
                <div className="text-right">
                  <p className={`font-medium text-sm ${darkMode ? 'text-stone-100' : 'text-stone-800'}`}>{donorData.name}</p>
                  <p className="text-xs text-emerald-500">Waqif since 2024</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex gap-1 mt-4 -mb-px">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'portfolio', label: 'Portfolio', icon: '💰' },
              { id: 'impact', label: 'Impact', icon: '🌍' },
              { id: 'chat', label: 'Aminah AI', icon: '🤖' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'chat') setShowNotification(false);
                }}
                className={`px-5 py-3 text-sm font-medium rounded-t-xl transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-700 border-t border-x border-amber-200 shadow-sm -mb-px'
                    : 'text-stone-500 hover:text-stone-700 hover:bg-white/50'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {tab.id === 'chat' && showNotification && (
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"/>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main ref={dashboardRef} className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 text-white">
              <IslamicPattern />
              <div className="relative z-10">
                <p className="text-emerald-200 text-sm">Assalamu'alaikum</p>
                <h2 className="text-3xl font-light mt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Welcome back, {donorData.name.split(' ')[1]}
                </h2>
                <p className="mt-4 text-emerald-100 max-w-xl leading-relaxed">
                  Your Waqf continues to generate perpetual blessings. In 2025, your contribution 
                  touched <span className="font-semibold text-amber-300">{donorData.totalBeneficiaries} lives directly</span> and 
                  created ripples reaching {donorData.indirectBeneficiaries} more.
                </p>
                {donorData.nextYieldDate && (
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-emerald-400/20">
                    <span className="text-amber-300 text-sm">📅</span>
                    <span className="text-sm text-emerald-100">
                      Next yield distribution: <span className="font-semibold text-amber-300">{new Date(donorData.nextYieldDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </span>
                  </div>
                )}
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="px-6 py-3 bg-white text-emerald-700 rounded-xl font-medium hover:bg-amber-50 transition-colors flex items-center gap-2"
                  >
                    <span>💬</span> Talk to Aminah
                  </button>
                  <button className="px-6 py-3 bg-emerald-600/50 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors border border-emerald-400/30">
                    View Full Report
                  </button>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                <svg viewBox="0 0 200 200">
                  <polygon points="100,0 200,100 100,200 0,100" fill="white" transform="rotate(45 100 100)"/>
                </svg>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon="💎"
                label="Waqf Principal"
                value={`$${donorData.waqfPrincipal.toLocaleString()}`}
                subvalue="Perpetual Endowment"
                color="#10b981"
                delay={0}
                trend={donorData.trendData?.waqfPrincipal}
              />
              <StatCard
                icon="📈"
                label="Net Yield 2025"
                value={`$${donorData.netYield2025.toLocaleString()}`}
                subvalue={`${donorData.yieldToImpact}% deployed to impact`}
                color="#d4af37"
                delay={100}
                trend={donorData.trendData?.netYield}
              />
              <StatCard
                icon="❤️"
                label="Lives Touched"
                value={donorData.totalBeneficiaries}
                subvalue={`+${donorData.indirectBeneficiaries} indirect`}
                color="#ef4444"
                delay={200}
                trend={donorData.trendData?.beneficiaries}
              />
              <StatCard
                icon="✨"
                label="Barakah Score"
                value={`${donorData.barakahScore}/10`}
                subvalue="Exceptional Impact"
                color="#8b5cf6"
                delay={300}
                trend={donorData.trendData?.barakahScore}
              />
            </div>

            {/* Barakah Score Breakdown */}
            {donorData.barakahBreakdown && (
              <div className={`rounded-3xl p-6 border shadow-sm ${darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-stone-100' : 'text-stone-800'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Barakah Score Breakdown
                    </h3>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>5-dimensional impact assessment</p>
                  </div>
                  <div className={`text-3xl font-light ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {donorData.barakahScore}/10
                  </div>
                </div>
                <div className="space-y-4">
                  {donorData.barakahBreakdown.map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${darkMode ? 'text-stone-200' : 'text-stone-700'}`}>{item.dimension}</span>
                        <span className={`text-sm font-semibold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{item.score}/10</span>
                      </div>
                      <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-stone-700' : 'bg-stone-100'}`}>
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${item.score * 10}%`,
                            background: item.score >= 9.5 ? 'linear-gradient(90deg, #10b981, #d4af37)' : item.score >= 9 ? '#10b981' : '#d4af37'
                          }}
                        />
                      </div>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-stone-800" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Your Impact Projects
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">Where your Waqf is making a difference across {donorData.projectCountries.length} countries</p>
                </div>
              </div>

              {/* Country Filter */}
              <div className="flex flex-wrap gap-2 mb-4">
                {COUNTRIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCountryFilter(c.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      countryFilter === c.id
                        ? 'bg-emerald-600 text-white'
                        : darkMode ? 'bg-stone-700 text-stone-300 hover:bg-stone-600' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={setSelectedProject}
                  />
                ))}
              </div>
            </div>

            {/* Reinvestment CTA */}
            <div className="relative overflow-hidden rounded-3xl p-8 border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-light text-stone-800" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Expand Your Barakah
                  </h3>
                  <p className="text-stone-600 mt-2 max-w-lg">
                    Adding $10,000 to your Waqf could educate 1 additional child every year, perpetually. 
                    Ask Aminah for a detailed impact simulation.
                  </p>
                </div>
                <button
                  onClick={() => setShowImpactSimulator(true)}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Calculate Impact
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pie Chart - Portfolio Allocation */}
              <div className={`rounded-3xl p-6 border shadow-sm ${darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-stone-100' : 'text-stone-800'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Portfolio Allocation
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={portfolioChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {portfolioChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart - Yield History */}
              <div className={`rounded-3xl p-6 border shadow-sm ${darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-stone-100' : 'text-stone-800'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Monthly Yield (6 months)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={yieldHistoryData}>
                    <XAxis dataKey="month" stroke={darkMode ? '#a8a29e' : '#78716c'} />
                    <YAxis stroke={darkMode ? '#a8a29e' : '#78716c'} />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Line type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Portfolio List */}
            <div className={`rounded-3xl overflow-hidden border shadow-sm ${darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
              <div className={`p-6 border-b ${darkMode ? 'border-stone-700' : 'border-stone-100'}`}>
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-stone-100' : 'text-stone-800'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Sukuk Portfolio Allocation
                </h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>AAOIFI Sharia-compliant | BWI/OJK Indonesia registered</p>
              </div>

              <div className={`divide-y ${darkMode ? 'divide-stone-700' : 'divide-stone-100'}`}>
                {donorData.portfolio.map((asset, i) => (
                  <div key={i} className={`p-6 transition-colors ${darkMode ? 'hover:bg-stone-700' : 'hover:bg-stone-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-emerald-900/50' : 'bg-gradient-to-br from-emerald-100 to-emerald-200'}`}>
                          <span className="text-xl">📜</span>
                        </div>
                        <div>
                          <h4 className={`font-medium ${darkMode ? 'text-stone-100' : 'text-stone-800'}`}>{asset.name}</h4>
                          <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>{asset.type} Structure • {asset.issuer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${darkMode ? 'text-stone-100' : 'text-stone-800'}`}>${asset.allocation.toLocaleString()}</p>
                        <p className="text-sm text-emerald-500">Yield: {asset.yield}% p.a.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                          ✓ Sharia Certified
                        </span>
                      </div>
                    </div>
                    {asset.creditRating && (
                      <div className={`mt-3 ml-16 grid grid-cols-2 md:grid-cols-4 gap-3`}>
                        <div>
                          <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>Credit Rating</p>
                          <p className={`text-sm font-medium ${darkMode ? 'text-stone-200' : 'text-stone-700'}`}>{asset.creditRating}</p>
                        </div>
                        <div>
                          <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>Risk Class</p>
                          <p className={`text-sm font-medium ${darkMode ? 'text-stone-200' : 'text-stone-700'}`}>{asset.riskClass}</p>
                        </div>
                        <div>
                          <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>Maturity</p>
                          <p className={`text-sm font-medium ${darkMode ? 'text-stone-200' : 'text-stone-700'}`}>{new Date(asset.maturityDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div>
                          <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>Coupon</p>
                          <p className={`text-sm font-medium ${darkMode ? 'text-stone-200' : 'text-stone-700'}`}>{asset.couponFrequency}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className={`p-6 border-t ${darkMode ? 'bg-stone-900/50 border-stone-700' : 'bg-stone-50 border-stone-100'}`}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>External Auditor</p>
                    <p className={`font-medium ${darkMode ? 'text-stone-100' : 'text-stone-800'}`}>KPMG Islamic Finance</p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>Audit Opinion</p>
                    <p className="font-medium text-emerald-500">Unqualified (Clean) ✓</p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>Report ID</p>
                    <p className={`font-medium ${darkMode ? 'text-stone-100' : 'text-stone-800'}`}>KPMG-GIFR-2025-Q4-FINAL</p>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                    Download Audit PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Fee Transparency */}
            <div className={`rounded-3xl p-6 border shadow-sm ${darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
              <h3 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-stone-100' : 'text-stone-800'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Fee Transparency Report
              </h3>

              <div className="space-y-4">
                <div className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-stone-700' : 'bg-stone-50'}`}>
                  <span className={darkMode ? 'text-stone-300' : 'text-stone-600'}>Gross Yield (2025)</span>
                  <span className={`font-semibold ${darkMode ? 'text-stone-100' : 'text-stone-800'}`}>$7,350.00</span>
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                  <span className={darkMode ? 'text-stone-300' : 'text-stone-600'}>Management Fee (5%)</span>
                  <span className="font-semibold text-red-500">- $367.50</span>
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                  <span className={darkMode ? 'text-stone-300' : 'text-stone-600'}>Sharia Audit Fee (1%)</span>
                  <span className="font-semibold text-red-500">- $73.50</span>
                </div>
                <div className={`h-px ${darkMode ? 'bg-stone-600' : 'bg-stone-200'}`}/>
                <div className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-emerald-900/30' : 'bg-emerald-50'}`}>
                  <span className={`font-medium ${darkMode ? 'text-stone-100' : 'text-stone-800'}`}>Net Distributable to Impact</span>
                  <span className="text-xl font-bold text-emerald-500">$6,909.00</span>
                </div>
                <div className="flex items-center justify-center p-4">
                  <div className={`px-4 py-2 rounded-full ${darkMode ? 'bg-gradient-to-r from-emerald-900/50 to-amber-900/50' : 'bg-gradient-to-r from-emerald-100 to-amber-100'}`}>
                    <span className={`text-sm font-medium ${darkMode ? 'text-stone-200' : 'text-stone-700'}`}>
                      Yield-to-Impact Conversion Rate: <span className="text-emerald-500 font-bold">94%</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Standards */}
            <div className={`rounded-3xl p-6 border shadow-sm ${darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
              <h3 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-stone-100' : 'text-stone-800'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Standar Kepatuhan / Compliance Standards
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                    🌍 {complianceData.international.label}
                  </h4>
                  <div className="space-y-2">
                    {complianceData.international.standards.map((s, i) => (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-stone-700' : 'bg-stone-50'}`}>
                        <span className={`text-sm ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>{s.name}</span>
                        <span className="text-sm text-emerald-500 font-medium">{s.icon} {s.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                    🇮🇩 {complianceData.indonesia.label}
                  </h4>
                  <div className="space-y-2">
                    {complianceData.indonesia.standards.map((s, i) => (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-stone-700' : 'bg-stone-50'}`}>
                        <span className={`text-sm ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>{s.name}</span>
                        <span className="text-sm text-emerald-500 font-medium">{s.icon} {s.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Impact Tab */}
        {activeTab === 'impact' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Country Filter */}
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCountryFilter(c.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    countryFilter === c.id
                      ? 'bg-emerald-600 text-white'
                      : darkMode ? 'bg-stone-700 text-stone-300 hover:bg-stone-600' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>

            {/* Interactive Map */}
            <div className={`rounded-3xl overflow-hidden border shadow-sm ${darkMode ? 'border-stone-700' : 'border-stone-200'}`}>
              <div className={`p-4 ${darkMode ? 'bg-stone-800' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-stone-100' : 'text-stone-800'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  🗺️ Impact Locations
                </h3>
                <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>Click markers to see project details</p>
              </div>
              <div className="h-80">
                <MapContainer
                  center={MAP_CENTER}
                  zoom={MAP_ZOOM}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {projectLocations.map((loc) => (
                    <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                      <Popup>
                        <div className="p-2">
                          <h4 className="font-semibold text-stone-800">{loc.name}</h4>
                          <p className="text-sm text-stone-600">{loc.location}</p>
                          <p className="text-xs text-emerald-600 mt-1">
                            {donorData.projects.find(p => p.id === loc.id)?.beneficiaries} beneficiaries
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

            {/* Beneficiary Chart */}
            <div className={`rounded-3xl p-6 border shadow-sm ${darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-stone-100' : 'text-stone-800'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Beneficiary Impact by Sector
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={beneficiaryChartData}>
                  <XAxis dataKey="name" stroke={darkMode ? '#a8a29e' : '#78716c'} />
                  <YAxis stroke={darkMode ? '#a8a29e' : '#78716c'} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="direct" name="Direct" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="indirect" name="Indirect" fill="#d4af37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Beneficiary Stories */}
            <div>
              <h3 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-stone-100' : 'text-stone-800'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Stories from the Field
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {filteredStories.map((story) => (
                  <div
                    key={story.id}
                    className={`rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition-all cursor-pointer ${darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}
                    onClick={() => setSelectedStory(story)}
                  >
                    <div className={`h-48 flex items-center justify-center bg-gradient-to-br ${darkMode ? story.gradientDark : story.gradientLight}`}>
                      <span className="text-8xl">{story.emoji}</span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? story.tagColorDark : story.tagColorLight}`}>{story.category}</span>
                        <span className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>{story.location}</span>
                      </div>
                      <h4 className={`font-semibold ${darkMode ? 'text-stone-100' : 'text-stone-800'}`}>{story.title}</h4>
                      <p className={`text-sm mt-2 leading-relaxed ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>
                        "{story.quote}"
                      </p>
                      <p className={`text-xs mt-3 ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>— {story.quoteAuthor}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedStory(story); }}
                        className="mt-4 text-sm text-emerald-500 font-medium hover:underline"
                      >
                        Read full story →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SDG Alignment */}
            <div className={`rounded-3xl p-6 border ${darkMode ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-stone-100' : 'text-stone-800'}`}>UN SDG Alignment</h3>
              <div className="flex flex-wrap gap-3">
                {sdgList.map((sdg, i) => (
                  <span key={i} className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm ${darkMode ? 'bg-stone-700 text-stone-200' : 'bg-white text-stone-700'}`}>
                    {sdg.icon} {sdg.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="animate-fadeIn">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-3xl bg-white border border-stone-200 shadow-lg overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                    🌙
                  </div>
                  <div>
                    <h3 className="font-semibold">Aminah</h3>
                    <p className="text-sm text-emerald-100">Your GIFR AI Concierge • Online</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
                    <span className="text-xs text-emerald-200">Sharia-Compliant AI</span>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-stone-50 to-white scrollbar-thin">
                  {chatMessages.map(message => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-lg">
                        🌙
                      </div>
                      <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-sm border border-stone-200 shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"/>
                          <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}/>
                          <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}/>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>

                {/* Quick Actions */}
                <QuickActions onSelect={(action) => handleSendMessage(action)} />

                {/* Input Area */}
                <div className="p-4 border-t border-stone-100 bg-white">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                      placeholder="Ask Aminah about your Waqf impact..."
                      className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                    <button
                      onClick={() => handleSendMessage(inputValue)}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg"
                    >
                      Send
                    </button>
                  </div>
                  <p className="text-xs text-stone-400 mt-2 text-center">
                    All financial figures are audited by KPMG Islamic Finance. Aminah never invents data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-stone-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center">
                <span className="text-lg">🌙</span>
              </div>
              <div>
                <p className="font-medium text-stone-800">Global Islamic Fund for Refugees</p>
                <p className="text-xs text-stone-500">Perpetual Impact Through Waqf</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500">
              <span>AAOIFI Compliant</span>
              <span>•</span>
              <span>BWI/OJK Registered</span>
              <span>•</span>
              <span>KPMG Audited</span>
              <span>•</span>
              <span>ISO 27001</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ImpactSimulator
        isOpen={showImpactSimulator}
        onClose={() => setShowImpactSimulator(false)}
        darkMode={darkMode}
        currentPrincipal={donorData.waqfPrincipal}
      />
      <StoryDetail
        isOpen={!!selectedStory}
        onClose={() => setSelectedStory(null)}
        story={selectedStory}
        darkMode={darkMode}
      />
    </div>
  );
};

export default GIFRDonorConcierge;
