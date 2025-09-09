# InsightEdge

Composable, type‑safe analytics & dashboarding layer for modern React / Next.js apps.  
Focus: ship in‑product insights without adopting a bulky BI suite.

[Live Demo](https://insightedge-bid.vercel.app) · MIT · Alpha

---

## 1. Why This Exists

You want:
- Built‑in dashboards (internal or customer‑facing)  
- Strong typing + predictable data flow  
- Extensibility (add widgets, data sources, real‑time later)  
- Control over UX & performance

You don’t want:
- Vendor lock‑in  
- Drag‑and‑drop magic that’s hard to version  
- Heavy bundles from generic chart platforms  

---

## 2. What You Get (Current vs Coming)

| Area | Now | Coming Soon |
|------|-----|-------------|
| Widget registry & layout grid | ✅ | User personalization |
| Data fetcher + validation pattern | ✅ | Caching tiers / adapters |
| Theming (light/dark tokens) | ✅ | Semantic token packs |
| Type safety (TS + Zod‑ready) | ✅ | Generated inferred types |
| Real‑time (SSE / WS) | — | ✅ |
| Auth & RBAC | — | ✅ |
| Plugin ecosystem | — | Exploratory |
| Export / share (PDF/link) | — | Planned |

Legend: ✅ implemented · — not yet

---

## 3. Quick Start

```bash
git clone https://github.com/Barath1018/studio
cd studio
pnpm install
cp .env.example .env.local   # if present
pnpm dev
# → http://localhost:3000
```

Minimal `.env.local`:
```dotenv
NEXT_PUBLIC_APP_NAME=InsightEdge Studio
NEXT_PUBLIC_API_BASE=https://api.example.com
# Optional later:
# AUTH_SECRET=CHANGE_ME
# NEXTAUTH_URL=http://localhost:3000
```

---

## 4. Mental Model

```
Dashboard Route (Next.js)
    ↓ resolves layout (array of widget entries)
Widget Registry (type → fetcher? → component)
    ↓
Fetch & Validate (server preferred)
    ↓ normalized data
Widget UI (loading | error | data)
    ↓
(Future) Real-time patch stream
```

Principles:
1. Type Safety First  
2. Progressive enhancement (start static, layer streaming/auth)  
3. Explicit registries > hidden directory globs  
4. Lean core; you own adapters  
5. Validation at the edge to avoid runtime drift  
6. Performance by intent (lazy heavy libs)  

---

## 5. Core Concepts

| Concept | Shape / Idea |
|---------|--------------|
| Widget | Metadata + optional fetcher + React component |
| Layout | Array of `{ id, type, title, config, layout }` |
| Fetcher | Async function returning validated data |
| Registry | Map of `type` → implementation (keeps coupling explicit) |
| Adapter (optional) | Normalize external → internal schema |
| Future Plugin | External widget bundle with manifest |

---

## 6. Define a Widget (Compact Example)

```ts
// schemas/timeSeries.ts
import { z } from 'zod';

export const TimePoint = z.object({ t: z.string(), value: z.number() });
export const TimeSeries = z.array(TimePoint);

export type TimeSeriesData = z.infer<typeof TimeSeries>;
export interface TimeSeriesConfig { metric: string; }
```

```ts
// data/fetchTimeSeries.ts
import { TimeSeries, TimeSeriesConfig } from '../schemas/timeSeries';

export async function fetchTimeSeries(cfg: TimeSeriesConfig) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/metrics/${cfg.metric}`);
  if (!r.ok) throw new Error('Metric fetch failed');
  return TimeSeries.parse(await r.json());
}
```

```tsx
// widgets/TimeSeriesWidget.tsx
import type { DashboardWidgetProps } from './types';

