async function getAgentDrafts() {
  try {
    const res = await fetch("http://localhost:3000/api/agents", {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = (await res.json()) as {
      agents?: Array<{ id: string; name: string; purpose: string; createdAt: string }>;
    };

    return data.agents ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const agents = await getAgentDrafts();

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">AI Pad</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Artemis Tier 1 starter is live.
          </h1>
          <p className="max-w-2xl text-lg text-zinc-300">
            Agent drafts now persist locally so we can shape the backend before
            wiring in Supabase, billing, and OpenClaw provisioning.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="font-medium">API route</p>
            <code className="mt-2 block text-sm text-zinc-300">POST /api/agents</code>
            <code className="mt-1 block text-sm text-zinc-300">GET /api/agents</code>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="font-medium">Stored drafts</p>
            <p className="mt-2 text-3xl font-semibold">{agents.length}</p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Recent Artemis drafts</h2>
          <div className="space-y-3">
            {agents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 p-5 text-zinc-400">
                No drafts yet. Hit the API route and the first agent will show up here.
              </div>
            ) : (
              agents.map((agent) => (
                <div
                  key={agent.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-medium">{agent.name}</p>
                      <p className="mt-1 text-sm text-zinc-400">{agent.purpose}</p>
                    </div>
                    <p className="text-xs text-zinc-500">{agent.createdAt}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
