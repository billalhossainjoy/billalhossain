# rag-api

Cloudflare Worker (Hono) that powers the AI chat assistant on [billalhossain.dev](https://billal.space).

## RAG pipeline

```
POST /ask { question }
    ↓
1. Embed question  →  @cf/baai/bge-small-en-v1.5  →  384-dim vector
2. Query Vectorize →  top-5 nearest knowledge chunks
3. Build prompt    →  system + context + question
4. Call LLM        →  @cf/meta/llama-3.1-8b-instruct-fp8
5. Return answer   →  { answer, sources }

POST /sync   (x-seed-secret header required)
    ↓
For each knowledge chunk from @repo/content/worker:
  → embed with bge-small-en-v1.5
  → upsert into Vectorize (id, vector, metadata.content)
```

## Dev

```bash
pnpm dev          # starts wrangler dev on :8787
pnpm check-types  # TypeScript check
pnpm cf-typegen   # regenerate worker-configuration.d.ts after wrangler.jsonc changes
```

## Deploy

```bash
pnpm wrangler secret put SEED_SECRET
pnpm deploy
```

## Environment

Copy `.dev.vars.example` → `.dev.vars` and set your local `SEED_SECRET`.

See the [root README](../../README.md) for full setup instructions.
