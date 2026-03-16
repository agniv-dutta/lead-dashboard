# Lead Dashboard

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Vercel Functions](https://img.shields.io/badge/Vercel-Serverless%20API-000000?style=for-the-badge&logo=vercel&logoColor=white)
![React](https://img.shields.io/badge/React-18+-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-7+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![React Query](https://img.shields.io/badge/TanStack-React%20Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)

A React and Vite dashboard for exploring Tata Motors lead data from a CSV file. The application is built for sales operations analysis: lead-quality monitoring, conversion visibility, model-level drilldowns, pincode intelligence, and stage progression tracking.

The current implementation uses a hybrid architecture: the frontend renders analytics and maps, while Vercel Serverless API routes under api/leads read and aggregate data from public/model_analysis.csv for production-safe deployment.

## Overview

This project provides three main product surfaces:

| View | Purpose | Main Interactions |
| --- | --- | --- |
| Overview | High-level operational view of all leads | Search, LOB filter, time filter, custom date range, export, tabbed visualizations |
| Model Analysis | Drilldown for a selected model or all models | Model selector, refresh, detailed charts, map, alerts, raw table |
| Business Summary | Executive-style impact summary | Static business outcome summary |

The app also includes a demo authentication screen and a persistent light/dark theme toggle.

## Feature Set

### Dashboard behavior

- Client-side CSV loading with Papa Parse
- Model-aware filtering through a shared data hook
- Cached theme preference via localStorage
- Manual refresh action for re-reading the CSV
- UI-only auth gate for demos and walkthroughs

### Overview page

- Total call and model coverage badges
- Lead trend chart with weekly, monthly, and yearly views
- Lead quality score visualization
- Conversion funnel visualization
- Call density map across Indian states
- Sales stage heatmap by model and stage
- Search across lead identity and location fields
- LOB filter support for PV and EV lead slices
- Time filtering with preset windows and custom date range
- CSV export for the currently filtered result set
- Recent leads table for quick inspection

### Model analysis page

- Model selector for All Models, Curvv, Punch, Nexon, Sierra, Harrier, and Safari
- KPI cards for total, hot, warm, and cold leads
- Trend and lead-quality components scoped to the selected model
- Conversion funnel and insight delta views
- Smart alerts based on status mix, test drive demand, and pincode concentration
- Call density map and sales stage heatmap scoped to the current model filter
- Raw table showing the first 200 visible records

## How The App Works

1. The user lands on a demo auth screen.
2. After sign-in, the dashboard shell loads with the sidebar and top navigation.
3. The shared hook in src/hooks/useLeadsData.js fetches /model_analysis.csv.
4. Papa Parse converts the CSV into row objects.
5. The hook derives filtered data, summary counts, and a last-updated value.
6. Page components render their own metrics and charts from the filtered row set.

## Tech Stack

- Frontend: React 18, React DOM 18, Vite 7
- Data fetching/cache: TanStack React Query
- Mapping: Leaflet + React Leaflet
- Charting: Chart.js + react-chartjs-2
- CSV ingestion/parsing: Papa Parse
- Backend (local/dev): Express 5
- Backend (production): Vercel Serverless Functions (api/leads/*)
- Runtime/Tooling: Node.js 18+, npm
- Quality: ESLint

## README Badges

The icons/labels like "Python", "FastAPI", "React", and "Vite" at the top of a README are called badges (often generated with Shields).

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Vite will print a local URL, typically on localhost, for opening the dashboard in the browser.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Demo Access

The current auth flow is only a UI gate for local demos. The form is prefilled with demo values and any valid submit enters the app.

| Field | Value |
| --- | --- |
| Email | ops@tata.com |
| Password | demo123 |

These values are defined in src/App.jsx.

## Data Source

The main dataset lives at:

- public/model_analysis.csv

At runtime, the app fetches it from:

- /model_analysis.csv

The data loading and model filter logic live in:

- src/hooks/useLeadsData.js

The hook currently derives:

- the full parsed row set
- the selected-model slice
- hot, warm, and cold lead counts
- a last-updated value using the latest available created date

## Expected CSV Fields

The current sample dataset includes fields such as:

- transcription_name
- lead_classification_status
- lead_classification_reason
- model
- pin_code
- time_to_buy
- agent_name
- customer_name
- qualifiers
- phone_number
- created_at
- updated_sales_stage
- lob
- opty_created_date
- booking_date
- retail_date

The UI is tolerant of some alternate field names in a few components, but the most important columns for current behavior are listed below.

| Field | Used For |
| --- | --- |
| lead_classification_status | Hot, warm, and cold counts across most charts |
| model | Model filtering, heatmap rows, distribution summaries |
| created_at or opty_created_date | Trend calculations and last-updated value |
| pin_code | Geographic state resolution for the density map |
| updated_sales_stage | Sales stage inference and heatmap progression |
| qualifiers | Test drive inference and alert generation |
| booking_date | Booking-stage inference |
| retail_date | Delivery-stage inference |
| lob | PV and EV filtering in the overview |

## Metric And Visualization Logic

The dashboard is not only displaying raw data. Several visuals derive higher-level signals from row fields.

### Lead trend

- Uses created_at or opty_created_date
- Groups rows by day for weekly and monthly views
- Aggregates by quarter for the yearly view
- Splits each bar into hot, warm, and cold counts

### Sales stage heatmap

- Uses fixed model rows and fixed stage columns
- Treats all matching rows as Inquiry volume
- Infers Test Drive from qualifiers or updated_sales_stage
- Infers Booking from booking_date or booking-related stage names
- Infers Delivery from retail_date or retail-related stage names

### Call density map

- Resolves state from state fields when available
- Falls back to pincode-to-state mapping when state is absent
- Uses approximate state centroids for marker placement
- Colors markers using hot-lead ratio and sizes them by total volume

### Smart alerts

- Flags models with high cold-lead ratios
- Flags models with strong hot-lead spikes
- Flags test-drive demand above a threshold
- Flags concentrated pincode activity when a single area dominates the sample

## Project Structure

```text
lead-dashboard/
|-- api/
|   |-- _lib/
|   |   `-- leadsData.js
|   `-- leads/
|       |-- alerts.js
|       |-- funnel.js
|       |-- models.js
|       |-- pincodes.js
|       |-- recent.js
|       |-- summary.js
|       |-- trend.js
|       `-- velocity.js
|-- public/
|   `-- model_analysis.csv
|-- src/
|   |-- components/
|   |   |-- OverviewDashboard.jsx
|   |   |-- Model_Analysis.jsx
|   |   |-- BusinessImpactSummary.jsx
|   |   |-- LeadTrend.jsx
|   |   |-- ConversionFunnel.jsx
|   |   |-- LeadQualityScore.jsx
|   |   |-- CallDensityMap.jsx
|   |   |-- SalesStageHeatmap.jsx
|   |   |-- SmartAlerts.jsx
|   |   `-- Sidebar.jsx
|   |-- hooks/
|   |   `-- useLeadsData.js
|   |-- utils/
|   |   |-- pincodeStateMap.js
|   |   `-- tataModels.js
|   `-- App.jsx
|-- index.html
|-- package.json
`-- vite.config.js
```

## Important Files

| File | Responsibility |
| --- | --- |
| src/App.jsx | Auth shell, page switching, theme handling, top-level layout |
| src/hooks/useLeadsData.js | CSV fetch, parse, model filter, aggregate counts |
| src/components/OverviewDashboard.jsx | Cross-dashboard filtering, export, and overview composition |
| src/components/Model_Analysis.jsx | Model-specific analytics page assembly |
| src/components/CallDensityMap.jsx | Leaflet map, state aggregation, pin-to-state fallback |
| src/components/SalesStageHeatmap.jsx | Stage progression matrix by model |
| src/utils/pincodeStateMap.js | Numeric PIN range to state resolution |

## Available Scripts

| Command | Description |
| --- | --- |
| npm run dev | Start the Vite development server |
| npm run build | Create a production build |
| npm run preview | Preview the production build locally |

The production build command has been verified successfully in this workspace.

## Customization Guide

### Replace the dataset

1. Replace public/model_analysis.csv with a file that keeps the required fields.
2. If you rename the file, update the fetch path in src/hooks/useLeadsData.js.
3. Rebuild or restart the dev server if needed.

### Add or change models

Model names are currently referenced in multiple places, including page selectors and the sales stage heatmap. If you expand the model list, update the relevant components so selectors and charts stay aligned.

### Adjust alert thresholds

Thresholds for smart alerts are currently hardcoded in src/components/SmartAlerts.jsx. This is the place to tune sensitivity for hot spikes, cold lead ratios, test drive counts, and pincode concentration.

### Adjust map state inference

The geographic fallback logic is implemented in src/components/CallDensityMap.jsx and src/utils/pincodeStateMap.js. If your data already carries clean state names, prefer that source over pin-derived inference.

## Limitations

- Authentication is not production-grade and should not be treated as secure.
- All processing happens in the browser, so very large CSV files may affect load time and UI responsiveness.
- Leaflet tiles rely on external map providers and may fail on restricted networks.
- Some visual logic uses heuristics from free-text or stage fields, so data quality directly affects chart accuracy.

## Troubleshooting

### The dashboard shows no data

- Confirm that public/model_analysis.csv exists.
- Confirm the file has a header row.
- Confirm the fetch path in src/hooks/useLeadsData.js still points to /model_analysis.csv.

### The map does not render correctly

- Check browser console errors related to Leaflet or tile loading.
- Verify network access to OpenStreetMap tile providers.
- Confirm pin_code or state values are present in the data.

### Filters do not behave as expected

- Check whether the dataset uses the expected field names, especially lob, created_at, opty_created_date, model, and lead_classification_status.
- Confirm date fields are parseable by the browser.

## Next Improvement Areas

- Replace the demo auth screen with real authentication and route protection
- Move CSV loading behind an API for larger datasets and fresher data
- Add tests for data transforms, filtering, and visual edge cases
- Centralize model configuration instead of duplicating model lists across components
- Add schema validation and documented sample data contracts
