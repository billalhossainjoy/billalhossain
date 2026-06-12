// Wrangler bundles *.md files as plain text strings via the "Text" rule.
declare module "*.md" {
  const content: string;
  export default content;
}

// Secrets are NOT in wrangler.jsonc vars (never committed to git).
// Set them with:
//   Local:      apps/rag-api/.dev.vars  →  SEED_SECRET=your-local-secret
//   Production: wrangler secret put SEED_SECRET
interface CloudflareBindings {
  SEED_SECRET: string;
}
