"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TRIGGER_OPTIONS = [
  { value: "manual", label: "MANUAL", desc: "Run on demand" },
  { value: "interval", label: "INTERVAL", desc: "Every X minutes" },
  { value: "daily", label: "DAILY", desc: "Once per day at set time" },
  { value: "webhook", label: "WEBHOOK", desc: "On external event" },
];

const CHANNEL_OPTIONS = [
  { value: "webchat", label: "Web Chat", free: true },
  { value: "telegram", label: "Telegram", free: true },
  { value: "discord", label: "Discord", free: true },
  { value: "slack", label: "Slack", free: true },
  { value: "whatsapp", label: "WhatsApp", free: true },
  { value: "sms", label: "SMS", free: false, addon: "+$10/mo" },
  { value: "voice", label: "Voice", free: false, addon: "+$10/mo" },
];

const TONE_OPTIONS = ["Professional", "Friendly", "Casual", "Sharp", "Supportive"];

type Step = "mission" | "trigger" | "channel" | "review";

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`panel ${className}`.trim()}>{children}</div>;
}

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
    setChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  }

  async function handleCreate() {
    if (!name.trim() || !mission.trim()) { setError("Agent name and mission are required"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), purpose: mission.trim(), description: description.trim(),
          persona: { tone: tone.toLowerCase(), style: "clear", proactivity: "low" },
          channels: channels.map(ch => ({ type: ch, enabled: true })),
          tools: ["web_search"],
          knowledge: { urls: [], notes: [] },
          memory: { mode: "explicit_only", allowGroupMemory: false },
          billing: { plan: "tier1", initialBucketTopupCents: 2000, pauseOnZeroBalance: true },
        }),
      });
      const data = await res.json();
      if (data.ok && data.agent?.id) router.push(`/dashboard/agents/${data.agent.id}`);
      else setError(data.error || "Failed to create agent");
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "0.75rem", color: "var(--text)", fontFamily: "var(--raj)", fontSize: "1rem",
    padding: "0.75rem 1rem", outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--gold-soft)",
    letterSpacing: "0.14em", textTransform: "uppercase" as const, display: "block", marginBottom: "0.5rem",
  };

  return (
    <main className="app-shell">
      <div className="noise" />
      <div className="bg-grid" />
      <div className="bg-glow bg-glow-a" />

      <header className="topbar">
        <Link href="/" className="brand" style={{ textDecoration: "none" }}>
          <div className="brand-mark-wrap"><div className="brand-mark" /></div>
          <div>
            <div className="brand-title">AI PAD</div>
            <div className="brand-sub">AGENT DEPLOYMENT</div>
          </div>
        </Link>
        <div className="topbar-actions">
          <Link href="/dashboard" className="btn btn-ghost" style={{ textDecoration: "none" }}>Command Center</Link>
        </div>
      </header>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        {/* Step bar */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
          {(["mission", "trigger", "channel", "review"] as Step[]).map((s, i) => (
            <button key={s} onClick={() => setStep(s)} style={{
              flex: 1, padding: "0.7rem", textAlign: "center", borderRadius: "0.75rem",
              fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase",
              background: step === s ? "rgba(255,184,76,0.1)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${step === s ? "rgba(255,184,76,0.3)" : "rgba(255,255,255,0.06)"}`,
              color: step === s ? "var(--gold)" : "var(--muted-2)", cursor: "pointer",
            }}>
              {i + 1}. {s}
            </button>
          ))}
        </div>

        {/* Mission */}
        {step === "mission" && (
          <Panel>
            <div style={{ padding: "1.75rem", display: "grid", gap: "1.25rem" }}>
              <div>
                <div style={{ fontFamily: "var(--orb)", fontSize: "1.2rem", color: "var(--text)" }}>Define the Mission</div>
                <div style={{ fontFamily: "var(--raj)", fontSize: "0.9rem", color: "var(--muted-2)", marginTop: "0.3rem" }}>What should this agent do? Describe it in plain English.</div>
              </div>
              <div><label style={labelStyle}>Agent Name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Market Monitor" style={inputStyle} /></div>
              <div><label style={labelStyle}>Mission</label><textarea value={mission} onChange={e => setMission(e.target.value)} placeholder="e.g. Monitor ETH price and notify me when it drops below $3,000" rows={4} style={{ ...inputStyle, resize: "vertical" as const }} /></div>
              <div><label style={labelStyle}>Description (optional)</label><input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description for your dashboard" style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>Tone</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {TONE_OPTIONS.map(t => (
                    <button key={t} onClick={() => setTone(t)} style={{
                      padding: "0.5rem 1rem", borderRadius: "999px", cursor: "pointer",
                      fontFamily: "var(--mono)", fontSize: "0.68rem", letterSpacing: "0.1em",
                      background: tone === t ? "rgba(255,184,76,0.12)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${tone === t ? "rgba(255,184,76,0.3)" : "rgba(255,255,255,0.08)"}`,
                      color: tone === t ? "var(--gold)" : "var(--muted-2)",
                    }}>{t}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep("trigger")} className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>Next: Set Trigger →</button>
            </div>
          </Panel>
        )}

        {/* Trigger */}
        {step === "trigger" && (
          <Panel>
            <div style={{ padding: "1.75rem", display: "grid", gap: "1.25rem" }}>
              <div>
                <div style={{ fontFamily: "var(--orb)", fontSize: "1.2rem", color: "var(--text)" }}>Set Trigger</div>
                <div style={{ fontFamily: "var(--raj)", fontSize: "0.9rem", color: "var(--muted-2)", marginTop: "0.3rem" }}>When should this agent execute?</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {TRIGGER_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setTriggerType(opt.value)} style={{
                    padding: "1rem", borderRadius: "1rem", textAlign: "left", cursor: "pointer",
                    background: triggerType === opt.value ? "rgba(255,184,76,0.08)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${triggerType === opt.value ? "rgba(255,184,76,0.3)" : "rgba(255,255,255,0.06)"}`,
                  }}>
                    <div style={{ fontFamily: "var(--orb)", fontSize: "0.8rem", color: triggerType === opt.value ? "var(--gold)" : "var(--text)" }}>{opt.label}</div>
                    <div style={{ fontFamily: "var(--raj)", fontSize: "0.82rem", color: "var(--muted-2)", marginTop: "0.3rem" }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
              {triggerType === "interval" && (
                <div>
                  <label style={labelStyle}>Run Every (minutes)</label>
                  <input type="number" value={intervalMinutes} onChange={e => setIntervalMinutes(Number(e.target.value))} min={15} style={inputStyle} />
                  <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.5rem" }}>
                    {[15, 30, 60, 120, 360].map(m => (
                      <button key={m} onClick={() => setIntervalMinutes(m)} style={{
                        padding: "0.35rem 0.8rem", borderRadius: "999px", cursor: "pointer",
                        fontFamily: "var(--mono)", fontSize: "0.6rem",
                        background: intervalMinutes === m ? "rgba(255,184,76,0.12)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${intervalMinutes === m ? "rgba(255,184,76,0.3)" : "rgba(255,255,255,0.06)"}`,
                        color: intervalMinutes === m ? "var(--gold)" : "var(--muted-2)",
                      }}>{m < 60 ? `${m}m` : `${m / 60}h`}</button>
                    ))}
                  </div>
                </div>
              )}
              {triggerType === "daily" && (
                <div><label style={labelStyle}>Time (24h)</label><input type="time" value={dailyTime} onChange={e => setDailyTime(e.target.value)} style={inputStyle} /></div>
              )}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => setStep("mission")} className="btn btn-ghost" style={{ flex: 1 }}>← Back</button>
                <button onClick={() => setStep("channel")} className="btn btn-primary" style={{ flex: 1 }}>Next: Channels →</button>
              </div>
            </div>
          </Panel>
        )}

        {/* Channel */}
        {step === "channel" && (
          <Panel>
            <div style={{ padding: "1.75rem", display: "grid", gap: "1.25rem" }}>
              <div>
                <div style={{ fontFamily: "var(--orb)", fontSize: "1.2rem", color: "var(--text)" }}>Pick Channels</div>
                <div style={{ fontFamily: "var(--raj)", fontSize: "0.9rem", color: "var(--muted-2)", marginTop: "0.3rem" }}>Where should the agent deliver results?</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {CHANNEL_OPTIONS.map(ch => (
                  <button key={ch.value} onClick={() => toggleChannel(ch.value)} style={{
                    padding: "1rem", borderRadius: "1rem", textAlign: "left", cursor: "pointer",
                    background: channels.includes(ch.value) ? "rgba(127,227,255,0.06)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${channels.includes(ch.value) ? "rgba(127,227,255,0.25)" : "rgba(255,255,255,0.06)"}`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--orb)", fontSize: "0.78rem", color: channels.includes(ch.value) ? "var(--cyan)" : "var(--text)" }}>{ch.label}</span>
                      {!ch.free && <span style={{ fontFamily: "var(--mono)", fontSize: "0.56rem", color: "var(--amber)", padding: "0.2rem 0.5rem", border: "1px solid rgba(255,141,54,0.25)", borderRadius: "999px" }}>{ch.addon}</span>}
                    </div>
                    <div style={{ fontFamily: "var(--raj)", fontSize: "0.8rem", color: "var(--muted-2)", marginTop: "0.25rem" }}>{ch.free ? "Included" : "Premium"}</div>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => setStep("trigger")} className="btn btn-ghost" style={{ flex: 1 }}>← Back</button>
                <button onClick={() => setStep("review")} className="btn btn-primary" style={{ flex: 1 }}>Next: Review →</button>
              </div>
            </div>
          </Panel>
        )}

        {/* Review */}
        {step === "review" && (
          <Panel>
            <div style={{ padding: "1.75rem", display: "grid", gap: "1.25rem" }}>
              <div>
                <div style={{ fontFamily: "var(--orb)", fontSize: "1.2rem", color: "var(--text)" }}>Review &amp; Deploy</div>
                <div style={{ fontFamily: "var(--raj)", fontSize: "0.9rem", color: "var(--muted-2)", marginTop: "0.3rem" }}>Confirm your agent configuration.</div>
              </div>

              <div style={{ display: "grid", gap: "0.75rem" }}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.75rem", padding: "1rem" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.56rem", color: "var(--muted-2)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Agent</div>
                  <div style={{ fontFamily: "var(--orb)", fontSize: "1.1rem", color: "var(--text)", marginTop: "0.35rem" }}>{name || "Unnamed"}</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.75rem", padding: "1rem" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.56rem", color: "var(--muted-2)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Mission</div>
                  <div style={{ fontFamily: "var(--raj)", fontSize: "0.95rem", color: "var(--muted)", marginTop: "0.35rem", whiteSpace: "pre-wrap" }}>{mission || "Not defined"}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                  {[["Tone", tone], ["Trigger", triggerType === "interval" ? `Every ${intervalMinutes}m` : triggerType === "daily" ? `Daily ${dailyTime}` : triggerType], ["Channels", channels.join(", ")]].map(([l, v]) => (
                    <div key={l} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.75rem", padding: "1rem" }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: "0.56rem", color: "var(--muted-2)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{l}</div>
                      <div style={{ fontFamily: "var(--orb)", fontSize: "0.82rem", color: "var(--text)", marginTop: "0.35rem" }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(255,184,76,0.06)", border: "1px solid rgba(255,184,76,0.18)", borderRadius: "0.75rem", padding: "1rem" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.56rem", color: "var(--gold)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Cost</div>
                  <div style={{ fontFamily: "var(--orb)", fontSize: "1.4rem", color: "var(--gold)", marginTop: "0.35rem" }}>$20<span style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--muted-2)" }}>/month</span></div>
                  <div style={{ fontFamily: "var(--raj)", fontSize: "0.85rem", color: "var(--muted-2)", marginTop: "0.25rem" }}>+ usage from prepaid bucket · agents pause at $0</div>
                </div>
              </div>

              {error && (
                <div style={{ background: "rgba(255,51,17,0.08)", border: "1px solid rgba(255,51,17,0.25)", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontFamily: "var(--raj)", fontSize: "0.9rem", color: "#ff6644" }}>
                  {error}
                </div>
              )}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => setStep("channel")} className="btn btn-ghost" style={{ flex: 1 }}>← Back</button>
                <button onClick={handleCreate} disabled={loading} className="btn btn-primary" style={{ flex: 1, opacity: loading ? 0.5 : 1 }}>
                  {loading ? "⏳ Deploying..." : "⚔ Deploy Agent"}
                </button>
              </div>
            </div>
          </Panel>
        )}
      </div>
    </main>
  );
}