export function TimeSeriesWidget(
  { title, data, loading, error }: DashboardWidgetProps<{ metric: string }, any>
) {
  if (loading) return <div>Loading…</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="widget">
      <h3>{title}</h3>
      <pre>{JSON.stringify(data?.slice(0, 5), null, 2)}</pre>
    </div>
  );
}
```

```ts
// widgets/register.ts
registerWidget({
  type: 'time-series',
  displayName: 'Time Series',
  fetcher: (cfg) => fetchTimeSeries(cfg),
  Component: TimeSeriesWidget,
});
```

```ts
// config/dashboardLayouts.ts
export const defaultDashboard = [
  {
    id: 'w1',
    type: 'time-series',
    title: 'Active Users (5m)',
    config: { metric: 'active_users_5m' },
    layout: { x: 0, y: 0, w: 4, h: 3 }
  }
];
```

---

## 7. Environment Variables (Practical Set)

| Variable | Purpose | Required |
|----------|---------|----------|
| NEXT_PUBLIC_APP_NAME | UI label | Yes |
| NEXT_PUBLIC_API_BASE | Data fetch base URL | Yes |
| AUTH_SECRET | Session/auth signing | Later |
| NEXTAUTH_URL | Auth callback base | Later |
| SENTRY_DSN | Error tracing | Optional |

Tips:
- Keep secrets out of git.
- Prefer server components / route handlers for sensitive logic.

---

## 8. Extending

Add a new data source:
1. Create fetcher (server-first)  
2. (Optional) adapter → internal schema  
3. Validate with Zod  
4. Register widget using explicit `registerWidget`  
5. Add to a layout

Add chart library:
- Wrap component → dynamic import heavy vendor bundle  
- Keep typed config minimal  
- Provide loading & error states  

Real-time (future):
- Keep initial fetch consistent with patch contract  
- Patch stream updates widget state internally

---

## 9. Performance Guidance (Starter Checklist)

| Concern | Action |
|---------|--------|
| Bundle bloat | Dynamic import heavy charts |
| Duplicate fetches | Stable cache keys (RSC caching / SWR) |
| Validation cost | Reuse schemas; avoid re-parsing unchanged |
| Hydration | Favor server components; limit client state |
| Error surfacing | Centralized boundary for widget errors |

---

## 10. Roadmap (Condensed)

Short Horizon:
- Auth + user-specific layouts
- Real-time transport (SSE/WS)
- Export/share capability
- Plugin manifest draft

Exploratory / Backlog:
- CI (lint + type + basic tests)
- Storybook / visual regression
- Security hardening (headers, rate limiting)
- Multi-tenant + RBAC patterns
- Docs site (Nextra / Docusaurus)

---

## 11. Troubleshooting Quick Map

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Widget not rendered | Type mismatch / not registered | Verify `type` in registry |
| Fetcher always client-side | Using client-only import | Move to server component boundary |
| Validation errors | Out-of-sync schema | Align schema + re-run `pnpm type-check` |
| Large JS bundle | Eager chart imports | Convert to dynamic import |
| Wrong API host | Env var missing | Check `NEXT_PUBLIC_API_BASE` |

---

## 12. Contributing

```bash
git switch -c feat/your-idea
pnpm lint
pnpm type-check
```

PR should include:
- Summary + reasoning
- Screenshots (UI)
- Notes on perf / validation impact

Commit style examples:
```
feat(widget): add heatmap
fix(fetch): handle 429 rate limiting
chore(tooling): add type-check to CI
```

---

## 13. Security (Early Notes)

- Always validate external data at boundaries
- Plan: `SECURITY.md` once accepting disclosures
- Add CSP & Permissions-Policy headers before production
- Consider rate limiting for public endpoints

---

## 14. Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run build |
| `pnpm lint` | ESLint |
| `pnpm type-check` | TS verification |
| `pnpm format` | Prettier |
| `pnpm test` | (Add later) |

---

## 15. License

MIT. Attribution appreciated, not required.

---

## 16. Snapshot Quick Reference

```bash
pnpm install
pnpm dev
pnpm lint
pnpm type-check
pnpm build
pnpm start
```

---

Built for clarity, controlled extensibility, and incremental sophistication. ✨
