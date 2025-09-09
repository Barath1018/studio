<!--
  Consider adding a small SVG logo or wordmark under /public to replace the plain heading.
  Example: <p align="center"><img src="public/logo.svg" width="120" alt="InsightEdge Studio Logo" /></p>
-->

<h1 align="center">InsightEdge Studio</h1>
<p align="center">
  A modern, type‑safe analytics & BI studio for building interactive, data‑rich dashboards and insight-driven web experiences.
</p>

<p align="center">
  <a href="https://insightedge-bid.vercel.app"><img src="https://img.shields.io/badge/demo-live-brightgreen.svg" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/CI-Configured-success" alt="CI Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License" />
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#widgets--extensibility">Widgets</a> •
  <a href="#environment-configuration">Config</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#contributing">Contributing</a>
</p>

---

> InsightEdge Studio accelerates the journey from raw data to actionable insight. Compose dashboards from reusable widgets, integrate multiple data sources, and deploy with confidence—fully typed, modular, and performance‑aware.

---

## Table of Contents

1. [Features](#features)  
2. [Live Demo](#live-demo)  
3. [Tech Stack](#tech-stack)  
4. [Quick Start](#quick-start)  
5. [Project Structure](#project-structure)  
6. [Architecture](#architecture)  
7. [Environment Configuration](#environment-configuration)  
8. [Widgets & Extensibility](#widgets--extensibility)  
9. [Data Layer Pattern](#data-layer-pattern)  
10. [Performance & Quality](#performance--quality)  
11. [Screenshots](#screenshots)  
12. [Roadmap](#roadmap)  
13. [Contributing](#contributing)  
14. [Security Notes](#security-notes)  
15. [License](#license)  
16. [Acknowledgements](#acknowledgements)

---

## Features

| Category | Highlights |
|----------|------------|
| 🔧 Modular Dashboards | Drag‑and‑drop layout (optional), widget registry, persisted layouts |
| 📊 Visualizations | Pluggable chart layer (Recharts / ECharts / custom) |
| 🧭 Data Sources | REST / GraphQL / future streaming integration |
| 🌓 Theming | Dark & light modes with semantic design tokens |
| 🔐 Access Control | Role-based visibility scaffolding (optional) |
| ⚡ Performance | Hybrid rendering (SSR/ISR), dynamic imports, aggressive caching |
| 🧪 Type Safety | End-to-end TypeScript + schema validation (Zod recommended) |
| 🛠 Dev Experience | Fast reload cycles, consistent tooling, scriptable workflows |
| 🚀 Deployment Friendly | Vercel-optimized; environment-driven runtime behavior |

---

## Live Demo

Production: https://insightedge-bid.vercel.app  
(You can add a staging link or preview branch policy here.)

---

## Tech Stack

| Layer | Tooling |
|-------|---------|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict) |
| UI & Styling | Tailwind CSS, CSS variables, utility-first tokens |
| State/Data | SWR / custom hooks (replace with real libs used) |
| Charts | (Pluggable) Recharts / ECharts / D3 |
| Forms | React Hook Form + Zod (optional) |
| Testing | Vitest / Testing Library (planned) |
| CI/CD | GitHub Actions → Vercel |
| Package Manager | pnpm |

> Update this table to reflect actual dependencies as they are added.

---

## Quick Start

```bash
git clone https://github.com/Barath1018/studio.git
cd studio
pnpm install
cp .env.example .env.local  # if the example file exists
pnpm dev
# Open http://localhost:3000
```

Production build:

```bash
pnpm build
pnpm start
```

Static type checks & lint:

```bash
pnpm type-check
pnpm lint
```

---

## Project Structure

```bash
.
├─ app/                    # Next.js routes (App Router)
│  ├─ layout.tsx           # Root layout
│  ├─ dashboard/           # Dashboard pages / route groups
│  └─ api/                 # Route handlers (server endpoints)
├─ src/
│  ├─ components/          # Reusable UI primitives
│  ├─ widgets/             # Dashboard widget implementations + registry
│  ├─ data/                # Fetchers, adapters, schema validation
│  ├─ hooks/               # Custom React hooks
│  ├─ lib/                 # Utilities (formatting, helpers)
│  ├─ config/              # App/runtime configuration
│  ├─ styles/              # Global style artifacts
│  └─ types/               # Shared TS types
├─ public/                 # Static assets (images, icons)
├─ scripts/                # Automation / maintenance scripts
├─ .github/workflows/      # CI pipelines
├─ package.json
├─ tsconfig.json
└─ README.md
```

> If the actual structure differs, regenerate this section accordingly.

---

## Architecture

```
┌────────────────────────────────┐
│        Presentation Layer       │  Pages, server components, layouts
├────────────────┬───────────────┤
│  Widgets       │  UI Toolkit    │  Reusable visual + logic components
├────────────────┴───────────────┤
│        Data Access Layer        │  Fetchers, adapters, schemas, caching
├────────────────────────────────┤
│   Integration Boundary          │  External APIs, DB proxies, streaming
└────────────────────────────────┘
```

### Data Flow (Typical Request)
1. Route loads dashboard definition  
2. Widget registry resolves required widgets  
3. Each widget invokes a typed fetcher (server or client)  
4. Response validated (e.g. Zod schema) & normalized  
5. Cached (in-memory / SWR / edge)  
6. UI renders; optional streaming updates apply patch  

---

## Environment Configuration

Create `.env.local`:

```dotenv
# Public
NEXT_PUBLIC_APP_NAME=InsightEdge Studio
NEXT_PUBLIC_API_BASE=https://api.example.com

# Auth (optional)
AUTH_SECRET=CHANGE_ME
NEXTAUTH_URL=http://localhost:3000

# Observability
SENTRY_DSN=
LOG_LEVEL=info
```

| Variable | Scope | Purpose |
|----------|-------|---------|
| NEXT_PUBLIC_APP_NAME | Public | Display name |
| NEXT_PUBLIC_API_BASE | Public | Base URL for API calls |
| AUTH_SECRET | Server | Session/token signing |
| NEXTAUTH_URL | Server | NextAuth callback base |
| SENTRY_DSN | Server | Error tracing |
| LOG_LEVEL | Server | Log verbosity |

> Add `DATABASE_URL`, `REDIS_URL`, `WS_ENDPOINT`, etc. as features expand.

---

## Widgets & Extensibility

A widget is a unit of:
- Definition (metadata)
- (Optional) Data fetcher
- Render component
- Config schema (optional—define with Zod to validate user-supplied config)

```ts
export interface DashboardWidgetProps<TConfig = unknown, TData = unknown> {
  id: string;
  title: string;
  config: TConfig;
  data?: TData;
  loading?: boolean;
  error?: Error | null;
}

export interface RegisteredWidget<TConfig = any> {
  type: string;
  displayName: string;
  icon?: React.ComponentType;
  fetcher?: (config: TConfig) => Promise<unknown>;
  Component: React.ComponentType<DashboardWidgetProps<TConfig>>;
}
```

Registration:

```ts
import { registerWidget } from '@/widgets/registry';
import { LineChartWidget } from './LineChartWidget';
import { fetchTimeSeries } from '@/data/timeSeries';

registerWidget({
  type: 'line-chart',
  displayName: 'Line Chart',
  fetcher: fetchTimeSeries,
  Component: LineChartWidget,
});
```

> Consider exposing a `useWidgetData(type, config)` hook for consistent loading states.

---

## Data Layer Pattern

```ts
// Example fetcher with schema validation
import { z } from 'zod';

const SeriesPoint = z.object({
  t: z.string(),      // ISO timestamp
  value: z.number(),
});

export const TimeSeriesSchema = z.array(SeriesPoint);

export async function fetchTimeSeries(config: { metric: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/metrics/${config.metric}`
  );
  if (!res.ok) throw new Error(`Failed metric ${config.metric}`);
  const json = await res.json();
  return TimeSeriesSchema.parse(json);
}
```

---

## Performance & Quality

| Category | Practice |
|----------|----------|
| Rendering | Prefer server components for static/data-heavy views |
| Bundles | Dynamic import chart libs (`ssr: false` if client-only) |
| Caching | ISR for semi-static; SWR for client revalidation |
| Validation | Schema-validate external payloads |
| Memory | Avoid large object cloning; stream when possible |
| Linting | Pre-commit hooks (Husky + lint-staged) |
| Testing | Unit + integration + visual regression (future) |
| Monitoring | Add Sentry / OpenTelemetry instrumentation (optional) |

Checklist (expand):

<details>
<summary><strong>Performance Checklist</strong></summary>

- [ ] Dynamic import heavy components  
- [ ] Avoid unnecessary client JS in static routes  
- [ ] Use `React.memo` for pure widgets  
- [ ] Proper SWR cache keys normalized  
- [ ] No unbounded re-renders (audit with React DevTools)  
- [ ] Lighthouse performance ≥ target (e.g. 90+)  
</details>

---

## Screenshots

| Light Mode | Dark Mode |
|------------|-----------|
| ![Light Placeholder](public/docs/screenshot-light.png) | ![Dark Placeholder](public/docs/screenshot-dark.png) |

> Add animated GIFs (e.g. widget creation flow) in `public/docs/`.

---

## Roadmap

> Track in GitHub Projects / issues for transparency.

| Milestone | Goal | Status |
|-----------|------|--------|
| M1 | Core layout + registry | ✅ In Progress |
| M2 | Auth + user layouts | ⏳ Planned |
| M3 | Real-time streaming widgets | ⏳ Planned |
| M4 | Export / share (PNG, CSV) | ⏳ Planned |
| M5 | Multi-tenant RBAC | ⏳ Planned |
| M6 | Plugin marketplace concept | 🔍 Exploring |

Task List:

- [ ] Replace tech stack placeholders with actual libraries  
- [ ] Add test harness (Vitest + Testing Library)  
- [ ] Introduce visual regression (Chromatic / Playwright)  
- [ ] Add GitHub Action for type + lint gates  
- [ ] Implement widget config editor UI  
- [ ] Document theming system (tokens + palettes)  

---

## Contributing

1. Fork & clone  
2. Create branch: `git switch -c feat/awesome-thing`  
3. Run `pnpm lint && pnpm type-check` before committing  
4. Add/update tests where applicable  
5. Open PR with:
   - Summary
   - Screenshots / GIF (UI changes)
   - Checklist (docs updated, tests added)

Commit conventions (example):

```
feat(widgets): add heatmap widget
fix(data): guard against 429 rate limiting
chore(ci): enable build cache
```

> Add a `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` for formal guidelines.

---

## Security Notes

| Area | Recommendation |
|------|---------------|
| Secrets | Only store in Vercel / GitHub Actions encrypted secrets |
| Input Validation | Use Zod schemas at boundaries |
| Auth | Centralize session logic (NextAuth or custom) |
| Rate Limiting | Middleware on API routes for abusive patterns |
| Headers | Add security headers via `next.config.js` or middleware |
| Dependency Health | Enable Dependabot / npm audit in CI |

Report vulnerabilities privately (define a security contact or SECURITY.md).

---

## FAQ (Optional)

<details>
<summary><strong>Why another BI studio?</strong></summary>
Focused on developer-first modularity, type safety, and incremental extensibility rather than monolithic dashboards.
</details>

<details>
<summary><strong>Does it support real-time?</strong></summary>
Planned WebSocket / SSE integration for streaming metrics in upcoming milestones.
</details>

---

## License

MIT License.  
You are free to use, modify, and distribute with attribution.  
See [LICENSE](./LICENSE) once added.

---

## Acknowledgements

- Next.js & React ecosystems
- Open-source charting libraries
- Contributors & reviewers

---

## Attribution / Branding

If you fork and significantly modify, consider retaining a reference link to the original repository.

---

## Quick Reference

```bash
# Install + run
pnpm install
pnpm dev

# Quality
pnpm lint
pnpm type-check

# Build
pnpm build
pnpm start
```

---

<p align="center">
  Crafted for clarity, performance & extensibility. ✨
</p>
