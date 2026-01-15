import React, { useState, useEffect, useRef } from 'react';

// GIFR Donor Concierge - Islamic Philanthropy Dashboard
// Design: Refined Luxury meets Sacred Geometry - Gold, Deep Emerald, Warm Neutrals

const GIFRDonorConcierge = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showNotification, setShowNotification] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const chatEndRef = useRef(null);

  // Donor Data (from our schema)
  const donorData = {
    name: "Pak Sopian Hadianto",
    waqfPrincipal: 125000,
    netYield2025: 6909,
    yieldToImpact: 94,
    totalBeneficiaries: 20,
    indirectBeneficiaries: 44,
    barakahScore: 9.2,
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
        lastUpdate: "8 Jan 2026"
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
        lastUpdate: "22 Dec 2025"
      }
    ]
  };

  const initialMessages = [
    {
      id: 1,
      sender: 'agent',
      name: 'Aminah',
      avatar: '🌙',
      time: '08:30',
      content: `Assalamu'alaikum Pak Sopian,

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

  const handleSendMessage = (message) => {
    if (!message.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      name: 'Pak Sopian',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      content: message
    };

    setChatMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      let response = '';
      
      if (message.toLowerCase().includes('corruption') || message.toLowerCase().includes('admin') || message.toLowerCase().includes('fee')) {
        response = {
          id: chatMessages.length + 2,
          sender: 'agent',
          name: 'Aminah',
          avatar: '🌙',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          content: `Thank you for this important question, Pak Sopian. Let me show you the complete fund flow:

**Your Waqf: $125,000**
├─ Gross Yield 2025: $7,350
├─ Management Fee (5%): $367.50
├─ Sharia Audit Fee (1%): $73.50
└─ **Net Deployed: $6,909 (94%)**

✅ Audited by: KPMG Islamic Finance
✅ Report: KPMG-GIFR-2025-Q4-FINAL
✅ Opinion: Unqualified (Clean)

Every dollar is traceable. Would you like the full audit report PDF?`,
          hasAudit: true
        };
      } else if (message.toLowerCase().includes('10k') || message.toLowerCase().includes('add') || message.toLowerCase().includes('reinvest')) {
        response = {
          id: chatMessages.length + 2,
          sender: 'agent',
          name: 'Aminah',
          avatar: '🌙',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          content: `Here's the exact math for a $10,000 addition:

**Projection @ 5.8% Yield:**
├─ Annual Gross: $580
├─ After 6% Overhead: $545.20
└─ **Net Impact/Year: $545**

**What This Creates:**
• 1 additional child educated fully
• 1 partial livelihood package

**10-Year Perpetual Effect:**
Year 1: 1-2 beneficiaries
Year 5: 7-8 beneficiaries  
Year 10: 15-16 beneficiaries

This is sadaqah jariyah — a river that flows as long as the earth turns. 🌊`,
          hasSimulation: true
        };
      } else {
        response = {
          id: chatMessages.length + 2,
          sender: 'agent',
          name: 'Aminah',
          avatar: '🌙',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          content: `Thank you for your message, Pak Sopian. I'm here to help you explore the impact of your Waqf. 

Would you like to:
• See the latest field reports from your projects?
• Review your portfolio performance?
• Explore reinvestment scenarios?

Barakallahu fiik. 🤲`
        };
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
  const StatCard = ({ icon, label, value, subvalue, color, delay }) => (
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
              project.status === 'OPERATIONAL' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {project.status}
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">📍 {project.location}</p>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wide">Allocated</p>
              <p className="text-lg font-semibold text-stone-700">${project.allocated.toLocaleString()}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-emerald-50/20" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
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
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-amber-100">
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
                <h1 className="text-xl font-semibold text-stone-800" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  GIFR Donor Concierge
                </h1>
                <p className="text-xs text-stone-500">Global Islamic Fund for Refugees</p>
              </div>
            </div>
            
            {/* Donor Info */}
            <div className="flex items-center gap-6">
              {showNotification && (
                <div className="relative animate-pulse-gold">
                  <button 
                    onClick={() => setActiveTab('chat')}
                    className="p-2 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
                  >
                    <span className="text-xl">💬</span>
                  </button>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                    1
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-3 pl-6 border-l border-stone-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-600 to-stone-700 flex items-center justify-center text-white font-medium">
                  SH
                </div>
                <div className="text-right">
                  <p className="font-medium text-stone-800 text-sm">{donorData.name}</p>
                  <p className="text-xs text-emerald-600">Waqif since 2024</p>
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
      <main className="max-w-7xl mx-auto px-6 py-8">
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
                <div className="mt-6 flex gap-4">
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
              />
              <StatCard 
                icon="📈" 
                label="Net Yield 2025" 
                value={`$${donorData.netYield2025.toLocaleString()}`}
                subvalue={`${donorData.yieldToImpact}% deployed to impact`}
                color="#d4af37"
                delay={100}
              />
              <StatCard 
                icon="❤️" 
                label="Lives Touched" 
                value={donorData.totalBeneficiaries}
                subvalue={`+${donorData.indirectBeneficiaries} indirect`}
                color="#ef4444"
                delay={200}
              />
              <StatCard 
                icon="✨" 
                label="Barakah Score" 
                value={`${donorData.barakahScore}/10`}
                subvalue="Exceptional Impact"
                color="#8b5cf6"
                delay={300}
              />
            </div>

            {/* Projects Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-stone-800" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Your Impact Projects
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">Where your Waqf is making a difference</p>
                </div>
                <button className="text-sm text-emerald-600 font-medium hover:underline">
                  View all projects →
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {donorData.projects.map(project => (
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
                  onClick={() => {
                    setActiveTab('chat');
                    handleSendMessage("If I add $10k, what exactly happens?");
                  }}
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
            <div className="rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-stone-100">
                <h3 className="text-xl font-semibold text-stone-800" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Sukuk Portfolio Allocation
                </h3>
                <p className="text-sm text-stone-500 mt-1">All instruments are AAOIFI Sharia-compliant</p>
              </div>
              
              <div className="divide-y divide-stone-100">
                {donorData.portfolio.map((asset, i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                        <span className="text-xl">📜</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-stone-800">{asset.name}</h4>
                        <p className="text-sm text-stone-500">{asset.type} Structure</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-stone-800">${asset.allocation.toLocaleString()}</p>
                      <p className="text-sm text-emerald-600">Yield: {asset.yield}% p.a.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                        ✓ Sharia Certified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 bg-stone-50 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-stone-500">External Auditor</p>
                    <p className="font-medium text-stone-800">KPMG Islamic Finance</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Audit Opinion</p>
                    <p className="font-medium text-emerald-600">Unqualified (Clean) ✓</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Report ID</p>
                    <p className="font-medium text-stone-800">KPMG-GIFR-2025-Q4-FINAL</p>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                    Download Audit PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Fee Transparency */}
            <div className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-stone-800 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Fee Transparency Report
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50">
                  <span className="text-stone-600">Gross Yield (2025)</span>
                  <span className="font-semibold text-stone-800">$7,350.00</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-red-50">
                  <span className="text-stone-600">Management Fee (5%)</span>
                  <span className="font-semibold text-red-600">- $367.50</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-red-50">
                  <span className="text-stone-600">Sharia Audit Fee (1%)</span>
                  <span className="font-semibold text-red-600">- $73.50</span>
                </div>
                <div className="h-px bg-stone-200"/>
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50">
                  <span className="font-medium text-stone-800">Net Distributable to Impact</span>
                  <span className="text-xl font-bold text-emerald-600">$6,909.00</span>
                </div>
                <div className="flex items-center justify-center p-4">
                  <div className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-amber-100 rounded-full">
                    <span className="text-sm font-medium text-stone-700">
                      Yield-to-Impact Conversion Rate: <span className="text-emerald-700 font-bold">94%</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Impact Tab */}
        {activeTab === 'impact' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Impact Map Placeholder */}
            <div className="rounded-3xl overflow-hidden border border-stone-200 bg-white shadow-sm">
              <div className="h-64 bg-gradient-to-br from-emerald-100 via-blue-50 to-amber-100 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-20">
                  <IslamicPattern />
                </div>
                <div className="text-center z-10">
                  <div className="text-6xl mb-4">🗺️</div>
                  <p className="text-stone-600 font-medium">Interactive Impact Map</p>
                  <p className="text-sm text-stone-500 mt-1">Cox's Bazar • Gaziantep</p>
                </div>
                
                {/* Location Markers */}
                <div className="absolute top-1/3 left-1/3 animate-pulse">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-lg"/>
                </div>
                <div className="absolute top-1/2 right-1/3 animate-pulse" style={{ animationDelay: '0.5s' }}>
                  <div className="w-4 h-4 bg-amber-500 rounded-full shadow-lg"/>
                </div>
              </div>
            </div>

            {/* Beneficiary Stories */}
            <div>
              <h3 className="text-xl font-semibold text-stone-800 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Stories from the Field
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Story Card 1 */}
                <div className="rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-amber-100 to-emerald-100 flex items-center justify-center">
                    <span className="text-8xl">👧🏽</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">Education</span>
                      <span className="text-xs text-stone-400">Cox's Bazar</span>
                    </div>
                    <h4 className="font-semibold text-stone-800">Fatima's Journey</h4>
                    <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                      "For the first time since fleeing Myanmar, my daughter dreams of becoming a teacher."
                    </p>
                    <p className="text-xs text-stone-400 mt-3">— Rahima, mother of Fatima</p>
                    <button className="mt-4 text-sm text-emerald-600 font-medium hover:underline">
                      Read full story →
                    </button>
                  </div>
                </div>

                {/* Story Card 2 */}
                <div className="rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <span className="text-8xl">👩🏻‍🦱</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Livelihood</span>
                      <span className="text-xs text-stone-400">Gaziantep</span>
                    </div>
                    <h4 className="font-semibold text-stone-800">Mariam's Cooperative</h4>
                    <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                      From refugee to entrepreneur. Mariam now employs 3 other Syrian women in her tailoring business.
                    </p>
                    <p className="text-xs text-stone-400 mt-3">Income multiplier: 5.14x</p>
                    <button className="mt-4 text-sm text-emerald-600 font-medium hover:underline">
                      Read full story →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SDG Alignment */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-stone-800 mb-4">UN SDG Alignment</h3>
              <div className="flex flex-wrap gap-3">
                {['SDG 4: Quality Education', 'SDG 5: Gender Equality', 'SDG 8: Decent Work', 'SDG 10: Reduced Inequalities'].map((sdg, i) => (
                  <span key={i} className="px-4 py-2 bg-white rounded-full text-sm font-medium text-stone-700 shadow-sm">
                    {sdg}
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
            <div className="flex items-center gap-6 text-sm text-stone-500">
              <span>AAOIFI Compliant</span>
              <span>•</span>
              <span>KPMG Audited</span>
              <span>•</span>
              <span>ISO 27001</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GIFRDonorConcierge;
