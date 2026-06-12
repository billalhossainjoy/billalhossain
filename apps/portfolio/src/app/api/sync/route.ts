import { NextResponse } from "next/server";

// Dev-only proxy so SEED_SECRET stays on the server and never reaches the browser.
export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in development." }, { status: 403 });
  }

  const ragApiUrl  = process.env.RAG_API_URL  ?? "http://localhost:8787";
  const seedSecret = process.env.SEED_SECRET  ?? "";

  try {
    const res  = await fetch(`${ragApiUrl}/sync`, {
      method:  "POST",
      headers: { "x-seed-secret": seedSecret },
    });
    const data = await res.json() as unknown;
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Could not reach rag-api: ${message}` }, { status: 502 });
  }
}
