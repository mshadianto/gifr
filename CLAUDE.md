# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GIFR Donor Concierge is a React dashboard for the Global Islamic Fund for Refugees. It provides donor transparency, Islamic finance compliance documentation, and an AI concierge interface. Built with Vite, React 18, and Tailwind CSS. Configured as a PWA via vite-plugin-pwa.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Build for production
npm run preview  # Preview production build
```

No test runner or linter is configured.

## Architecture

Single-page app with one main component (`src/GIFRDonorConcierge.jsx`, ~900 lines) containing all tab views, inline sub-components (StatCard, ProjectCard, ChatMessage, QuickActions, IslamicPattern), and core logic. Extracted modules handle specific concerns:

- `src/data/donorData.js` — Mock donor profile, portfolio, projects, beneficiary stories, chart data, SDG list
- `src/constants/index.js` — Chart colors, Groq model config, financial rates (5.8% yield, 6% overhead, 94% net-to-impact), tab definitions, map defaults
- `src/hooks/useDarkMode.js` — Dark mode toggle persisted to localStorage
- `src/utils/impactCalculator.js` — Waqf yield/impact projections and currency formatting
- `src/components/modals/ImpactSimulator.jsx` — Investment simulator modal with projections chart
- `src/components/modals/StoryDetail.jsx` — Beneficiary story detail modal with markdown-like rendering

### Key Libraries

- **recharts** — PieChart, BarChart, LineChart for portfolio and impact visualizations
- **react-leaflet / leaflet** — Map showing project locations (requires Leaflet icon URL fix at top of main component)
- **html2canvas + jsPDF** — PDF export of the dashboard view
- **vite-plugin-pwa** — Service worker and manifest generation

### AI Chat

The Chat tab uses the Groq API (LLaMA 3.3 70B) via `VITE_GROQ_API_KEY` env var. If the API key is missing or the call fails, it falls back to keyword-based responses defined inline in `handleSendMessage`.

### Tab Views

1. **Dashboard** — Overview stats, project grid, yield history chart, beneficiary bar chart, Leaflet map
2. **Portfolio** — Sukuk allocation pie chart, fee transparency breakdown (94% net yield-to-impact)
3. **Impact** — Beneficiary stories (open StoryDetail modal), Impact Simulator modal, UN SDG alignment
4. **Chat** — Aminah AI Concierge with quick action buttons and Groq-powered responses

### State Management

Local React state only (no Redux/Context). All state lives in the GIFRDonorConcierge component. Dark mode state is managed via the `useDarkMode` hook with localStorage persistence.

## Design System

- **Colors:** Emerald (primary), Amber/Gold (secondary), Stone neutrals. Dark mode uses stone-800/900 backgrounds.
- **Typography:** Cormorant Garamond (headers, set via inline style `fontFamily`), Inter (body). Loaded from Google Fonts in `index.html`.
- **Animations:** fadeIn, slideIn, pulse-gold keyframes defined in `src/index.css` with corresponding utility classes.

## Islamic Finance Context

Displays AAOIFI-compliant Sukuk investments with KPMG Sharia audit trails. Fee structure: 5% management + 1% audit = 6% overhead. Financial constants are centralized in `src/constants/index.js`.
