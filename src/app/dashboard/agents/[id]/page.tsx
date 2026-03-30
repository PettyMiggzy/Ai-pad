import Link from "next/link";
import { notFound } from "next/navigation";

import { getAgentDraftById } from "@/lib/db/agents";

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

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-4xl space-y-8">
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

        <div className="grid gap-4 md:grid-cols-3">
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
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="text-lg font-semibold">Runtime</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              <li>Session key: {agent.runtimeSessionKey ?? "Not provisioned yet"}</li>
              <li>Session id: {agent.runtimeSessionId ?? "Not provisioned yet"}</li>
            </ul>
          </section>

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
            <h2 className="text-lg font-semibold">Tools</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {agent.tools.length === 0 ? (
                <li>No tools enabled</li>
              ) : (
                agent.tools.map((tool) => <li key={tool}>{tool}</li>)
              )}
            </ul>
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
