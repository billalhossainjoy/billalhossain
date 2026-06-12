// Re-export from the shared content package (Worker-safe, no fs).
export { getKnowledgeChunks } from "@repo/content/worker";
export type { KnowledgeChunk } from "@repo/content";
