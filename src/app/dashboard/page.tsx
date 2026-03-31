import Link from "next/link";
import { listAgentDrafts } from "@/lib/db/agents";

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`panel ${className}`.trim()}>{children}</div>;
}

export default async function DashboardPage() {
  const agents = await listAgentDrafts();

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
            <div className="brand-sub">COMMAND CENTER</div>
          </div>
        </Link>
        <div className="topbar-actions">
          <Link href="/dashboard/agents/new" className="btn btn-primary" style={{ textDecoration: "none" }}>
            + Deploy Agent
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div className="section-head" style={{ marginBottom: "1.5rem" }}>
          <span />
          <p>AGENT FLEET</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          <Panel>
            <div style={{ padding: "1.4rem" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--muted-2)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Total Agents</div>
              <div style={{ fontFamily: "var(--orb)", fontSize: "2.4rem", color: "var(--gold)", marginTop: "0.5rem" }}>{agents.length}</div>
            </div>
          </Panel>
          <Panel>
            <div style={{ padding: "1.4rem" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--muted-2)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Active</div>
              <div style={{ fontFamily: "var(--orb)", fontSize: "2.4rem", color: "var(--cyan)", marginTop: "0.5rem" }}>{agents.filter(a => a.status === "active").length}</div>
            </div>
          </Panel>
          <Panel>
            <div style={{ padding: "1.4rem" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--muted-2)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Core Model</div>
              <div style={{ fontFamily: "var(--orb)", fontSize: "1.6rem", color: "var(--gold-soft)", marginTop: "0.5rem" }}>Armetius</div>
            </div>
          </Panel>
        </div>

        {agents.length === 0 ? (
          <Panel>
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🤖</div>
              <div style={{ fontFamily: "var(--raj)", fontSize: "1.1rem", color: "var(--muted)", marginBottom: "1.5rem" }}>
                No agents deployed yet. Initialize your first one.
              </div>
              <Link href="/dashboard/agents/new" className="btn btn-primary" style={{ textDecoration: "none" }}>
                Initialize Agent
              </Link>
            </div>
          </Panel>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {agents.map(agent => (
              <Link key={agent.id} href={`/dashboard/agents/${agent.id}`} style={{ textDecoration: "none" }}>
                <Panel>
                  <div style={{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontFamily: "var(--orb)", fontSize: "1rem", color: "var(--text)", letterSpacing: "0.02em" }}>{agent.name}</div>
                      <div style={{ fontFamily: "var(--raj)", fontSize: "0.9rem", color: "var(--muted-2)", marginTop: "0.35rem", maxWidth: "36rem" }}>{agent.purpose}</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--muted-2)", marginTop: "0.5rem", letterSpacing: "0.1em" }}>
                        {agent.channels.map(c => c.type).join(" · ")} · {agent.createdAt}
                      </div>
                    </div>
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase",
                      padding: "0.3rem 0.7rem", borderRadius: "999px",
                      background: agent.status === "active" ? "rgba(127,227,255,0.1)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${agent.status === "active" ? "rgba(127,227,255,0.25)" : "rgba(255,255,255,0.08)"}`,
                      color: agent.status === "active" ? "var(--cyan)" : "var(--muted-2)",
                    }}>
                      {agent.status}
                    </span>
                  </div>
                </Panel>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
