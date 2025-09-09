<h1 align="center">InsightEdge Studio (Starter)</h1>

<p align="center">
  <strong>Composable, type‑safe analytics & dashboarding layer for modern React / Next.js apps.</strong><br/>
  <em>Build internal or customer‑facing insight surfaces without adopting a monolithic BI platform.</em>
</p>

<p align="center">
  <!-- Optional: add /public/logo.svg and uncomment
  <img src="public/logo.svg" width="120" alt="InsightEdge Studio Logo" />
  -->
  <a href="https://insightedge-bid.vercel.app"><img alt="Live Demo" src="https://img.shields.io/badge/Demo-Live-brightgreen?style=for-the-badge" /></a>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white&style=for-the-badge" />
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs&style=for-the-badge" />
  <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwindcss&logoColor=white&style=for-the-badge" />
  <img alt="Status" src="https://img.shields.io/badge/Project_Status-Early_Alpha-orange?style=for-the-badge" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
</p>

<p align="center">
  <a href="#tldr">TL;DR</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#project-status">Status</a> •
  <a href="#why">Why?</a> •
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#widgets">Widgets</a> •
  <a href="#data-layer">Data Layer</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#contributing">Contribute</a>
</p>

---

## 🧪 TL;DR

You register widgets (metadata + component + optional data fetcher), compose them into dashboards, and let a small typed framework handle layout, validation, theming, and extension points.

Use this if you:
- Need “just enough BI” in-product
- Want type safety & extensibility over drag‑and‑drop SaaS lock‑in
- Prefer incremental build-up (start static → add auth → add streaming)

---

## 🚀 Quick Start

Prerequisites:
- Node 18.18+ (or 20+ recommended)
- pnpm 8+
- (Optional) API endpoint to supply data

```bash
git clone https://github.com/Barath1018/studio
cd studio
pnpm install
cp .env.example .env.local   # if provided
pnpm dev
# → http://localhost:3000
```

Minimal env:

```dotenv
NEXT_PUBLIC_APP_NAME=InsightEdge Studio
NEXT_PUBLIC_API_BASE=https://api.example.com
# Auth (only if NextAuth or similar actually configured)
AUTH_SECRET=CHANGE_ME
NEXTAUTH_URL=http://localhost:3000
```

If you are NOT using auth yet, you can omit `AUTH_SECRET` / `NEXTAUTH_URL`.

---

## 📊 Project Status

| Area | State | Notes |
|------|-------|-------|
| Core Layout | Alpha | Basic dashboard route and layout grid present |
| Widget Registry | Alpha | Manual registration pattern implemented |
| Theming | Basic | Light/dark tokens; extendable |
| Data Fetching | Basic | Fetcher pattern; sample validation |
| Auth | Planned | Env vars prepared, logic may not be wired |
| Real-time | Planned | Placeholder in architecture |
| Persistence (user layouts) | In Progress | Confirm actual persistence implementation before claiming |
| Plugin System | Concept | Not implemented yet |

> Adjust this table as features land to avoid misrepresentation.

---

## 💡 Why

| Pain | Conventional Outcome | This Approach |
|------|----------------------|---------------|
| Ad‑hoc dashboard sprawl | Unstructured components | Formal widget contract |
| Data shape inconsistency | Runtime surprises | Schema validation layer |
| Heavy chart libs everywhere | Large bundles | Lazy/dynamic import strategy |
| Theming drift | Inconsistent styling | Central tokens & variants |
| Hard to extend safely | Hidden coupling | Explicit registries & adapters |

---

## ✨ Features (Implemented / Planned)

| Category | Current | Planned |
|----------|---------|---------|
| Widget Registry | ✅ | Enhanced metadata, plugin discovery |
| Layout Composition | ✅ | Persist per user / org |
| Validation (Zod-ready) | ✅ | Auto‑generated types from schemas |
| Data Adapters | 🟡 (basic fetchers) | Caching tiers, fallbacks |
| Theming | ✅ | Semantic token packs |
| Real-time | ❌ | WebSocket / SSE bridges |
| Auth Integration | ❌ | Multi-tenant + RBAC |
| Export / Share | ❌ | PDF / Image / Link tokens |
| Plugin Ecosystem | ❌ | Manifest ingestion |

