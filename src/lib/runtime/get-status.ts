import { getAgentDraftById } from "@/lib/db/agents";
import { callOpenClawGateway } from "@/lib/runtime/openclaw-gateway";

export interface AgentRuntimeStatusResult {
  ok: true;
  mode: "mock" | "openclaw";
  agentId: string;
  sessionKey: string;
  connected: boolean;
  status: string;
  raw?: unknown;
}

export async function getAgentRuntimeStatus(agentId: string): Promise<AgentRuntimeStatusResult> {
  const agent = await getAgentDraftById(agentId);

  if (!agent) {
    throw new Error("Agent not found");
  }

  if (!agent.runtimeSessionKey) {
    throw new Error("Agent has no runtime session yet");
  }

  if (!process.env.OPENCLAW_GATEWAY_URL) {
    return {
      ok: true,
      mode: "mock",
      agentId,
      sessionKey: agent.runtimeSessionKey,
      connected: true,
      status: "mock-active",
    };
  }

  const result = await callOpenClawGateway<{
    sessionKey?: string;
    status?: string;
    sessionId?: string;
  }>({
    method: "sessions.resolve",
    params: {
      key: agent.runtimeSessionKey,
    },
  });

  return {
    ok: true,
    mode: "openclaw",
    agentId,
    sessionKey: agent.runtimeSessionKey,
    connected: Boolean(result?.sessionKey),
    status: result?.status ?? "unknown",
    raw: result,
  };
}
