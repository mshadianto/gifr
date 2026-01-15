# GIFR Donor Concierge

A React dashboard component for the Global Islamic Fund for Refugees (GIFR) that provides donors with transparency into their Waqf investments and impact.

## Features

- **Dashboard Overview** - View Waqf principal, net yield, beneficiary counts, and Barakah score
- **Portfolio Management** - Track Sukuk allocations with AAOIFI compliance and fee transparency
- **Impact Tracking** - Monitor funded projects with real-time progress and field updates
- **AI Concierge (Aminah)** - Chat interface for donor inquiries about impact, audits, and reinvestment

## Installation

1. Copy `gifr-donor-concierge.jsx` into your React project
2. Ensure Tailwind CSS is configured
3. Import and use:

```jsx
import GIFRDonorConcierge from './gifr-donor-concierge';

function App() {
  return <GIFRDonorConcierge />;
}
```

## Requirements

- React 17+
- Tailwind CSS
- Google Fonts (Cormorant Garamond, Inter) - automatically loaded via CSS import

## Screenshots

The dashboard includes four main views:

| Tab | Description |
|-----|-------------|
| Dashboard | Overview stats, project cards, notification center |
| Portfolio | Sukuk allocation breakdown, fee transparency (94% yield-to-impact) |
| Impact | Field stories, UN SDG alignment, beneficiary updates |
| Chat | Aminah AI concierge for donor engagement |

## Islamic Finance Compliance

- AAOIFI-compliant Sukuk instruments (Ijarah, Musharakah)
- KPMG Sharia audit trail
- Transparent fee structure: 5% management + 1% audit = 6% total overhead

## License

Proprietary - Global Islamic Fund for Refugees
