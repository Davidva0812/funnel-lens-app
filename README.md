# FunnelLens – Campaign Funnel Analytics

<img width="100%" alt="screen" src="https://github.com/user-attachments/assets/43074c00-9ca6-4294-91ee-a37672c6a704" />

---

A small v1 web app that helps marketers understand step-level funnel performance for popup campaigns and quickly spot where the biggest drop-offs happen.

---

## How to run

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Open in browser
http://localhost:5173
```

---

## Write-up

### How I understood the problem

Merchants running popup campaigns only see the final overall conversion rate (e.g. 5%), but have no visibility into *where* the funnel leaks. A single bad step can silently drain conversions without the marketer ever knowing which step is the culprit. The job is to surface that hidden information clearly.

### What I built as v1 (and what I left out)

**In scope:**
- Campaign list sidebar with mini-funnel indicator and overall conversion rate per campaign
- Step-by-step funnel view with: visitor counts, proceed/drop-off rates, proportional bar visualization
- Automatic "biggest drop-off" highlight with an alert banner
- Rule-based insight cards (3 tailored suggestions based on data patterns)
- Responsive, clean dark-mode UI aimed at non-technical marketers

**Left out (v2 ideas):**
- Date range filtering / historical trend views
- AI-generated recommendations via API call (replaced with deterministic rules for reliability)
- CSV/API data import
- Comparison mode between campaigns
- Step-level drill-down (e.g. individual variant A/B breakdown)

### Architecture & main components

```
src/
├── data/campaigns.json       # Static data source (no backend needed for v1)
├── utils/analytics.js        # Pure functions: enrichSteps, worstStep, overallConversionRate, generateInsights
├── components/
│   ├── CampaignList.vue      # Left sidebar: campaign list with quick stats
│   ├── FunnelDetail.vue      # Main view: step cards, funnel bars, drop-off connectors
│   ├── InsightCard.vue       # Bottom recommendations section
│   └── DeviceIcon.vue        # Tiny helper: renders desktop/mobile icon
└── App.vue                   # Root: holds selection state, wires sidebar ↔ detail panel
```

Key design decision: all math lives in `analytics.js` with no Vue dependencies, making it trivially testable and reusable.

### How I used AI tools

I used Claude, Gemini as pair programmers:
- **Scaffolding:** generated the initial Vite + Vue 3 + Tailwind project structure
- **Component code:** drafted component templates which I then reviewed, adjusted, and refined (especially the funnel bar proportional widths and the color-coding logic)
- **Insights copy:** helped draft the plain-language insight templates; I tuned the thresholds and wording for clarity

The funnel logic (drop-off calculation, worst step selection, overall conversion) was written and verified by me independently. AI was a speed multiplier, not a replacement for understanding the problem.

### v2 improvements

1. **AI-powered insights** – call the Anthropic API per campaign to generate context-aware recommendations based on campaign type, device, and observed patterns
2. **Time series** – add a `date` field to data and show conversion trends over time
3. **Benchmark comparisons** – show how a campaign compares to industry averages or the account's own historical performance
4. **Export** – PDF or CSV export of the funnel breakdown for sharing with clients
5. **Real backend** – replace static JSON with a Node.js API + lightweight DB (SQLite or Postgres) so data can be updated without a deploy