Legend: ✅ available • 🟡 partial • ❌ not yet

---

## 🧱 Project Structure (Overview)

```bash
.
├─ app/                # Next.js App Router
│  ├─ dashboard/       # Dashboard route(s)
│  └─ api/             # Route handlers
├─ src/
│  ├─ widgets/         # Widget implementations + registry
│  ├─ components/      # UI primitives / composites
│  ├─ data/            # Fetchers, adapters, schemas
│  ├─ hooks/           # Reusable client/server hooks
│  ├─ lib/             # Utilities & helpers
│  ├─ config/          # Runtime constants
│  ├─ styles/          # Tailwind/global styles
│  └─ types/           # Shared TypeScript types
└─ public/             # Static assets (images, docs)
```

---

## 🧩 Widgets

A widget = metadata + (optional) fetcher + UI component.

```ts
// types/widgets.ts
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

Registration example:

```ts
registerWidget({
  type: 'line-chart',
  displayName: 'Line Chart',
  fetcher: fetchTimeSeries,
  Component: LineChartWidget,
});
```

### Create Your First Widget (Step-by-Step)

1. Define config & data schema (optional but recommended).
2. Add a fetcher (server-side preferred).
3. Build a presentational component respecting `DashboardWidgetProps`.
4. Register it in a central `widgets/index.ts`.
5. Reference it in a dashboard layout JSON / array.

```ts
// src/widgets/timeSeries/widget.tsx
import { z } from 'zod';

const Point = z.object({ t: z.string(), value: z.number() });
export const TimeSeries = z.array(Point);

export interface TimeSeriesConfig {
  metric: string;
}

export async function fetchTimeSeries(cfg: TimeSeriesConfig) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/metrics/${cfg.metric}`);
  if (!r.ok) throw new Error('Metric fetch failed');
  return TimeSeries.parse(await r.json());
}

export function TimeSeriesWidget(props: DashboardWidgetProps<TimeSeriesConfig, z.infer<typeof TimeSeries>>) {
  if (props.loading) return <div>Loading…</div>;
  if (props.error) return <div>Error: {props.error.message}</div>;
  return (
    <div className="widget">
      <h3>{props.title}</h3>
      {/* Replace with actual chart lib */}
      <pre>{JSON.stringify(props.data?.slice(0, 5), null, 2)}</pre>
    </div>
  );
}

// registration
registerWidget({
  type: 'time-series',
  displayName: 'Time Series',
  fetcher: fetchTimeSeries,
  Component: TimeSeriesWidget,
});
```

---

## 🧵 Data Layer

Basic pattern now: `fetcher -> (optional) schema validate -> pass data to component`.

Suggested layering (incremental):
```
Fetcher (raw IO)
  ↓
Adapter (normalize / map)
  ↓
Schema validation (Zod)
  ↓
Widget consumption
```

Example adapter:

```ts
// src/data/adapters/normalizeMetric.ts
import { z } from 'zod';

const ExternalMetric = z.object({ timestamp: z.string(), val: z.number() });
const ExternalMetricArray = z.array(ExternalMetric);

// Normalized internal shape
export const InternalPoint = z.object({ t: z.date(), value: z.number() });
export const InternalSeries = z.array(InternalPoint);

export async function loadMetric(name: string) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/v2/metric/${name}`);
  if (!r.ok) throw new Error('Fetch failed');
  const raw = ExternalMetricArray.parse(await r.json());
  return InternalSeries.parse(
    raw.map(p => ({ t: new Date(p.timestamp), value: p.val }))
  );
}
```

---

## 🏗 Architecture

```
Routes / Layouts (Next.js server & client boundaries)
    ↓
Widgets Layer (registry, typed config, rendering)
    ↓
Data Layer (fetchers, adapters, validation, caching)
    ↓
