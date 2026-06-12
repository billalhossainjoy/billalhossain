import { Hono } from "hono";
import { cors } from "hono/cors";
import ask  from "./routes/ask.js";
import sync from "./routes/sync.js";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use("*", cors({ origin: ["http://localhost:3000", "https://billalhossain.dev"] }));

app.get("/", (c) => c.json({ status: "ok", service: "billal-rag-api" }));

app.route("/ask",  ask);
app.route("/sync", sync);

export default app;
