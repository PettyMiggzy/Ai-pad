import Link from "next/link";

import { CreateAgentForm } from "@/components/agents/create-agent-form";
import { isStripeConfigured } from "@/lib/billing/stripe";
import { isSupabaseConfigured } from "@/lib/db/server";

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
  const supabaseReady = isSupabaseConfigured();
  const stripeReady = isStripeConfigured();
  const openClawReady = Boolean(process.env.OPENCLAW_GATEWAY_URL);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">AI Pad</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Artemis Tier 1 control panel
          </h1>
          <p className="max-w-3xl text-lg text-zinc-300">
            The first browser-side flow is live. You can now create Artemis drafts,
            price them, and provision runtime sessions while we keep building the
            full hosted agent platform.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <CreateAgentForm />

          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Draft count
              </p>
              <p className="mt-2 text-4xl font-semibold">{agents.length}</p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="font-medium">Storage mode</p>
              <p className="mt-2 text-sm text-zinc-300">
                {supabaseReady ? "Supabase configured" : "Local JSON fallback"}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="font-medium">Billing mode</p>
              <p className="mt-2 text-sm text-zinc-300">
                {stripeReady ? "Stripe configured" : "Mock checkout mode"}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="font-medium">Runtime mode</p>
              <p className="mt-2 text-sm text-zinc-300">
                {openClawReady ? "OpenClaw gateway connected" : "Mock provisioning mode"}
              </p>
              <p className="mt-2 text-xs text-zinc-500">Runtime profile: artemis-tier1</p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="font-medium">Quick links</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
                >
                  Dashboard
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="font-medium">API routes</p>
              <code className="mt-2 block text-sm text-zinc-300">GET /api/agents</code>
              <code className="mt-1 block text-sm text-zinc-300">POST /api/agents</code>
              <code className="mt-1 block text-sm text-zinc-300">POST /api/billing/checkout</code>
              <code className="mt-1 block text-sm text-zinc-300">POST /api/runtime/provision</code>
            </div>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Recent Artemis drafts</h2>
          <div className="space-y-3">
            {agents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 p-5 text-zinc-400">
                No drafts yet. Create one from the form above.
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
