import Link from "next/link";
import { notFound } from "next/navigation";

import { RuntimeStatusCard } from "@/components/agents/runtime-status-card";
import { getAgentDraftById } from "@/lib/db/agents";
import { listRunsForAgent } from "@/lib/db/runs";

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = await getAgentDraftById(id);

  if (!agent) {
    notFound();
  }

  const runs = await listRunsForAgent(agent.id);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Agent detail</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">{agent.name}</h1>
            <p className="mt-2 max-w-2xl text-zinc-400">{agent.purpose}</p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-900"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Status</p>
            <p className="mt-2 text-2xl font-semibold">{agent.status}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Template</p>
            <p className="mt-2 text-2xl font-semibold">{agent.templateName}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Created</p>
            <p className="mt-2 text-sm text-zinc-300">{agent.createdAt}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Runs</p>
            <p className="mt-2 text-2xl font-semibold">{runs.length}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <RuntimeStatusCard agentId={agent.id} sessionKey={agent.runtimeSessionKey} />

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="text-lg font-semibold">Persona</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              <li>Tone: {agent.persona.tone}</li>
              <li>Style: {agent.persona.style}</li>
              <li>Proactivity: {agent.persona.proactivity}</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="text-lg font-semibold">Memory</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              <li>Mode: {agent.memory.mode}</li>
              <li>
                Allow group memory: {agent.memory.allowGroupMemory ? "Yes" : "No"}
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="text-lg font-semibold">Channels</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {agent.channels.map((channel, index) => (
                <li key={`${channel.type}-${index}`}>
                  {channel.type} · {channel.enabled ? "enabled" : "disabled"}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="text-lg font-semibold">Recent runs</h2>
            <div className="mt-3 space-y-2 text-sm text-zinc-300">
              {runs.length === 0 ? (
                <p>No runs yet.</p>
              ) : (
                runs.slice(0, 5).map((run) => (
                  <div key={run.id} className="rounded-xl border border-zinc-800 p-3">
                    <p>{run.triggerType}</p>
                    <p className="text-zinc-400">{run.status}</p>
                    <p className="text-zinc-500">${(run.costCents / 100).toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="text-lg font-semibold">System prompt</h2>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-sm text-zinc-300">
            {agent.systemPrompt}
          </pre>
        </section>
      </div>
    </main>
  );
}
