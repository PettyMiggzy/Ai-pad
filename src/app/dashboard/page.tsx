import Link from "next/link";

import { Nav } from "@/components/ui/nav";
import { listAgentDrafts } from "@/lib/db/agents";

export default async function DashboardPage() {
  const agents = await listAgentDrafts();

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-zinc-400">Manage your Artemis-powered agents.</p>
          </div>
          <Link
            href="/dashboard/agents/new"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            + New Agent
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-500">Total Agents</div>
            <div className="mt-2 text-4xl font-bold text-white">{agents.length}</div>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-500">Active</div>
            <div className="mt-2 text-4xl font-bold text-green-400">
              {agents.filter((a) => a.status === "active").length}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-500">Template</div>
            <div className="mt-2 text-2xl font-bold text-blue-400">Artemis</div>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Agents</h2>
          {agents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center">
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-zinc-400 mb-4">No agents yet. Create your first one.</div>
              <Link
                href="/dashboard/agents/new"
                className="inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Create Agent
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {agents.map((agent) => (
                <Link
                  key={agent.id}
                  href={`/dashboard/agents/${agent.id}`}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-white group-hover:text-blue-400 transition">
                        {agent.name}
                      </div>
                      <div className="mt-1 text-sm text-zinc-400 line-clamp-2">
                        {agent.purpose}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        agent.status === "active"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                    <span>{agent.channels.map((c) => c.type).join(", ")}</span>
                    <span>·</span>
                    <span>{agent.createdAt}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
