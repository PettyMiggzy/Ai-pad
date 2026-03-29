const pricing = [
  {
    label: "$20",
    sub: "/MONTH PER AGENT",
    desc: "Flat subscription for a deployed agent that stays reachable, managed, and ready to execute.",
  },
  {
    label: "PREPAID",
    sub: "USAGE BUCKET",
    desc: "Execution costs deduct from your loaded balance in real time, so nothing runs wild.",
  },
  {
    label: "$5",
    sub: "PER REDEPLOY",
    desc: "Change the mission anytime and relaunch fast without rebuilding your whole setup.",
  },
];

const channels = ["Telegram", "Discord", "Slack", "WhatsApp", "SMS", "Voice"];
const missionRows = [
  "Monitor competitor pricing hourly and alert me when any product drops below my threshold.",
  "Scan Hacker News each morning and deliver a clean AI market briefing to Telegram.",
  "Watch store inventory nightly and draft reorder emails when any SKU falls too low.",
  "Track token launches and notify me the second market cap crosses my target band.",
];

const metrics = [
  { label: "Runtime", value: "OpenClaw" },
  { label: "Primary", value: "GPT-4o" },
  { label: "QA Layer", value: "Jarvis" },
  { label: "Channels", value: "6" },
];

function CoreOrb() {
  return (
    <div className="core-scene" aria-hidden>
      <div className="core-aura core-aura-1" />
      <div className="core-aura core-aura-2" />
      <div className="core-aura core-aura-3" />
      <div className="core-radar" />
      <div className="core-grid" />
      <div className="core-ring core-ring-1" />
      <div className="core-ring core-ring-2" />
      <div className="core-ring core-ring-3" />
      <div className="core-ring core-ring-4" />
      <div className="core-center-shell">
        <div className="core-center-glow" />
        <div className="core-center-heart" />
      </div>
      <div className="core-node core-node-1" />
      <div className="core-node core-node-2" />
      <div className="core-node core-node-3" />
      <div className="core-node core-node-4" />
      <div className="core-beam core-beam-h" />
      <div className="core-beam core-beam-v" />
    </div>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`panel ${className}`.trim()}>{children}</div>;
}

export default function Home() {
  return (
    <main className="app-shell">
      <div className="noise" />
      <div className="bg-grid" />
      <div className="bg-glow bg-glow-a" />
      <div className="bg-glow bg-glow-b" />
      <div className="bg-glow bg-glow-c" />

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark-wrap">
            <div className="brand-mark" />
          </div>
          <div>
            <div className="brand-title">AI PAD</div>
            <div className="brand-sub">AGENT OPERATING LAYER</div>
          </div>
        </div>

        <div className="topbar-status">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>

        <div className="topbar-actions">
          <button className="btn btn-ghost">Access</button>
          <button className="btn btn-primary">Initialize</button>
        </div>
      </header>

      <section className="hero-shell">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow-row">
              <span className="eyebrow-dot" />
              <span className="eyebrow">POWERED BY OPENCLAW RUNTIME</span>
            </div>

            <h1>
              Build a <span>real agent</span>, not a chatbot wrapper.
            </h1>

            <p className="hero-text">
              Describe the mission in plain English. Jarvis supervises execution, routing,
              delivery, and cost control while your agent runs through a premium command layer.
            </p>

            <div className="hero-actions">
              <button className="btn btn-primary">Initialize Agent</button>
              <button className="btn btn-ghost">View Command Center</button>
            </div>

            <div className="hero-microcopy">
              <span>Jarvis-supervised execution</span>
              <span>Cost-aware orchestration</span>
              <span>Multi-channel delivery</span>
            </div>
          </div>

          <div className="hero-visual-wrap">
            <div className="visual-frame">
              <div className="visual-frame-top">
                <span>JARVIS CORE</span>
                <span>RUNTIME ONLINE</span>
              </div>
              <CoreOrb />
              <div className="visual-readouts visual-readout-left">
                <label>MODEL ROUTING</label>
                <strong>GPT-4o → VERIFIED</strong>
                <small>Fallback, cost, and output supervision active</small>
              </div>
              <div className="visual-readouts visual-readout-right">
                <label>CHANNEL GRID</label>
                <strong>TELEGRAM · DISCORD · SMS</strong>
                <small>Voice and premium channels attach on demand</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="metrics-band-wrap">
        <div className="metrics-band">
          <div>
            <strong>Trigger-based</strong>
            <span>Agents only run when needed, not 24/7.</span>
          </div>
          <div>
            <strong>Usage protected</strong>
            <span>Prepaid bucket and execution caps prevent burn.</span>
          </div>
          <div>
            <strong>Operator-grade</strong>
            <span>Designed like infrastructure, not prompt candy.</span>
          </div>
        </div>
      </section>

      <section className="terminal-wrap">
        <Panel className="terminal-panel">
          <div className="terminal-head">
            <div className="terminal-head-left">
              <span className="terminal-dot" />
              <span>MISSION INPUT</span>
            </div>
            <span className="terminal-path">/runtime/openclaw/jarvis-core</span>
          </div>
          <div className="terminal-body">
            {missionRows.map((mission, i) => (
              <p key={i}>
                <span>&gt;</span> {mission}
              </p>
            ))}
          </div>
        </Panel>
      </section>

      <section className="pricing-wrap">
        <div className="section-head">
          <span />
          <p>MISSION PRICING</p>
        </div>
        <div className="pricing-grid">
          {pricing.map((item) => (
            <Panel key={item.label} className="price-panel">
              <div className="price-card">
                <small>{item.sub}</small>
                <h3>{item.label}</h3>
                <p>{item.desc}</p>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <section className="channels-wrap">
        <div className="section-head section-head-tight">
          <span />
          <p>CHANNEL ACCESS</p>
        </div>
        <div className="channels-grid">
          {channels.map((channel) => (
            <div key={channel} className="channel-chip">
              {channel}
            </div>
          ))}
        </div>
      </section>

      <footer className="footer-bar">
        <div className="footer-pill">Powered by OpenClaw Runtime</div>
        <div className="footer-text">AI PAD · JARVIS SUPERVISED AGENT EXECUTION</div>
      </footer>
    </main>
  );
}
