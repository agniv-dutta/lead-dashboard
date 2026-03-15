# Lead Dashboard

A React and Vite dashboard for exploring Tata Motors lead data from a CSV file. The app is oriented around sales operations workflows: lead quality monitoring, trend analysis, funnel visibility, pincode-level performance, sales-stage heatmaps, and model-specific drilldowns.

## What This Project Does

The dashboard loads lead records from a CSV file in the browser and presents them across three main views:

- Overview: overall lead metrics, trend tabs, search, filtering, export, and recent lead visibility.
- Model Analysis: deep-dive analysis for a selected vehicle model with charts, maps, alerts, and a raw data table.
- Business Summary: a short business-impact narrative for AI-assisted lead classification.

The application currently uses a demo authentication screen for local access and does not depend on a backend service.

## Key Features

- Client-side CSV parsing with Papa Parse
- Demo login/register screen for local walkthroughs
- Light and dark theme toggle with persisted preference
- Overview dashboard with:
	- lead trend view
	- lead quality score
	- conversion funnel
	- call density map
	- sales stage heatmap
	- recent leads table
- Search across common lead fields such as name, phone, email, model, pincode, city, state, and status
- Filters for line of business and time windows, including custom date ranges
- CSV export for filtered overview results
- Model-specific analysis for Curvv, Punch, Nexon, Sierra, Harrier, Safari, or all models

## Tech Stack

- React 18
- Vite 7
- Papa Parse
- Leaflet
- ESLint

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install

```bash
npm install
```

### Run the App

```bash
npm run dev
```

Vite will start the local development server and print the local URL in the terminal.

### Production Build

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

## Demo Access

The app ships with a local demo login flow. Any submission of the form enters the dashboard, but these seeded credentials are already prefilled in the UI:

- Email: ops@tata.com
- Password: demo123

## Data Source

The dashboard fetches its main dataset from:

- public/model_analysis.csv

At runtime, the app requests the file from the root path `/model_analysis.csv` and parses it in the browser. If you want to replace the data, keep the filename consistent or update the fetch path in the hook.

The hook responsible for loading and filtering data is located in:

- src/hooks/useLeadsData.js

It derives:

- the full row set
- model-filtered data
- hot, warm, and cold lead counts
- a last-updated date based on the latest available record date

## Project Structure

```text
lead-dashboard/
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
|   `-- App.jsx
|-- index.html
|-- package.json
`-- vite.config.js
```

## Main Application Flow

1. The app shows a demo auth screen.
2. After sign-in, the dashboard shell loads.
3. `useLeadsData` fetches and parses the CSV.
4. The user switches between Overview, Model Analysis, and Business Summary.
5. Filters and model selection update the visible analytics client-side.

## Notes for Development

- This is a frontend-only dashboard at the moment.
- Authentication is UI-only and not secure for production.
- The data pipeline is CSV-based, so large files may affect client-side performance.
- If you move or rename the CSV, update the fetch path in `src/hooks/useLeadsData.js`.

## Available Scripts

- `npm run dev`: start the Vite dev server
- `npm run build`: create a production build
- `npm run preview`: serve the production build locally

## Possible Next Improvements

- Replace demo auth with real authentication and route protection
- Move data loading behind an API for larger datasets
- Add automated tests for filters, charts, and data transforms
- Add schema validation for incoming CSV columns
- Document the expected CSV column names in more detail
