"use client";

import { useState } from "react";

type Status = "idle" | "syncing" | "success" | "error";

interface SyncResult {
  synced?: number;
  total?: number;
  failed?: number;
  error?: string;
}

export default function DevSyncPanel() {
  const [status, setStatus]   = useState<Status>("idle");
  const [result, setResult]   = useState<SyncResult | null>(null);

  async function handleSync() {
    setStatus("syncing");
    setResult(null);
    try {
      const res  = await fetch("/api/sync", { method: "POST" });
      const data = await res.json() as SyncResult;
      setResult(data);
      setStatus(res.ok ? "success" : "error");
    } catch {
      setResult({ error: "Could not reach /api/sync" });
      setStatus("error");
    }
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="flex flex-col items-start gap-2">
        {/* Result bubble */}
        {result && (
          <div
            className={`text-xs px-3 py-2 rounded-xl border backdrop-blur-sm animate-fade-up ${
              status === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {status === "success"
              ? `✓ ${result.synced ?? 0} / ${result.total ?? 0} chunks synced`
              : `✗ ${result.error ?? "Sync failed"}`}
          </div>
        )}

        {/* Button */}
        <button
          onClick={() => void handleSync()}
          disabled={status === "syncing"}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-gray-900/80 backdrop-blur-sm text-xs font-medium text-gray-400 hover:text-white hover:border-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Re-embed markdown files into Vectorize"
        >
          {/* Spinning loader or icon */}
          <span
            className={`size-3 rounded-full border border-current border-t-transparent ${
              status === "syncing" ? "animate-spin" : "opacity-50"
            }`}
          />
          {status === "syncing" ? "Syncing…" : "Sync AI"}
          {/* DEV badge */}
          <span className="px-1 py-0.5 rounded text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 leading-none">
            DEV
          </span>
        </button>
      </div>
    </div>
  );
}
