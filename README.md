<!-- Anchor for "Back to Top" links -->
<a id="readme-top"></a>

<h1 align="center">InsightEdge Studio (Starter)</h1>
<p align="center">
  <strong>Composable, type‑safe analytics & dashboarding layer for modern React / Next.js apps.</strong><br/>
  <em>Build internal or customer‑facing insight surfaces without adopting a monolithic BI platform.</em>
</p>

<p align="center">
  <!-- Optional: add /public/logo.svg and uncomment
  <img src="public/logo.svg" width="120" alt="InsightEdge Studio Logo" />
  -->
  <a href="https://insightedge-bid.vercel.app">
    <img alt="Live Demo" src="https://img.shields.io/badge/Demo-Live-brightgreen?style=for-the-badge" />
  </a>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript&logoColor=white&style=for-the-badge" />
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs&style=for-the-badge" />
  <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwindcss&logoColor=white&style=for-the-badge" />
  <img alt="Status" src="https://img.shields.io/badge/Project_Status-Early_Alpha-orange?style=for-the-badge" />
  <a href="#license"><img alt="License" src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" /></a>
</p>

---

## Table of Contents
- [TL;DR](#tldr)
- [Quick Start](#quick-start)
- [Project Status](#project-status)
- [Why?](#why)
- [Features](#features)
- [Design Principles](#design-principles)
- [Architecture](#architecture)
- [Widgets](#widgets)
- [Data Layer](#data-layer)
- [Extensibility & Future Plugins](#extensibility)
- [Environment Variables](#environment-variables)
- [Quality & Performance](#quality--performance)
- [Roadmap](#roadmap)
- [Security Notes](#security-notes)
- [Scripts](#scripts)
- [Screenshots](#screenshots)
- [FAQ](#faq)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Quick Reference](#quick-reference)

---

<a id="tldr"></a>
## 🧪 TL;DR
You register widgets (metadata + component + optional data fetcher), compose them into dashboards, and a small typed framework handles layout, validation, theming, and extension points.

Use this if you:
- Need “just enough BI” in-product.
- Want type safety & extensibility over drag‑and‑drop SaaS lock‑in.
- Prefer incremental build-up (start static → add auth → add streaming).

[⬆ Back to Top](#readme-top)

---

<a id="quick-start"></a>
## 🚀 Quick Start

Prerequisites:
- Node 18.18+ (20+ recommended)
- pnpm 8+
- (Optional) API endpoint for metrics/services

```bash
git clone https://github.com/Barath1018/studio
cd studio
pnpm install
cp .env.example .env.local   # if provided
pnpm dev
# → http://localhost:3000
```

Minimal `.env.local`:
```dotenv
NEXT_PUBLIC_APP_NAME=InsightEdge Studio
NEXT_PUBLIC_API_BASE=https://api.example.com
# Auth (only if NextAuth or similar configured)
AUTH_SECRET=CHANGE_ME
NEXTAUTH_URL=http://localhost:3000
```

If you are not using auth yet, omit `AUTH_SECRET` / `NEXTAUTH_URL`.

### Example: Defining a Dashboard Layout
Create (or adapt) a layout file, e.g. `src/config/dashboardLayouts.ts`:
```ts
export const defaultDashboard = [
  {
    id: 'w1',
    type: 'time-series',
    title: 'Active Users (5m)',
    config: { metric: 'active_users_5m' },
    layout: { x: 0, y: 0, w: 4, h: 3 }
  },
  {
    id: 'w2',
    type: 'line-chart',
    title: 'Revenue Trend',
    config: { metric: 'rev_daily' },
    layout: { x: 4, y: 0, w: 4, h: 3 }
  }
];
```

Then ensure the dashboard route imports and renders these items via the registry.

[⬆ Back to Top](#readme-top)

---

<a id="project-status"></a>
## 📊 Project Status

| Area | State | Notes |
|------|-------|-------|
| Core Layout | Alpha | Basic dashboard route & grid |
| Widget Registry | Alpha | Manual registration pattern |
| Theming | Basic | Light/dark tokens; extendable |
| Data Fetching | Basic | Fetcher pattern; sample validation |
| Auth | Planned | Env vars wired; logic pending |
| Real-time | Planned | Future SSE / WebSocket |
| Persistence (user layouts) | In Progress | Confirm implementation before claiming |
| Plugin System | Concept | Not implemented |

> Keep this table current to avoid misrepresentation.

[⬆ Back to Top](#readme-top)

---

<a id="why"></a>
## 💡 Why?

| Pain | Conventional Outcome | This Approach |
|------|----------------------|---------------|
| Ad‑hoc dashboard sprawl | Unstructured components | Formal widget contract |
| Data shape inconsistency | Runtime surprises | Schema validation layer |
| Heavy chart libs everywhere | Large bundles | Lazy/dynamic imports |
| Theming drift | Inconsistent styling | Central tokens & variants |
| Hard to extend safely | Hidden coupling | Explicit registries & adapters |

[⬆ Back to Top](#readme-top)

---

<a id="features"></a>
## ✨ Features (Implemented / Planned)

| Category | Current | Planned |
|----------|---------|---------|
| Widget Registry | ✅ | Enhanced metadata, discovery |
| Layout Composition | ✅ | Persist per user / org |
| Validation (Zod-ready) | ✅ | Auto‑generated types |
| Data Adapters | 🟡 Basic | Caching tiers, fallbacks |
| Theming | ✅ | Semantic token packs |
| Real-time | ❌ | WebSocket / SSE bridges |
| Auth Integration | ❌ | Multi-tenant + RBAC |
| Export / Share | ❌ | PDF / Image / Link tokens |
| Plugin Ecosystem | ❌ | Manifest ingestion |

Legend: ✅ available • 🟡 partial • ❌ not yet

[⬆ Back to Top](#readme-top)

---

<a id="design-principles"></a>
## 🧭 Design Principles
1. Type Safety First – contracts prevent runtime surprises.
2. Progressive Enhancement – start static; layer streaming or auth later.
3. Explicit Registries – avoid “magic” auto-glob patterns that hide coupling.
4. Lean Core – no forced vendor lock-in; you own adapters.
5. Extensible Boundaries – registries, adapters, and schema gates are stable extension points.
6. Performance via Intent – dynamic import heavy libs, pre-validate data, minimize hydration.

[⬆ Back to Top](#readme-top)

---

<a id="architecture"></a>
## 🏗 Architecture

```
Routes / Layouts (Next.js server & client boundaries)
    ↓
Widgets Layer (registry, typed config, rendering)
    ↓
Data Layer (fetchers, adapters, validation, caching)
    ↓
Integration Boundary (REST / GraphQL / future streaming)
```

Execution Flow (request-time):
1. Dashboard route resolves layout definition.
2. Registry enumerates required fetchers.
3. Fetchers run (server preferred; fallback client).
4. Data normalized & validated.
5. Components render with loading / error states.
6. (Future) Real-time patches hydrate via SSE / WebSockets.

[⬆ Back to Top](#readme-top)

---

<a id="widgets"></a>
## 🧩 Widgets

A widget = metadata + (optional) fetcher + UI component.

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

Registration example:
```ts
registerWidget({
  type: 'line-chart',
  displayName: 'Line Chart',
  fetcher: fetchTimeSeries,
  Component: LineChartWidget,
});
```

### Create Your First Widget (Steps)
1. Define config & data schema (Zod recommended).
2. Implement a fetcher (server-side).
3. Build a presentational component using `DashboardWidgetProps`.
4. Register it (`src/widgets/index.ts`).
5. Add to a dashboard layout.

Example:
```ts
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

export function TimeSeriesWidget(
  props: DashboardWidgetProps<TimeSeriesConfig, z.infer<typeof TimeSeries>>
) {
  if (props.loading) return <div>Loading…</div>;
  if (props.error) return <div>Error: {props.error.message}</div>;
  return (
    <div className="widget">
      <h3>{props.title}</h3>
      <pre>{JSON.stringify(props.data?.slice(0, 5), null, 2)}</pre>
    </div>
  );
}

registerWidget({
  type: 'time-series',
  displayName: 'Time Series',
  fetcher: fetchTimeSeries,
  Component: TimeSeriesWidget,
});
```

[⬆ Back to Top](#readme-top)

---

<a id="data-layer"></a>
## 🧵 Data Layer

Pattern: `fetcher → (optional) adapter → schema validation → widget`.

Suggested layering:
```
Fetcher (raw IO)
  ↓
Adapter (normalize / map)
  ↓
Schema validation (Zod)
  ↓
Widget consumption
```

Adapter example:
```ts
import { z } from 'zod';

const ExternalMetric = z.object({ timestamp: z.string(), val: z.number() });
const ExternalMetricArray = z.array(ExternalMetric);

export const InternalPoint = z.object({ t: z.date(), value: z.number() });
export const InternalSeries = z.array(InternalPoint);

export async function loadMetric(name: string) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/v2/metric/${name}`);
  if (!r.ok) throw new Error('Fetch failed');
  const raw = ExternalMetricArray.parse(await r.json());
  return InternalSeries.parse(raw.map(p => ({ t: new Date(p.timestamp), value: p.val })));
}
```

[⬆ Back to Top](#readme-top)

---

<a id="extensibility"></a>
## 🧱 Extensibility & Future Plugins
Planned plugin manifest could allow:
- Discovery-based widget loading.
- Versioned adapter contracts.
- Optional sandbox isolation for 3rd-party code.

Interim approach: maintain a curated internal registry.

[⬆ Back to Top](#readme-top)

---

<a id="environment-variables"></a>
## ⚙️ Environment Variables

| Variable | Scope | Purpose | Required |
|----------|-------|---------|----------|
| NEXT_PUBLIC_APP_NAME | Public | Display name | ✅ |
| NEXT_PUBLIC_API_BASE | Public | Base API URL | ✅ |
| AUTH_SECRET | Server | Auth/session signing | Optional (if auth added) |
| NEXTAUTH_URL | Server | Auth callback base | Optional |
| SENTRY_DSN | Server | Error tracing | Optional |
| LOG_LEVEL | Server | Logging verbosity | Optional |

Tips:
- Never commit secrets.
- For multi-env deployments, use platform-specific secret managers.
- Prefer server components & route handlers for sensitive access.

[⬆ Back to Top](#readme-top)

---

<a id="quality--performance"></a>
## 🧪 Quality & Performance

| Concern | Current Tactics |
|---------|-----------------|
| Type Safety | Strict TS config |
| Validation | Zod-ready pattern |
| Bundle Control | Dynamic imports for heavy libs |
| Caching | (Add strategy: SWR / RSC caching) |
| Monitoring | (Optional) Sentry / custom metrics |
| Static vs Client | Prefer server components |

Performance Checklist (adapt as implemented):
- [ ] Dynamic import large chart libs
- [ ] Stable cache keys to avoid duplicate fetches
- [ ] Memoize pure components
- [ ] Remove unused client components
- [ ] Lighthouse: Performance & A11y
- [ ] Zod schemas co-located & re-used (avoid duplication)

[⬆ Back to Top](#readme-top)

---

<a id="roadmap"></a>
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
- Security hardening (headers + rate limit)
- Docs site (e.g. Nextra / Docusaurus)

[⬆ Back to Top](#readme-top)

---

<a id="security-notes"></a>
## 🔐 Security Notes

| Topic | Guidance |
|-------|----------|
| Secrets | Use provider secret stores |
| Validation | Always schema-validate external data |
| Auth | Centralize session + middleware (when added) |
| Rate Limiting | Add API middleware (sliding window / token bucket) |
| Headers | Add strict headers (CSP, Permissions-Policy) |
| Disclosure | Add a SECURITY.md if accepting reports |

[⬆ Back to Top](#readme-top)

---

<a id="scripts"></a>
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

[⬆ Back to Top](#readme-top)

---

<a id="screenshots"></a>
## 🖼 Screenshots

| Light | Dark |
|-------|------|
| ![Light Placeholder](public/docs/screenshot-light.png) | ![Dark Placeholder](public/docs/screenshot-dark.png) |

> Replace with real captures once UI stabilizes. Consider a GIF for drag/drop or widget add flow.

[⬆ Back to Top](#readme-top)

---

<a id="faq"></a>
## ❓ FAQ

<details>
<summary><strong>Why didn’t the internal links work earlier?</strong></summary>
Likely due to environment-specific rendering (some platforms strip emojis or alter slug rules). Explicit <code>&lt;a id="..."></code> anchors now ensure consistent behavior.
</details>

<details>
<summary><strong>Can I plug in any chart library?</strong></summary>
Yes—wrap the lib in a widget component; keep props minimal & typed; register it.
</details>

<details>
<summary><strong>Is real-time supported?</strong></summary>
Not yet; roadmap includes SSE/WebSocket adapters.
</details>

<details>
<summary><strong>Multi-tenant roadmap?</strong></summary>
Namespaced layouts + RBAC patterns are planned.
</details>

<details>
<summary><strong>Can I SSR everything?</strong></summary>
Yes; prefer server components for data fetch/validation; hydrate only interactive parts.
</details>

[⬆ Back to Top](#readme-top)

---

<a id="troubleshooting"></a>
## 🧯 Troubleshooting

| Symptom | Possible Cause | Action |
|---------|----------------|-------|
| Anchors not scrolling | Host modifies slugs | Use explicit `id` anchors (now added) |
| Fetcher errors | Wrong API base | Verify `NEXT_PUBLIC_API_BASE` |
| Layout mismatch | Missing widget type | Ensure widget registered before layout load |
| Type errors | Outdated types | Run `pnpm type-check` & align schemas |
| Large bundle | Heavy chart eager import | Convert to dynamic import with suspense |

[⬆ Back to Top](#readme-top)

---

<a id="contributing"></a>
## 🤝 Contributing

1. Fork & clone
2. Branch: `git switch -c feat/your-feature`
3. Implement feature + (future) tests
4. Run checks: `pnpm lint && pnpm type-check`
5. Open PR including:
   - Summary
   - Screenshots (UI changes)
   - Notes on performance / validation impacts

Commit Examples:
```
feat(widgets): add heatmap widget
fix(data): handle 429 rate limiting
chore(ci): introduce dependency caching
```

> Consider adding a [CONTRIBUTING.md](./CONTRIBUTING.md) & CODE_OF_CONDUCT.md for clarity.

[⬆ Back to Top](#readme-top)

---

<a id="license"></a>
## 📄 License

MIT (ensure a LICENSE file at repo root).  
Attribution appreciated but not required.

[⬆ Back to Top](#readme-top)

---

<a id="acknowledgements"></a>
## 🙌 Acknowledgements
- Next.js & React communities
- Open-source visualization ecosystems
- Early contributors & reviewers

[⬆ Back to Top](#readme-top)

---

<a id="quick-reference"></a>
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
