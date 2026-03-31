import Link from "next/link";
import { notFound } from "next/navigation";

import { Nav } from "@/components/ui/nav";
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
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-300 transition">
              ← Dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-white">{agent.name}</h1>
            <p className="mt-1 max-w-2xl text-zinc-400">{agent.purpose}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${
              agent.status === "active"
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {agent.status}
          </span>
        </div>

        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-4 mb-8">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-500">Status</div>
            <div className="mt-2 text-2xl font-bold text-white">{agent.status}</div>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-500">Template</div>
            <div className="mt-2 text-2xl font-bold text-blue-400">{agent.templateName}</div>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-500">Total Runs</div>
            <div className="mt-2 text-2xl font-bold text-white">{runs.length}</div>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-500">Created</div>
            <div className="mt-2 text-sm text-zinc-300">{agent.createdAt}</div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <RuntimeStatusCard agentId={agent.id} sessionKey={agent.runtimeSessionKey} />

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="text-lg font-semibold text-white mb-3">Configuration</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Tone</span>
                <span className="text-white">{agent.persona.tone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Style</span>
                <span className="text-white">{agent.persona.style}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Memory</span>
                <span className="text-white">{agent.memory.mode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Channels</span>
                <span className="text-white">{agent.channels.map((c) => c.type).join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Tools</span>
                <span className="text-white">{agent.tools.length > 0 ? agent.tools.join(", ") : "None"}</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 md:col-span-2">
            <h2 className="text-lg font-semibold text-white mb-3">Recent Runs</h2>
            {runs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-zinc-500">
                No runs yet. Fire a trigger to see execution history.
              </div>
            ) : (
              <div className="space-y-2">
                {runs.slice(0, 10).map((run) => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          run.status === "delivered"
                            ? "bg-green-500"
                            : run.status === "failed"
                              ? "bg-red-500"
                              : run.status === "running"
                                ? "bg-blue-500"
                                : "bg-zinc-500"
                        }`}
                      />
                      <span className="text-sm text-white">{run.triggerType}</span>
                      <span className="text-xs text-zinc-500">{run.status}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span>${(run.costCents / 100).toFixed(2)}</span>
                      <span>{run.startedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 md:col-span-2">
            <h2 className="text-lg font-semibold text-white mb-3">System Prompt</h2>
            <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-zinc-400 leading-relaxed">
              {agent.systemPrompt}
            </pre>
          </section>
        </div>
      </main>
    </>
  );
}
