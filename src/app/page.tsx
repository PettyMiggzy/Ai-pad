import Link from "next/link";
import { Nav } from "@/components/ui/nav";
import { Footer } from "@/components/ui/footer";

const FEATURES = [
  {
    icon: "🎯",
    title: "Trigger-Based",
    desc: "Agents run on your schedule — every 15 min, hourly, daily, on webhook, or manual. No wasted compute.",
  },
  {
    icon: "🤖",
    title: "Powered by Artemis",
    desc: "Our custom AI model runs every mission. Claude supervises for quality. You get both, we handle everything.",
  },
  {
    icon: "💰",
    title: "Prepaid Buckets",
    desc: "Load credits, agents deduct per run. When the bucket's empty, agents pause. No surprise bills.",
  },
  {
    icon: "📡",
    title: "Multi-Channel",
    desc: "Deliver results via Telegram, Discord, Slack, WhatsApp, SMS, or Voice. Connect what you use.",
  },
  {
    icon: "🔧",
    title: "No Code Required",
    desc: "Describe the mission in plain English. Pick a trigger. Choose a channel. Done.",
  },
  {
    icon: "⚡",
    title: "Instant Deploy",
    desc: "Agents go live in seconds. Redeploy with a new mission anytime for $5.",
  },
];

const PRICING_TIERS = [
  {
    name: "Free Trial",
    price: "Free",
    sub: "1 agent · ~2,000 tokens",
    features: ["One agent", "Manual triggers only", "Web chat channel", "Basic missions"],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Standard",
    price: "$20",
    sub: "/month per agent",
    features: [
      "Unlimited triggers",
      "All free channels",
      "Prepaid usage bucket",
      "Run history & logs",
      "Mission redeployment ($5)",
    ],
    cta: "Get Started",
    highlight: true,
  },
  {
    name: "Pro Add-ons",
    price: "+$10",
    sub: "/month each",
    features: ["SMS via Twilio", "Voice via ElevenLabs", "Priority execution", "Webhook triggers"],
    cta: "Add to Agent",
    highlight: false,
  },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 text-center sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400">
          <span>⚡</span>
          <span>Powered by Artemis AI</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          AI Agents That
          <span className="block text-blue-500">Work on Command</span>
        </h1>
        <p className="mx-auto max-w-xl text-lg text-zinc-400">
          Create trigger-based AI agents in minutes. No code, no API keys, no
          infrastructure. Just describe the mission and let Artemis handle it.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/dashboard/agents/new"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
          >
            Create Your First Agent
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg border border-zinc-700 px-6 py-3 font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white">How MIT Agents Works</h2>
        <p className="mt-3 text-zinc-400">Everything you need to deploy AI workers. Nothing you don&apos;t.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-zinc-700"
          >
            <div className="mb-3 text-2xl">{f.icon}</div>
            <h3 className="mb-2 text-lg font-semibold text-white">{f.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { n: "1", title: "Describe Your Mission", desc: "Tell us what you want the agent to do in plain English." },
    { n: "2", title: "Set Your Trigger", desc: "Choose when the agent runs — on a schedule, webhook, or manually." },
    { n: "3", title: "Pick Channels", desc: "Connect Telegram, Discord, Slack, WhatsApp, SMS, or Voice." },
    { n: "4", title: "Go Live", desc: "Agent deploys instantly. Artemis executes, Claude validates, you get results." },
  ];

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white">Four Steps to Your First Agent</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {steps.map((s) => (
          <div key={s.n} className="flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
              {s.n}
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-white">{s.title}</h3>
              <p className="text-sm text-zinc-400">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20" id="pricing">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white">Simple Pricing</h2>
        <p className="mt-3 text-zinc-400">No hidden fees. You control exactly what you spend.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-2xl border p-6 ${
              tier.highlight
                ? "border-blue-500/40 bg-blue-950/20"
                : "border-zinc-800 bg-zinc-900/50"
            }`}
          >
            <h3 className="mb-1 text-lg font-semibold text-white">{tier.name}</h3>
            <div className="mb-1">
              <span className="text-3xl font-bold text-white">{tier.price}</span>
              <span className="ml-1 text-sm text-zinc-400">{tier.sub}</span>
            </div>
            <ul className="mb-6 mt-4 space-y-2">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                  <span className="mt-0.5 text-blue-500">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard/agents/new"
              className={`block rounded-lg py-2.5 text-center text-sm font-semibold transition ${
                tier.highlight
                  ? "bg-blue-600 text-white hover:bg-blue-500"
                  : "border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white"
              }`}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h2 className="text-3xl font-bold text-white">Ready to Deploy Your First Agent?</h2>
      <p className="mt-3 text-zinc-400">
        Start free. No credit card required. One agent, on us.
      </p>
      <Link
        href="/dashboard/agents/new"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-500"
      >
        Create Agent — Free
      </Link>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Nav />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </>
  );
}
