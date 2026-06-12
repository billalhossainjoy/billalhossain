import { Hono } from "hono";
import { getKnowledgeChunks } from "@repo/content/worker";

const sync = new Hono<{ Bindings: CloudflareBindings }>();

/**
 * POST /sync
 *
 * Reads the knowledge chunks (parsed from portfolio markdown files bundled
 * at deploy time), generates embeddings for each one, and upserts them
 * into the Vectorize index.
 *
 * Workflow:
 *   1. Edit a markdown file in apps/portfolio/content/
 *   2. Redeploy the Worker  →  new content is bundled in
 *   3. Call POST /sync      →  Vectorize is updated with fresh embeddings
 *
 * Header required:  x-seed-secret: <your SEED_SECRET>
 */
sync.post("/", async (c) => {
  const incomingSecret = c.req.header("x-seed-secret");
  if (incomingSecret !== c.env.SEED_SECRET) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const chunks = getKnowledgeChunks();
  const results: { id: string; status: "synced" | "failed"; error?: string }[] = [];

  for (const chunk of chunks) {
    try {
      // 1. Turn the chunk's text into a 384-number vector (embedding)
      const embeddingResponse = await c.env.AI.run("@cf/baai/bge-small-en-v1.5", {
        text: [chunk.content],
      });

      if (!("data" in embeddingResponse) || !embeddingResponse.data?.[0]) {
        throw new Error("Empty or async embedding response");
      }

      // 2. Store the vector + original text in Vectorize
      //    metadata.content lets us retrieve the text during search later
      await c.env.VECTORIZE.upsert([
        {
          id: chunk.id,
          values: embeddingResponse.data[0],
          metadata: {
            content: chunk.content,
            category: chunk.metadata.category,
            title: chunk.metadata.title ?? "",
          },
        },
      ]);

      results.push({ id: chunk.id, status: "synced" });
    } catch (err) {
      results.push({
        id: chunk.id,
        status: "failed",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const syncedCount = results.filter((r) => r.status === "synced").length;
  const failedCount = results.filter((r) => r.status === "failed").length;

  return c.json({
    success: failedCount === 0,
    total: chunks.length,
    synced: syncedCount,
    failed: failedCount,
    results,
  });
});

export default sync;
