// Pure ambient declaration file (no imports/exports = "script" context).
// Tells TypeScript that importing any *.md file yields a plain string.
// Wrangler's "Text" rule in wrangler.jsonc makes this true at bundle time.
declare module "*.md" {
  const content: string;
  export default content;
}
