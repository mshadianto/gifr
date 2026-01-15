# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GIFR Donor Concierge is a React dashboard for the Global Islamic Fund for Refugees. It provides donor transparency, Islamic finance compliance documentation, and an AI concierge interface.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Build for production
npm run preview  # Preview production build
```

## Project Structure

```
gifr/
├── src/
│   ├── main.jsx              # Entry point
│   ├── index.css             # Tailwind CSS
│   └── GIFRDonorConcierge.jsx # Main component (~900 lines)
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Architecture

### Component Hierarchy

- **GIFRDonorConcierge** - Main dashboard with tab navigation
  - **StatCard** - Metric display cards (waqf principal, yield, beneficiaries)
  - **ProjectCard** - Impact project cards with progress tracking
  - **ChatMessage** - AI concierge chat bubbles
  - **QuickActions** - Predefined query buttons
  - **IslamicPattern** - SVG geometric decorations

### State Management

Local React state only (no Redux/Context). Key state:
- `activeTab` - Dashboard/Portfolio/Impact/Chat views
- `chatMessages` - Chat history
- `selectedProject` - Current project selection
- `isTyping` - AI response indicator

### Data Structure

`donorData` object (src/GIFRDonorConcierge.jsx:16-52) contains all mock data:
- Donor profile
- Sukuk portfolio allocation (2 instruments)
- Impact projects (education, livelihood)

### Tab Views

1. **Dashboard** - Overview stats and project grid
2. **Portfolio** - Sukuk allocation, fee transparency (94% net yield-to-impact)
3. **Impact** - Field stories, UN SDG alignment
4. **Chat** - Aminah AI Concierge with keyword-based responses

## Design System

- **Colors:** Emerald (primary), Amber/Gold (secondary), Stone neutrals
- **Typography:** Cormorant Garamond (headers), Inter (body)
- **Animations:** fadeIn, slideIn, pulse-gold keyframes

## Islamic Finance Context

The component displays AAOIFI-compliant Sukuk investments with KPMG Sharia audit trails. Fee structure: 5% management + 1% audit = 6% overhead.
