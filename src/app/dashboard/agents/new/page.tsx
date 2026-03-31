"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/ui/nav";

const TRIGGER_OPTIONS = [
  { value: "manual", label: "Manual", desc: "Run on demand" },
  { value: "interval", label: "Interval", desc: "Every X minutes" },
  { value: "daily", label: "Daily", desc: "Once per day at set time" },
  { value: "webhook", label: "Webhook", desc: "On external event" },
];

const CHANNEL_OPTIONS = [
  { value: "webchat", label: "Web Chat", free: true },
  { value: "telegram", label: "Telegram", free: true },
  { value: "discord", label: "Discord", free: true },
  { value: "slack", label: "Slack", free: true },
  { value: "whatsapp", label: "WhatsApp", free: true },
  { value: "sms", label: "SMS", free: false, addon: "$10/mo" },
  { value: "voice", label: "Voice", free: false, addon: "$10/mo" },
];

const TONE_OPTIONS = ["Professional", "Friendly", "Casual", "Sharp", "Supportive"];

type Step = "mission" | "trigger" | "channel" | "review";

export default function NewAgentPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("mission");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [mission, setMission] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("Professional");

  const [triggerType, setTriggerType] = useState("manual");
  const [intervalMinutes, setIntervalMinutes] = useState(60);
  const [dailyTime, setDailyTime] = useState("09:00");

  const [channels, setChannels] = useState<string[]>(["webchat"]);

  function toggleChannel(ch: string) {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch],
    );
  }

  async function handleCreate() {
    if (!name.trim() || !mission.trim()) {
      setError("Agent name and mission are required");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          purpose: mission.trim(),
          description: description.trim(),
          persona: { tone: tone.toLowerCase(), style: "clear", proactivity: "low" },
          channels: channels.map((ch) => ({ type: ch, enabled: true })),
          tools: ["web_search"],
          knowledge: { urls: [], notes: [] },
          memory: { mode: "explicit_only", allowGroupMemory: false },
          billing: {
            plan: "tier1",
            initialBucketTopupCents: 2000,
            pauseOnZeroBalance: true,
          },
        }),
      });

      const data = await res.json();

      if (data.ok && data.agent?.id) {
        router.push(`/dashboard/agents/${data.agent.id}`);
      } else {
        setError(data.error || "Failed to create agent");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-300 transition">
            ← Dashboard
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-white">Create Agent</h1>
          <p className="mt-1 text-zinc-400">
            Set up a new Artemis-powered agent in four steps.
          </p>
        </div>

        {/* Step indicators */}
        <div className="mb-8 flex gap-2">
          {(["mission", "trigger", "channel", "review"] as Step[]).map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`flex-1 rounded-lg border py-2 text-center text-xs font-semibold uppercase tracking-wider transition ${
                step === s
                  ? "border-blue-500/40 bg-blue-950/30 text-blue-400"
                  : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>

        {/* Step: Mission */}
        {step === "mission" && (
          <div className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Define the Mission</h2>
              <p className="mt-1 text-sm text-zinc-400">
                What should this agent do? Describe it in plain English.
              </p>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-300">Agent Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Market Monitor"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white outline-none focus:border-blue-500/50"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-300">Mission</span>
              <textarea
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="e.g. Monitor ETH price and notify me when it drops below $3,000 or rises above $4,000"
                rows={4}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white outline-none focus:border-blue-500/50"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-300">
                Description <span className="text-zinc-500">(optional)</span>
              </span>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description for your dashboard"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white outline-none focus:border-blue-500/50"
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium text-zinc-300">Tone</span>
              <div className="flex flex-wrap gap-2">
                {TONE_OPTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                      tone === t
                        ? "border-blue-500/40 bg-blue-950/30 text-blue-400"
                        : "border-zinc-700 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep("trigger")}
              className="w-full rounded-xl bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-500"
            >
              Next: Set Trigger →
            </button>
          </div>
        )}

        {/* Step: Trigger */}
        {step === "trigger" && (
          <div className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Set Trigger</h2>
              <p className="mt-1 text-sm text-zinc-400">
                When should this agent execute its mission?
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {TRIGGER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTriggerType(opt.value)}
                  className={`rounded-xl border p-4 text-left transition ${
                    triggerType === opt.value
                      ? "border-blue-500/40 bg-blue-950/20"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="font-semibold text-white">{opt.label}</div>
                  <div className="mt-1 text-sm text-zinc-400">{opt.desc}</div>
                </button>
              ))}
            </div>

            {triggerType === "interval" && (
              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-300">
                  Run every (minutes)
                </span>
                <input
                  type="number"
                  value={intervalMinutes}
                  onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                  min={15}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white outline-none focus:border-blue-500/50"
                />
                <div className="flex gap-2">
                  {[15, 30, 60, 120, 360].map((m) => (
                    <button
                      key={m}
                      onClick={() => setIntervalMinutes(m)}
                      className={`rounded-lg border px-3 py-1 text-xs ${
                        intervalMinutes === m
                          ? "border-blue-500/40 bg-blue-950/30 text-blue-400"
                          : "border-zinc-700 text-zinc-400"
                      }`}
                    >
                      {m < 60 ? `${m}m` : `${m / 60}h`}
                    </button>
                  ))}
                </div>
              </label>
            )}

            {triggerType === "daily" && (
              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-300">Time (24h)</span>
                <input
                  type="time"
                  value={dailyTime}
                  onChange={(e) => setDailyTime(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white outline-none focus:border-blue-500/50"
                />
              </label>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("mission")}
                className="flex-1 rounded-xl border border-zinc-700 py-2.5 text-sm font-semibold text-zinc-300 transition hover:text-white"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep("channel")}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-500"
              >
                Next: Pick Channels →
              </button>
            </div>
          </div>
        )}

        {/* Step: Channel */}
        {step === "channel" && (
          <div className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Pick Channels</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Where should the agent deliver results?
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {CHANNEL_OPTIONS.map((ch) => (
                <button
                  key={ch.value}
                  onClick={() => toggleChannel(ch.value)}
                  className={`rounded-xl border p-4 text-left transition ${
                    channels.includes(ch.value)
                      ? "border-blue-500/40 bg-blue-950/20"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{ch.label}</span>
                    {!ch.free && (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400 border border-amber-500/20">
                        {ch.addon}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-zinc-400">
                    {ch.free ? "Included" : "Premium add-on"}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("trigger")}
                className="flex-1 rounded-xl border border-zinc-700 py-2.5 text-sm font-semibold text-zinc-300 transition hover:text-white"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep("review")}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-500"
              >
                Next: Review →
              </button>
            </div>
          </div>
        )}

        {/* Step: Review */}
        {step === "review" && (
          <div className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Review & Deploy</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Confirm your agent configuration before deploying.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="text-xs uppercase tracking-wider text-zinc-500">Agent</div>
                <div className="mt-1 text-lg font-semibold text-white">{name || "Unnamed"}</div>
                {description && <div className="mt-1 text-sm text-zinc-400">{description}</div>}
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="text-xs uppercase tracking-wider text-zinc-500">Mission</div>
                <div className="mt-1 text-sm text-zinc-300 whitespace-pre-wrap">
                  {mission || "No mission defined"}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="text-xs uppercase tracking-wider text-zinc-500">Tone</div>
                  <div className="mt-1 text-sm font-medium text-white">{tone}</div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="text-xs uppercase tracking-wider text-zinc-500">Trigger</div>
                  <div className="mt-1 text-sm font-medium text-white">
                    {triggerType === "interval" ? `Every ${intervalMinutes}m` : triggerType === "daily" ? `Daily at ${dailyTime}` : triggerType}
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="text-xs uppercase tracking-wider text-zinc-500">Channels</div>
                  <div className="mt-1 text-sm font-medium text-white">
                    {channels.length > 0 ? channels.join(", ") : "None"}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-blue-500/20 bg-blue-950/10 p-4">
                <div className="text-xs uppercase tracking-wider text-blue-400">Cost</div>
                <div className="mt-1 text-lg font-semibold text-white">$20/month</div>
                <div className="mt-1 text-sm text-zinc-400">
                  + usage from prepaid bucket · agents pause at $0
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("channel")}
                className="flex-1 rounded-xl border border-zinc-700 py-2.5 text-sm font-semibold text-zinc-300 transition hover:text-white"
              >
                ← Back
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Deploying..." : "⚡ Deploy Agent"}
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
