# Billal Hossain — Portfolio 2.0

Personal portfolio monorepo built with **Next.js 15**, **Cloudflare Workers**, and a fully **markdown-driven content system** with an **AI-powered RAG chat assistant**.

🌐 **Live:** [billalhossain.dev](https://billal.space)

---

## Monorepo structure

```
billalhossain/
├── apps/
│   ├── portfolio/          # Next.js 15 App Router — the portfolio website
│   └── rag-api/            # Cloudflare Worker (Hono) — AI chat backend
│
└── packages/
    ├── content/            # Shared markdown content layer
    │   ├── md/
    │   │   ├── site/       # Hero, about, skills, contact, footer, resume
    │   │   ├── projects/   # One .md file per project
    │   │   ├── experience/ # One .md file per role
    │   │   ├── gallery/    # One .md file per image
    │   │   └── others/     # RAG-only context (interests, faq, philosophy, domain)
    │   └── src/
    │       ├── types.ts    # TypeScript interfaces for all frontmatter
    │       ├── parser.ts   # Pure parse functions + RAG chunk builder
    │       ├── server.ts   # Node.js reader using fs (Next.js server components)
    │       └── worker.ts   # Cloudflare Worker reader (static md imports)
    ├── eslint-config/      # Shared ESLint config
    └── typescript-config/  # Shared tsconfig bases
```

---

## Apps

### `portfolio` — Next.js 15

The main portfolio website. **Every piece of content comes from markdown files** — zero hardcoded personal data in any component.

| Section | Source file |
|---------|------------|
| Hero | `md/site/hero.md` |
| About + stats | `md/site/about.md` |
| Skills | `md/site/skills.md` |
| Contact cards | `md/site/contact.md` |
| Footer | `md/site/footer.md` |
| Resume + PDF | `md/site/resume.md` |
| Projects | `md/projects/*.md` |
| Experience | `md/experience/*.md` |
| Gallery | `md/gallery/*.md` |

**Features:**
- `force-dynamic` + `unstable_noStore()` — md edits appear on refresh, no restart
- AI chat widget (bottom-right) connected to the RAG API
- Dev sync panel (bottom-left, dev only) — re-embeds content into Vectorize
- `/resume` route — PDF viewer with Download + Share buttons
- SEO: `generateMetadata()`, JSON-LD `Person` schema, sitemap, robots.txt

**Tech:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, gray-matter

---

### `rag-api` — Cloudflare Worker

Hono-based Cloudflare Worker that powers the portfolio's AI chat assistant using a full RAG pipeline.

**Endpoints:**

| Route | Method | Description |
|-------|--------|-------------|
| `GET /` | — | Health check |
| `POST /sync` | `x-seed-secret` header | Embeds all knowledge chunks into Vectorize |
| `POST /ask` | `{ "question": "..." }` | Semantic search → Llama 3.1 → answer |

**RAG pipeline:**
1. `POST /sync` — reads knowledge chunks from `@repo/content/worker`, embeds each with `@cf/baai/bge-small-en-v1.5` (384-dim), upserts into Vectorize
2. `POST /ask` — embeds question → queries Vectorize (top-5) → builds grounded prompt → calls `@cf/meta/llama-3.1-8b-instruct-fp8` → returns answer

**Bindings:** `AI` (Workers AI), `VECTORIZE` (billal-knowledge-index, cosine, 384d)

**Tech:** Cloudflare Workers, Hono, Wrangler 4, Vectorize, Workers AI

---

## Getting started

### Prerequisites

- Node.js >= 20
- pnpm 11.3.0 (`npm i -g pnpm`)
- Cloudflare account (for rag-api)

### Install

```bash
pnpm install
```

### Environment setup

```bash
# Portfolio
cp apps/portfolio/.env.example apps/portfolio/.env.local

# RAG API
cp apps/rag-api/.dev.vars.example apps/rag-api/.dev.vars
```

Edit both files and fill in your values.

### Dev

```bash
# Run all apps
pnpm dev

# Run individually
pnpm dev --filter=portfolio
pnpm dev --filter=rag-api
```

Portfolio → `http://localhost:3000`
RAG API → `http://127.0.0.1:8787`

### Build

```bash
pnpm build
```

---

## Content editing

All content lives in `packages/content/md/`. Edit any markdown file and refresh the browser — changes appear instantly (no restart required).

### Adding a project

1. Create `packages/content/md/projects/my-project.md`
2. Fill in the frontmatter (see existing files for reference)
3. Set `published: true`
4. Add an import in `packages/content/src/worker.ts` + entry in `PROJECT_FILES`

### Re-syncing the AI

After editing content, re-embed it into Vectorize so the chat assistant reflects the changes:

```bash
# Dev (via the portfolio's proxy route)
curl -X POST http://localhost:3000/api/sync   # OR click "Sync AI" in the UI

# Direct to Worker
curl -X POST http://127.0.0.1:8787/sync \
  -H "x-seed-secret: your-seed-secret"
```

### Adding RAG-only context

Drop a new `.md` file into `packages/content/md/others/`. The body text becomes a knowledge chunk. Frontmatter:

```yaml
---
title: "My context title"
skip: false   # set true to exclude from RAG
---

Write anything here. The AI will use this to answer visitor questions.
```

Then add an import + entry in `packages/content/src/worker.ts` and re-sync.

---

## Deployment

### Portfolio → Vercel

Set these environment variables in the Vercel dashboard:

```
NEXT_PUBLIC_SITE_URL=https://billal.space
NEXT_PUBLIC_RAG_API_URL=https://rag-api.<subdomain>.workers.dev
RAG_API_URL=https://rag-api.<subdomain>.workers.dev
SEED_SECRET=<strong-random-secret>
```

### RAG API → Cloudflare Workers

```bash
cd apps/rag-api

# Create Vectorize index (first time only)
pnpm wrangler vectorize create billal-knowledge-index \
  --dimensions=384 --metric=cosine

# Set production secret
pnpm wrangler secret put SEED_SECRET

# Deploy
pnpm deploy

# Seed Vectorize in production
curl -X POST https://rag-api.<subdomain>.workers.dev/sync \
  -H "x-seed-secret: <your-seed-secret>"
```

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Content | Markdown + gray-matter |
| Monorepo | pnpm workspaces + Turborepo |
| AI Backend | Cloudflare Workers + Hono |
| Vector DB | Cloudflare Vectorize |
| LLM | Cloudflare Workers AI (Llama 3.1) |
| Embeddings | `@cf/baai/bge-small-en-v1.5` |
| Deployment | Vercel (portfolio) + Cloudflare (rag-api) |
