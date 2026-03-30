import { getAgentDraftById } from "@/lib/db/agents";
import { callOpenClawGateway } from "@/lib/runtime/openclaw-gateway";

export interface SendAgentMessageResult {
  ok: true;
  mode: "mock" | "openclaw";
  sessionKey: string;
  message: string;
}

export async function sendMessageToAgent(params: {
  agentId: string;
  message: string;
}): Promise<SendAgentMessageResult> {
  const agent = await getAgentDraftById(params.agentId);

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
      sessionKey: agent.runtimeSessionKey,
      message: params.message,
    };
  }

  await callOpenClawGateway({
    method: "sessions.send",
    params: {
      sessionKey: agent.runtimeSessionKey,
      message: params.message,
    },
  });

  return {
    ok: true,
    mode: "openclaw",
    sessionKey: agent.runtimeSessionKey,
    message: params.message,
  };
}
