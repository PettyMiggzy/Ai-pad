"use client";

import { useState } from "react";

type CreateAgentResponse = {
  ok?: boolean;
  error?: string;
  agent?: {
    id: string;
    name: string;
    purpose: string;
    status: string;
    createdAt: string;
  };
};

const initialState = {
  name: "Artemis",
  purpose: "Help manage my messages and answer common questions",
  description: "Tier 1 hosted assistant",
  tone: "friendly",
  style: "clear",
  proactivity: "low",
  channelType: "webchat",
  memoryMode: "explicit_only",
  initialBucketTopupCents: 2000,
};

export function CreateAgentForm() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreateAgentResponse | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          purpose: form.purpose,
          description: form.description,
          persona: {
            tone: form.tone,
            style: form.style,
            proactivity: form.proactivity,
          },
          channels: [
            {
              type: form.channelType,
              enabled: true,
            },
          ],
          tools: ["web_search"],
          knowledge: {
            urls: [],
            notes: [],
          },
          memory: {
            mode: form.memoryMode,
            allowGroupMemory: false,
          },
          billing: {
            plan: "tier1",
            initialBucketTopupCents: Number(form.initialBucketTopupCents),
            pauseOnZeroBalance: true,
          },
        }),
      });

      const data = (await res.json()) as CreateAgentResponse;
      setResult(data);

      if (data.ok) {
        setForm(initialState);
      }
    } catch {
      setResult({ error: "Failed to create Artemis draft." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div>
        <h2 className="text-xl font-semibold">Create Artemis</h2>
        <p className="mt-1 text-sm text-zinc-400">
          This is the first Tier 1 agent creation flow for AI Pad.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-zinc-300">Agent name</span>
          <input
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-zinc-300">Channel</span>
          <select
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none"
            value={form.channelType}
            onChange={(e) => setForm({ ...form, channelType: e.target.value })}
          >
            <option value="webchat">Web chat</option>
            <option value="telegram">Telegram</option>
          </select>
        </label>
      </div>

      <label className="space-y-2 block">
        <span className="text-sm text-zinc-300">Purpose</span>
        <textarea
          className="min-h-28 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none"
          value={form.purpose}
          onChange={(e) => setForm({ ...form, purpose: e.target.value })}
        />
      </label>

      <label className="space-y-2 block">
        <span className="text-sm text-zinc-300">Description</span>
        <input
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-4">
        <label className="space-y-2">
          <span className="text-sm text-zinc-300">Tone</span>
          <input
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none"
            value={form.tone}
            onChange={(e) => setForm({ ...form, tone: e.target.value })}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-zinc-300">Style</span>
          <input
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none"
            value={form.style}
            onChange={(e) => setForm({ ...form, style: e.target.value })}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-zinc-300">Proactivity</span>
          <select
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none"
            value={form.proactivity}
            onChange={(e) => setForm({ ...form, proactivity: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm text-zinc-300">Memory mode</span>
          <select
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none"
            value={form.memoryMode}
            onChange={(e) => setForm({ ...form, memoryMode: e.target.value })}
          >
            <option value="explicit_only">Explicit only</option>
            <option value="profile_only">Profile only</option>
            <option value="none">None</option>
          </select>
        </label>
      </div>

      <label className="space-y-2 block">
        <span className="text-sm text-zinc-300">Initial bucket top-up (cents)</span>
        <input
          type="number"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none"
          value={form.initialBucketTopupCents}
          onChange={(e) =>
            setForm({ ...form, initialBucketTopupCents: Number(e.target.value) })
          }
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-white px-4 py-2 font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Artemis draft"}
      </button>

      {result?.error ? (
        <div className="rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
          {result.error}
        </div>
      ) : null}

      {result?.ok && result.agent ? (
        <div className="rounded-xl border border-emerald-900 bg-emerald-950/40 p-3 text-sm text-emerald-300">
          Draft created: <span className="font-medium">{result.agent.name}</span>
        </div>
      ) : null}
    </form>
  );
}
