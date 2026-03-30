"use client";

import { useState } from "react";

type RuntimeStatusResponse = {
  ok?: boolean;
  error?: string;
  mode?: "mock" | "openclaw";
  connected?: boolean;
  status?: string;
  sessionKey?: string;
};

export function RuntimeStatusCard({
  agentId,
  sessionKey,
}: {
  agentId: string;
  sessionKey?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RuntimeStatusResponse | null>(null);

  async function checkStatus() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/runtime/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agentId }),
      });

      const data = (await res.json()) as RuntimeStatusResponse;
      setResult(data);
    } catch {
      setResult({ error: "Failed to load runtime status." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <h2 className="text-lg font-semibold">Runtime</h2>
      <ul className="mt-3 space-y-2 text-sm text-zinc-300">
        <li>Session key: {sessionKey ?? "Not provisioned yet"}</li>
      </ul>

      <button
        type="button"
        onClick={checkStatus}
        disabled={loading || !sessionKey}
        className="mt-4 rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-100 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Checking..." : "Check runtime status"}
      </button>

      {result?.error ? (
        <div className="mt-4 rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
          {result.error}
        </div>
      ) : null}

      {result?.ok ? (
        <div className="mt-4 rounded-xl border border-sky-900 bg-sky-950/40 p-3 text-sm text-sky-300">
          <p>Mode: {result.mode}</p>
          <p>Connected: {result.connected ? "Yes" : "No"}</p>
          <p>Status: {result.status}</p>
        </div>
      ) : null}
    </section>
  );
}
