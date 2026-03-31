import { getAgentDraftById } from "@/lib/db/agents";
import { callOpenClawGateway } from "@/lib/runtime/openclaw-gateway";

export interface AgentLifecycleResult {
  ok: true;
  mode: "mock" | "openclaw";
  agentId: string;
  sessionKey: string;
  action: "pause" | "resume";
}

export async function pauseAgentRuntime(agentId: string): Promise<AgentLifecycleResult> {
  const agent = await getAgentDraftById(agentId);

  if (!agent?.runtimeSessionKey) {
    throw new Error("Agent has no runtime session yet");
  }

  if (!process.env.OPENCLAW_GATEWAY_URL) {
    return {
      ok: true,
      mode: "mock",
      agentId,
      sessionKey: agent.runtimeSessionKey,
      action: "pause",
    };
  }

  await callOpenClawGateway({
    method: "sessions.patch",
    params: {
      key: agent.runtimeSessionKey,
      sendPolicy: "deny",
      label: `${agent.name} runtime (paused)`,
    },
  });

  return {
    ok: true,
    mode: "openclaw",
    agentId,
    sessionKey: agent.runtimeSessionKey,
    action: "pause",
  };
}

export async function resumeAgentRuntime(agentId: string): Promise<AgentLifecycleResult> {
  const agent = await getAgentDraftById(agentId);

  if (!agent?.runtimeSessionKey) {
    throw new Error("Agent has no runtime session yet");
  }

  if (!process.env.OPENCLAW_GATEWAY_URL) {
    return {
      ok: true,
      mode: "mock",
      agentId,
      sessionKey: agent.runtimeSessionKey,
      action: "resume",
    };
  }

  await callOpenClawGateway({
    method: "sessions.patch",
    params: {
      key: agent.runtimeSessionKey,
      sendPolicy: "auto",
      label: `${agent.name} runtime`,
    },
  });

  return {
    ok: true,
    mode: "openclaw",
    agentId,
    sessionKey: agent.runtimeSessionKey,
    action: "resume",
  };
}
