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

  async function runLifecycle(action: "pause" | "resume") {
    setLoading(true);
    setLifecycle(null);

    try {
      const res = await fetch(`/api/runtime/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agentId }),
      });

      const data = (await res.json()) as LifecycleResponse;
      setLifecycle(data);
    } catch {
      setLifecycle({ error: `Failed to ${action} runtime.` });
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

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={checkStatus}
          disabled={loading || !sessionKey}
          className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-100 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Working..." : "Check status"}
        </button>
        <button
          type="button"
          onClick={() => runLifecycle("pause")}
          disabled={loading || !sessionKey}
          className="rounded-xl border border-amber-700 px-4 py-2 text-sm text-amber-200 transition hover:bg-amber-950/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={() => runLifecycle("resume")}
          disabled={loading || !sessionKey}
          className="rounded-xl border border-emerald-700 px-4 py-2 text-sm text-emerald-200 transition hover:bg-emerald-950/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Resume
        </button>
      </div>

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

      {lifecycle?.error ? (
        <div className="mt-4 rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
          {lifecycle.error}
        </div>
      ) : null}

      {lifecycle?.ok ? (
        <div className="mt-4 rounded-xl border border-emerald-900 bg-emerald-950/40 p-3 text-sm text-emerald-300">
          Runtime {lifecycle.action} command sent ({lifecycle.mode} mode).
        </div>
      ) : null}
    </section>
  );
}
