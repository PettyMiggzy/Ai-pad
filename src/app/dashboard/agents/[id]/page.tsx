import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgentDraftById } from "@/lib/db/agents";
import { listRunsForAgent } from "@/lib/db/runs";

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`panel ${className}`.trim()}>{children}</div>;
}

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = await getAgentDraftById(id);
  if (!agent) notFound();

  const runs = await listRunsForAgent(agent.id);

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
            <div className="brand-sub">AGENT DETAIL</div>
          </div>
        </Link>
        <div className="topbar-actions">
          <Link href="/dashboard" className="btn btn-ghost" style={{ textDecoration: "none" }}>Command Center</Link>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
          <div>
            <Link href="/dashboard" style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--muted-2)", textDecoration: "none", letterSpacing: "0.1em" }}>← COMMAND CENTER</Link>
            <div style={{ fontFamily: "var(--orb)", fontSize: "1.8rem", color: "var(--text)", marginTop: "0.5rem" }}>{agent.name}</div>
            <div style={{ fontFamily: "var(--raj)", fontSize: "1rem", color: "var(--muted)", marginTop: "0.3rem", maxWidth: "36rem" }}>{agent.purpose}</div>
          </div>
          <span style={{
            fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "0.4rem 0.8rem", borderRadius: "999px",
            background: agent.status === "active" ? "rgba(127,227,255,0.1)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${agent.status === "active" ? "rgba(127,227,255,0.25)" : "rgba(255,255,255,0.08)"}`,
            color: agent.status === "active" ? "var(--cyan)" : "var(--muted-2)",
          }}>{agent.status}</span>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "2rem" }}>
          {[
            ["Status", agent.status, "var(--cyan)"],
            ["Template", agent.templateName, "var(--gold)"],
            ["Runs", String(runs.length), "var(--text)"],
            ["Created", agent.createdAt, "var(--muted)"],
          ].map(([label, value, color]) => (
            <Panel key={label}>
              <div style={{ padding: "1.1rem" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.56rem", color: "var(--muted-2)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</div>
                <div style={{ fontFamily: label === "Created" ? "var(--mono)" : "var(--orb)", fontSize: label === "Created" ? "0.72rem" : "1.3rem", color, marginTop: "0.4rem" }}>{value}</div>
              </div>
            </Panel>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          {/* Runtime */}
          <Panel>
            <div style={{ padding: "1.25rem" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--gold-soft)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Runtime</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--muted-2)", lineHeight: 1.8 }}>
                <div>Session: <span style={{ color: "var(--cyan-soft)" }}>{agent.runtimeSessionKey ?? "Not provisioned"}</span></div>
              </div>
            </div>
          </Panel>

          {/* Config */}
          <Panel>
            <div style={{ padding: "1.25rem" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--gold-soft)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Configuration</div>
              <div style={{ fontFamily: "var(--raj)", fontSize: "0.88rem", color: "var(--muted)", lineHeight: 2 }}>
                {[
                  ["Tone", agent.persona.tone],
                  ["Style", agent.persona.style],
                  ["Memory", agent.memory.mode],
                  ["Channels", agent.channels.map(c => c.type).join(", ")],
                  ["Tools", agent.tools.length > 0 ? agent.tools.join(", ") : "None"],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--muted-2)" }}>{l}</span>
                    <span style={{ color: "var(--text)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>

        {/* Runs */}
        <Panel>
          <div style={{ padding: "1.25rem" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--gold-soft)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Recent Runs</div>
            {runs.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", fontFamily: "var(--raj)", fontSize: "0.95rem", color: "var(--muted-2)" }}>
                No runs yet. Fire a trigger to see execution history.
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {runs.slice(0, 10).map(run => (
                  <div key={run.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "0.75rem 1rem", borderRadius: "0.75rem",
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{
                        width: "0.5rem", height: "0.5rem", borderRadius: "999px",
                        background: run.status === "delivered" ? "var(--cyan)" : run.status === "failed" ? "#ff4444" : run.status === "running" ? "var(--gold)" : "var(--muted-2)",
                      }} />
                      <span style={{ fontFamily: "var(--orb)", fontSize: "0.72rem", color: "var(--text)" }}>{run.triggerType}</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--muted-2)", letterSpacing: "0.08em" }}>{run.status}</span>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--muted-2)" }}>
                      <span>${(run.costCents / 100).toFixed(2)}</span>
                      <span>{run.startedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>

        {/* System Prompt */}
        <Panel className="mt-4">
          <div style={{ padding: "1.25rem", marginTop: "1rem" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--gold-soft)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.75rem" }}>System Prompt</div>
            <pre style={{ fontFamily: "var(--mono)", fontSize: "0.76rem", color: "var(--muted)", lineHeight: 1.7, whiteSpace: "pre-wrap", overflowX: "auto" }}>
              {agent.systemPrompt}
            </pre>
          </div>
        </Panel>
      </div>
    </main>
  );
}
