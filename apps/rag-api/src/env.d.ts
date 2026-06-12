// Wrangler bundles *.md files as plain text strings via the "Text" rule.
// This tells TypeScript: importing any .md file gives you a string.
declare module "*.md" {
  const content: string;
  export default content;
}
