# DevHub

A Next.js 15 showcase app that demonstrates every major rendering strategy — **SSG, ISR, SSR, CSR** — with real-world examples, educational reference pages, paginated data, and skeleton loading states.

Built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Axios.

---

## Live Demo

Deploy your own in 60 seconds → [Vercel Deploy Guide](#deployment)

---

## What's Inside

### Pages & Rendering Strategies

| Route               | Strategy | Why                                                         |
| ------------------- | -------- | ----------------------------------------------------------- |
| `/`                 | **SSG**  | Static home page, built once at compile time                |
| `/posts`            | **ISR**  | Posts revalidated every 60 s — fresh without a full rebuild |
| `/posts/[id]`       | **ISR**  | Individual post with comments, same 60 s revalidation       |
| `/users`            | **SSR**  | User data fetched fresh on every request                    |
| `/users/[id]`       | **SSR**  | User profile with posts and todos — always current          |
| `/explore`          | **CSR**  | Client-side search + pagination via Axios                   |
| `/cors`             | **SSG**  | Reference guide: What is CORS and how to fix it             |
| `/http-only-cookie` | **SSG**  | Reference guide: HttpOnly cookies explained                 |
| `/ppr`              | **SSG**  | Reference guide: Partial Pre-Rendering in Next.js 15        |

### Key Features

- **Pagination** — all list pages show 10 items per page. Posts and Users use URL-based pagination (`?page=N`) so pages are bookmarkable and shareable. Explore uses client-state pagination that resets on search.
- **Skeleton loading** — every page shows exactly 10 skeleton cards (matching the page size) while data loads. No layout shift.
- **Search with highlight** — Explore page filters posts and users in real time and highlights the matching text.
- **Axios interceptors** — a shared `apiClient` instance logs every request and response to the console and handles errors centrally.
- **Responsive** — all pages are mobile-first and work across all screen sizes.

---

## Project Structure

```
devhub/
├── app/
│   ├── page.tsx                  # Home (SSG)
│   ├── layout.tsx                # Root layout + Navbar + Footer
│   ├── loading.tsx               # Global loading skeleton (10 cards)
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 page
│   ├── posts/
│   │   ├── page.tsx              # Posts list (ISR + pagination)
│   │   └── [id]/page.tsx         # Post detail (ISR)
│   ├── users/
│   │   ├── page.tsx              # Users list (SSR + pagination)
│   │   └── [id]/page.tsx         # User profile (SSR)
│   ├── explore/
│   │   └── page.tsx              # Search + pagination (CSR)
│   ├── cors/
│   │   └── page.tsx              # CORS guide (SSG)
│   ├── http-only-cookie/
│   │   └── page.tsx              # HttpOnly cookie guide (SSG)
│   └── ppr/
│       └── page.tsx              # PPR guide (SSG)
├── components/
│   ├── Navbar.tsx                # Top navigation
│   ├── PostCard.tsx              # Post card component
│   ├── UserCard.tsx              # User card component
│   ├── Pagination.tsx            # Server-side URL pagination
│   └── Skeletons.tsx             # Skeleton card components
├── lib/
│   ├── api.ts                    # Server-side fetch helpers (SSG/ISR/SSR)
│   ├── axios.ts                  # Axios client instance (CSR)
│   └── types.ts                  # TypeScript interfaces
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Rendering Strategy Deep Dive

### SSG — Static Site Generation

```ts
// Fetched ONCE at build time, served from CDN forever
export const getStaticStats = () =>
  apiFetch<Post[]>("/posts", { cache: "force-cache" });
```

Best for: marketing pages, documentation, educational content — anything that doesn't change at runtime.

### ISR — Incremental Static Regeneration

```ts
// Cached, but re-fetched in the background every 60 seconds
export const getAllPosts = () =>
  apiFetch<Post[]>("/posts", { next: { revalidate: 60 } });

// Or at the segment level:
export const revalidate = 60;
```

Best for: blogs, product listings, content that changes occasionally but doesn't need to be real-time.

### SSR — Server-Side Rendering

```ts
// Fetched fresh on every incoming HTTP request — never cached
export const getAllUsers = () =>
  apiFetch<User[]>("/users", { cache: "no-store" });

// Or at the segment level:
export const dynamic = "force-dynamic";
```

Best for: dashboards, auth-gated pages, personalised data, anything that must be real-time.

### CSR — Client-Side Rendering

```ts
// Axios runs in the browser — Next.js caching doesn't apply
const res = await apiClient.get<Post[]>("/posts");
```

Best for: highly interactive UIs, real-time search, anything that needs instant feedback without a server round-trip.

---

## Axios Setup

The `lib/axios.ts` file creates a shared instance with:

- **Base URL** pointing to `jsonplaceholder.typicode.com`
- **8 second timeout**
- **Request interceptor** — logs every outgoing call (swap in your auth token here)
- **Response interceptor** — logs responses and handles 404/500 errors centrally
- **AbortController support** — requests are cancelled on component unmount

Open your browser DevTools console on the `/explore` page to see the interceptors in action.

---

## Tech Stack

| Tool         | Version | Purpose                |
| ------------ | ------- | ---------------------- |
| Next.js      | 15.3.1  | Framework (App Router) |
| React        | 19      | UI library             |
| TypeScript   | 5       | Type safety            |
| Tailwind CSS | 3.4     | Styling                |
| Axios        | 1.7     | HTTP client (CSR)      |

Data source: [JSONPlaceholder](https://jsonplaceholder.typicode.com) — free fake REST API.

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
# Build for production
npm run build

# Run the production build locally
npm start

# Lint
npm run lint
```

No environment variables are required — the app fetches from a public API out of the box.

---

## Deployment

### Option 1 — GitHub + Vercel (recommended)

1. Push the project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and click **Add New → Project**
3. Import your repository — Vercel auto-detects Next.js
4. Click **Deploy**

Done. Every `git push` to `main` triggers an automatic re-deployment. Pull requests get their own preview URL.

### Option 2 — Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts — your app is live in under a minute.

---

## Educational Reference Pages

Three pages document the concepts used throughout the project:

**`/cors`** — Cross-Origin Resource Sharing

- What is CORS and why the browser enforces it
- When it triggers (different origin, port, protocol, preflight)
- How to fix it: Express headers, Next.js Route Handlers, `next.config` headers, dev proxy
- Full reference table of all CORS response headers
- Common mistakes to avoid

**`/http-only-cookie`**

- What the `HttpOnly` attribute does and why it matters
- When to use it: session tokens, JWT refresh tokens, remember-me tokens
- When not to use it: UI preferences, client-side feature flags, analytics
- Security benefits: XSS protection, credential isolation, defence in depth
- Full cookie attributes reference table

**`/ppr`** — Partial Pre-Rendering (Next.js 15)

- What PPR is and the problem it solves
- How static shells + dynamic islands work with `<Suspense>` boundaries
- How to enable PPR in `next.config.ts`
- Comparison table: SSG vs ISR vs SSR vs CSR vs PPR
- Real-world use cases and gotchas

All three pages use SSG — they are pure educational content that never changes at runtime, so there is no reason to involve a server at request time.

---
