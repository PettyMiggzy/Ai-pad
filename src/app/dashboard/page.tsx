import Link from "next/link";

import { listAgentDrafts } from "@/lib/db/agents";

export default async function DashboardPage() {
  const agents = await listAgentDrafts();

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Dashboard</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">AI Pad agents</h1>
            <p className="mt-2 text-zinc-400">
              Artemis drafts and future live agents will be managed from here.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-900"
          >
            Back to control panel
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Total drafts</p>
            <p className="mt-2 text-4xl font-semibold">{agents.length}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Template</p>
            <p className="mt-2 text-2xl font-semibold">Artemis</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Lifecycle</p>
            <p className="mt-2 text-2xl font-semibold">Draft → Billing → Provision</p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Agent list</h2>
          <div className="space-y-3">
            {agents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 p-5 text-zinc-400">
                No agents yet.
              </div>
            ) : (
              agents.map((agent) => (
                <Link
                  key={agent.id}
                  href={`/dashboard/agents/${agent.id}`}
                  className="block rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-medium">{agent.name}</p>
                      <p className="mt-1 text-sm text-zinc-400">{agent.purpose}</p>
                    </div>
                    <div className="text-right text-xs text-zinc-500">
                      <p>{agent.status}</p>
                      <p className="mt-1">{agent.createdAt}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
