import Link from "next/link";
import { Nav } from "@/components/ui/nav";
import { Footer } from "@/components/ui/footer";

const TIERS = [
  {
    name: "Free Trial",
    price: "Free",
    sub: "Try it out",
    features: [
      "1 agent",
      "~2,000 tokens included",
      "Manual triggers only",
      "Web chat delivery",
      "Basic missions",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Standard Agent",
    price: "$20",
    sub: "/month per agent",
    features: [
      "All trigger types",
      "Telegram, Discord, Slack, WhatsApp",
      "Prepaid usage bucket",
      "Run history & logs",
      "Claude validation on runs",
      "Mission redeployment ($5)",
    ],
    cta: "Get Started",
    highlight: true,
  },
  {
    name: "Pro Add-ons",
    price: "+$10",
    sub: "/month each",
    features: [
      "SMS delivery via Twilio",
      "Voice delivery via ElevenLabs",
      "Webhook triggers",
      "Priority queue execution",
    ],
    cta: "Add to Agent",
    highlight: false,
  },
];

const FAQ = [
  {
    q: "Do I need my own API keys?",
    a: "No. We run Artemis on our infrastructure. You never touch the model directly.",
  },
  {
    q: "What happens when my bucket runs out?",
    a: "Your agents pause automatically. Top up any amount to resume. No surprise charges.",
  },
  {
    q: "Can I change my agent's mission?",
    a: "Yes. Redeployment costs $5 per mission change. Trigger and channel changes are free.",
  },
  {
    q: "What's Claude's role?",
    a: "Claude validates Artemis output before it reaches you. Think of it as quality control. It's built in — no extra cost.",
  },
  {
    q: "Are agents running 24/7?",
    a: "No. Agents are trigger-based. They only execute when a trigger fires (schedule, webhook, or manual). You only pay for actual runs.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white">Pricing</h1>
          <p className="mt-3 text-lg text-zinc-400">
            Simple, predictable pricing. No hidden fees.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {TIERS.map((tier) => (
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

        <section className="mt-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
              >
                <h3 className="mb-2 font-semibold text-white">{item.q}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
