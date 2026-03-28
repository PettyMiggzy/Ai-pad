const pricing = [
  {
    label: "$20",
    sub: "/MONTH PER AGENT",
    desc: "Flat subscription. Your agent stays deployed, reachable, and ready to trigger.",
  },
  {
    label: "PREPAID",
    sub: "USAGE BUCKET",
    desc: "Load credits once. Each execution deducts from balance in real time.",
  },
  {
    label: "$5",
    sub: "PER REDEPLOY",
    desc: "Update the mission anytime. We regenerate and redeploy the agent fast.",
  },
];

const channels = ["Telegram", "Discord", "Slack", "WhatsApp", "SMS", "Voice"];
const missions = [
  "Monitor competitor pricing hourly and alert me when anyone drops below my listed price.",
  "Scan Hacker News every morning and send me a clean AI news briefing.",
  "Watch my store inventory nightly and draft reorder emails when stock gets low.",
  "Track new token launches and notify me when market cap crosses my threshold.",
];

function CoreOrb() {
  return (
    <div className="core-wrap" aria-hidden>
      <div className="core-halo core-halo-1" />
      <div className="core-halo core-halo-2" />
      <div className="core-halo core-halo-3" />
      <div className="core-grid" />
      <div className="core-ring core-ring-1" />
      <div className="core-ring core-ring-2" />
      <div className="core-ring core-ring-3" />
      <div className="core-center">
        <div className="core-center-inner" />
      </div>
      <div className="core-node core-node-1" />
      <div className="core-node core-node-2" />
      <div className="core-node core-node-3" />
      <div className="core-node core-node-4" />
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="panel">{children}</div>;
}

export default function Home() {
  return (
    <main className="app-shell">
      <div className="bg-grid" />
      <div className="bg-glow bg-glow-a" />
      <div className="bg-glow bg-glow-b" />

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" />
          <div>
            <div className="brand-title">AI PAD</div>
            <div className="brand-sub">AGENT COMMAND SYSTEM</div>
          </div>
        </div>

        <div className="topbar-status">
          <div>
            <span>SYSTEM</span>
            <strong>ONLINE</strong>
          </div>
          <div>
            <span>MODELS</span>
            <strong>GPT-4o + QA</strong>
          </div>
          <div>
            <span>UPTIME</span>
            <strong>99.9%</strong>
          </div>
        </div>

        <div className="topbar-actions">
          <button className="btn btn-ghost">Access</button>
          <button className="btn btn-primary">Initialize</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">ORIGINAL AGENT OPERATING PLATFORM</div>
          <h1>
            Deploy your own <span>AI agent</span>
          </h1>
          <p>
            Describe the mission. Launch the agent. Talk to it through your favorite channel.
            Subscription plus prepaid usage, with your command center handling the rest.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary">Initialize Agent</button>
            <button className="btn btn-ghost">View Command Center</button>
          </div>

          <div className="hero-stats">
            <div>
              <strong>Trigger-based</strong>
              <span>Not always-on</span>
            </div>
            <div>
              <strong>Fast deploys</strong>
              <span>Mission to runtime</span>
            </div>
            <div>
              <strong>Usage control</strong>
              <span>Prepaid balance caps</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <CoreOrb />
        </div>
      </section>

      <section className="terminal-wrap">
        <Panel>
          <div className="terminal-head">
            <span className="terminal-dot" />
            <span>MISSION INPUT</span>
            <span className="terminal-path">/runtime/jarvis/core</span>
          </div>
          <div className="terminal-body">
            {missions.map((mission, i) => (
              <p key={i}>
                <span>&gt;</span> {mission}
              </p>
            ))}
          </div>
        </Panel>
      </section>

      <section className="pricing">
        <div className="section-head">
          <span />
          <p>MISSION PRICING</p>
        </div>
        <div className="pricing-grid">
          {pricing.map((item) => (
            <Panel key={item.label}>
              <div className="price-card">
                <h3>{item.label}</h3>
                <small>{item.sub}</small>
                <p>{item.desc}</p>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <section className="channels-wrap">
        <p className="channels-label">CHANNEL ACCESS</p>
        <div className="channels-grid">
          {channels.map((channel) => (
            <div key={channel} className="channel-chip">
              {channel}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
