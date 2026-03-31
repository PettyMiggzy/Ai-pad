"use client";

import { useState } from "react";

type RuntimeStatusResponse = {
  ok?: boolean;
  error?: string;
  mode?: "mock" | "openclaw";
  connected?: boolean;
  status?: string;
};

type LifecycleResponse = {
  ok?: boolean;
  error?: string;
  action?: "pause" | "resume";
  mode?: "mock" | "openclaw";
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
  const [lifecycle, setLifecycle] = useState<LifecycleResponse | null>(null);

  async function checkStatus() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/runtime/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });
      setResult(await res.json());
    } catch {
      setResult({ error: "Failed to load status." });
    } finally {
      setLoading(false);
    }
  }

  async function runLifecycle(action: "pause" | "resume") {
    setLoading(true);
    setLifecycle(null);
    try {
      const res = await fetch(`/api/runtime/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });
      setLifecycle(await res.json());
    } catch {
      setLifecycle({ error: `Failed to ${action}.` });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
      <h2 className="text-lg font-semibold text-white mb-3">Runtime</h2>
      <div className="text-sm text-zinc-400 mb-4">
        <span className="text-zinc-500">Session:</span>{" "}
        <span className="text-zinc-300 font-mono text-xs">
          {sessionKey ?? "Not provisioned"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={checkStatus}
          disabled={loading || !sessionKey}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "Check Status"}
        </button>
        <button
          onClick={() => runLifecycle("pause")}
          disabled={loading || !sessionKey}
          className="rounded-lg border border-amber-700/40 px-4 py-2 text-xs font-semibold text-amber-400 transition hover:bg-amber-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Pause
        </button>
        <button
          onClick={() => runLifecycle("resume")}
          disabled={loading || !sessionKey}
          className="rounded-lg border border-green-700/40 px-4 py-2 text-xs font-semibold text-green-400 transition hover:bg-green-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Resume
        </button>
      </div>

      {result?.error && (
        <div className="mt-3 rounded-xl border border-red-900/40 bg-red-950/30 p-3 text-xs text-red-300">
          {result.error}
        </div>
      )}

      {result?.ok && (
        <div className="mt-3 rounded-xl border border-blue-500/20 bg-blue-950/20 p-3 text-xs text-blue-300 space-y-1">
          <div>Mode: {result.mode}</div>
          <div>Connected: {result.connected ? "Yes" : "No"}</div>
          <div>Status: {result.status}</div>
        </div>
      )}

      {lifecycle?.error && (
        <div className="mt-3 rounded-xl border border-red-900/40 bg-red-950/30 p-3 text-xs text-red-300">
          {lifecycle.error}
        </div>
      )}

      {lifecycle?.ok && (
        <div className="mt-3 rounded-xl border border-green-500/20 bg-green-950/20 p-3 text-xs text-green-300">
          Runtime {lifecycle.action} sent ({lifecycle.mode}).
        </div>
      )}
    </section>
  );
}
