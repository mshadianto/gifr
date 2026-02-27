# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GIFR Donor Concierge is a React dashboard for the Global Islamic Fund for Refugees. It provides donor transparency, Islamic finance compliance documentation, and an AI concierge interface. Built with Vite, React 18, and Tailwind CSS. Configured as a PWA via vite-plugin-pwa. Deployed to Cloudflare Pages at `gifr-donor-concierge.pages.dev`.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Build for production
npm run preview  # Preview production build
npx wrangler pages deploy dist --project-name gifr-donor-concierge  # Deploy to Cloudflare Pages
```

No test runner or linter is configured.

## Architecture

Single-page app with one main component (`src/GIFRDonorConcierge.jsx`, ~1,500 lines) containing all tab views, inline sub-components (StatCard, ProjectCard, ChatMessage, QuickActions, IslamicPattern), and core logic. Extracted modules handle specific concerns:

- `src/data/donorData.js` — Mock donor profile, portfolio, 5 projects across 3 countries (Bangladesh, Turkey, Indonesia), 4 beneficiary stories, chart data, SDG list, `complianceData` (international AAOIFI + Indonesia BWI/OJK)
- `src/constants/index.js` — Chart colors, Groq model config, financial rates (5.8% yield, 6% overhead, 94% net-to-impact), Indonesia cost constants (`PESANTREN_COST_PER_STUDENT`, `UMKM_COST_PER_PACKAGE`), `IDR_USD_RATE`, tab definitions, map defaults, `COUNTRIES` filter array
- `src/hooks/useDarkMode.js` — Dark mode toggle persisted to localStorage
- `src/utils/impactCalculator.js` — Waqf yield/impact projections (including pesantren/UMKM metrics), multi-currency formatting (`formatCurrency(amount, currency)` supports USD/IDR), `formatProjectCurrency` helper
- `src/components/modals/ImpactSimulator.jsx` — Investment simulator modal with projections chart and IDR equivalent display
- `src/components/modals/StoryDetail.jsx` — Beneficiary story detail modal with dual currency display for Indonesian stories

### Key Libraries

- **recharts** — PieChart, BarChart, LineChart for portfolio and impact visualizations
- **react-leaflet / leaflet** — Map showing project locations across 3 countries (requires Leaflet icon URL fix at top of main component)
- **html2canvas + jsPDF** — PDF export of the dashboard view
- **vite-plugin-pwa** — Service worker and manifest generation

### Multi-Country & Currency

Projects span Bangladesh, Turkey, and Indonesia. A `countryFilter` state drives filter pill buttons on Dashboard and Impact tabs. Indonesian projects use `currency: 'IDR'` and `allocatedLocal` fields — `formatProjectCurrency()` auto-detects which currency to display. The `formatCurrency(amount, currency = 'USD')` function is backward-compatible; all pre-existing call sites default to USD.

### AI Chat

The Chat tab uses the Groq API (LLaMA 3.3 70B) via `VITE_GROQ_API_KEY` env var. If the API key is missing or the call fails, it falls back to keyword-based responses defined inline in `handleSendMessage`. The system prompt includes all 5 project details, BWI/OJK compliance context, and bilingual language rules (English/Indonesian).

### Tab Views

1. **Dashboard** — Overview stats, country filter pills, project grid (3-col on large screens), yield history chart, beneficiary bar chart
2. **Portfolio** — Sukuk allocation pie chart, fee transparency breakdown, Compliance Standards card (AAOIFI international + BWI/OJK Indonesia)
3. **Impact** — Country filter pills, Leaflet map (centered at `[10, 85]` to span all 3 regions), beneficiary stories (open StoryDetail modal), Impact Simulator modal, UN SDG alignment (6 SDGs)
4. **Chat** — Aminah AI Concierge with quick action buttons (including "Show me Indonesia projects") and Groq-powered responses with Indonesia/compliance keyword handlers

### State Management

Local React state only (no Redux/Context). All state lives in the GIFRDonorConcierge component. Key additions: `countryFilter` drives `filteredProjects` and `filteredStories` derived arrays. Dark mode state is managed via the `useDarkMode` hook with localStorage persistence.

## Design System

- **Colors:** Emerald (primary), Amber/Gold (secondary), Stone neutrals. Dark mode uses stone-800/900 backgrounds.
- **Typography:** Cormorant Garamond (headers, set via inline style `fontFamily`), Inter (body). Loaded from Google Fonts in `index.html`.
- **Animations:** fadeIn, slideIn, pulse-gold keyframes defined in `src/index.css` with corresponding utility classes.

## Compliance & Islamic Finance Context

Dual compliance framework:
- **International:** AAOIFI Sharia Standards, KPMG Islamic Finance Audit, ISO 27001
- **Indonesia:** UU No. 41/2004 tentang Wakaf, BWI (Badan Wakaf Indonesia), OJK Sharia regulation, LKS-PWU partnership, Nazhir registration

Fee structure: 5% management + 1% audit = 6% overhead. Financial constants are centralized in `src/constants/index.js`.
