export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-3xl space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">AI Pad</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Artemis Tier 1 starter is live.
        </h1>
        <p className="text-lg text-zinc-300">
          This app now has the first backend route for creating an Artemis agent
          draft. Next up is wiring database persistence, billing, and OpenClaw
          provisioning.
        </p>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="font-medium">Test route</p>
          <code className="mt-2 block text-sm text-zinc-300">
            POST /api/agents
          </code>
        </div>
      </div>
    </main>
  );
}
