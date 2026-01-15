# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GIFR Donor Concierge is a single-file React dashboard component for the Global Islamic Fund for Refugees. It provides donor transparency, Islamic finance compliance documentation, and an AI concierge interface.

## Build & Development

This is a standalone React component with no build configuration. To use:

1. Copy `gifr-donor-concierge.jsx` into a React project with Tailwind CSS
2. Import: `import GIFRDonorConcierge from './gifr-donor-concierge'`
3. Render: `<GIFRDonorConcierge />`

**Dependencies:**
- React 17+ (uses hooks: useState, useEffect, useRef)
- Tailwind CSS
- Google Fonts (Cormorant Garamond, Inter) - loaded via inline @import

## Architecture

### Single-File Structure

The entire application is in `gifr-donor-concierge.jsx` (~900 lines). This is intentional for portability.

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

`donorData` object (lines 16-52) contains all mock data:
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