Integration Boundary (REST / GraphQL / Future streaming)
```

Execution flow (request-time):
1. Dashboard route resolves layout definition
2. Widget registry enumerates required fetchers
3. Fetchers run (server preferred; fallback client)
4. Data validated & normalized
5. Components render with loading / error states
6. (Future) Realtime patches hydrate via SSE / WS

---

## ⚙️ Environment Variables

| Variable | Scope | Purpose | Required |
|----------|-------|---------|----------|
| NEXT_PUBLIC_APP_NAME | Public | Display name | ✅ |
| NEXT_PUBLIC_API_BASE | Public | Base API URL | ✅ |
| AUTH_SECRET | Server | Auth/session signing | Optional (if auth used) |
| NEXTAUTH_URL | Server | Auth callback base | Optional |
| SENTRY_DSN | Server | Error tracing | Optional |
| LOG_LEVEL | Server | Logging verbosity | Optional |

> Keep secrets out of Git history. Use platform secret managers.

---

## 🧪 Quality & Performance

| Concern | Current Tactics |
|---------|-----------------|
| Type Safety | Strict TS config |
| Validation | Zod-ready pattern |
| Bundle Control | Dynamic imports for heavy libs |
| Caching | (Add strategy: SWR / custom) |
| Monitoring | (Optional) Sentry / metrics |
| Static vs Client | Prefer server components where possible |

Performance checklist (adapt as you implement):
- [ ] Dynamic import large chart libs
- [ ] Stable cache keys to avoid duplicate fetches
- [ ] Memoize pure components
- [ ] Remove unused client components
- [ ] Lighthouse pass (Perf / A11y)

---

## 🗺 Roadmap

| Milestone | Description | Status |
|-----------|-------------|--------|
| M1 | Core layout + widget registry | ✅ (Alpha) |
| M2 | User auth + personalized layouts | Planned |
| M3 | Real-time (WebSockets/SSE) | Planned |
| M4 | Export / share dashboards | Planned |
| M5 | Multi-tenant + RBAC | Planned |
| M6 | Plugin manifest (3rd-party widgets) | Exploring |

Backlog Ideas:
- CONTRIBUTING.md / CODE_OF_CONDUCT.md
- Test scaffold (Vitest + Testing Library)
- Visual regression (Storybook / Playwright)
- Theming documentation
- CI pipeline (lint / type / build)
- Dataset seeding script

---

## 🔐 Security Notes

| Topic | Guidance |
|-------|----------|
| Secrets | Use deployment provider secret store |
| Validation | Always schema-validate external data |
| Auth | Centralize session + middleware (when added) |
| Rate Limiting | Add API middleware (sliding window / token bucket) |
| Headers | Apply strict headers in `next.config.js` or middleware |
| Disclosure | Add a SECURITY.md if accepting reports |

---

## 🛠 Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run production build |
| `pnpm lint` | ESLint checks |
| `pnpm type-check` | TypeScript noEmit |
| `pnpm format` | Prettier formatting |
| `pnpm test` | (Add when tests land) |

---

## 🖼 Screenshots

| Light | Dark |
|-------|------|
| ![Light Placeholder](public/docs/screenshot-light.png) | ![Dark Placeholder](public/docs/screenshot-dark.png) |

> Replace with real captures once UI stabilizes. Consider adding a GIF for drag/drop or widget add flow.

---

## ❓ FAQ

<details>
<summary><strong>Can I plug in any chart library?</strong></summary>
Yes—wrap the library in a widget component, keep props minimal & typed, and register it.
</details>

<details>
<summary><strong>Is real-time supported?</strong></summary>
Not yet; roadmap includes SSE/WebSocket adapters.
</details>

<details>
<summary><strong>Multi-tenant?</strong></summary>
Patterns will emerge with namespaced layouts + RBAC (planned).
</details>

---

## 🤝 Contributing

1. Fork & clone
2. Branch: `git switch -c feat/your-feature`
3. Implement feature + (future) tests
4. Run checks: `pnpm lint && pnpm type-check`
5. Open PR including:
   - Summary
   - Screenshots (UI changes)
   - Notes on performance / validation impacts

Commit examples:
```
feat(widgets): add heatmap widget
fix(data): handle 429 rate limiting
chore(ci): introduce dependency caching
```

---

## 📄 License

MIT (include a LICENSE file at repo root).  
Attribution appreciated but not required.

---

## 🙌 Acknowledgements

- Next.js & React communities
- Open-source visualization ecosystems
- Early contributors & reviewers

---

## 🔁 Quick Reference

```bash
pnpm install
pnpm dev
pnpm lint
pnpm type-check
pnpm build
pnpm start
```

<p align="center"><strong>Built for clarity, safety & extensibility. ✨</strong></p>
