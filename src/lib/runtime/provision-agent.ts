import { getAgentDraftById } from "@/lib/db/agents";
import {
  buildArtemisRuntimeConfig,
  type ArtemisRuntimeConfig,
} from "@/lib/runtime/build-config";

export interface ProvisionAgentResult {
  ok: true;
  mode: "mock" | "openclaw";
  agentId: string;
  runtime: ArtemisRuntimeConfig;
  sessionKey: string;
  sessionId: string;
}

function isOpenClawProvisioningConfigured() {
  return Boolean(process.env.OPENCLAW_GATEWAY_URL);
}

export async function provisionAgentRuntime(agentId: string): Promise<ProvisionAgentResult> {
  const agent = await getAgentDraftById(agentId);

  if (!agent) {
    throw new Error("Agent not found");
  }

  const runtime = buildArtemisRuntimeConfig(agent);

  if (!isOpenClawProvisioningConfigured()) {
    return {
      ok: true,
      mode: "mock",
      agentId,
      runtime,
      sessionKey: `mock:${agentId}`,
      sessionId: `mock-session-${agentId}`,
    };
  }

  return {
    ok: true,
    mode: "openclaw",
    agentId,
    runtime,
    sessionKey: `openclaw:${agentId}`,
    sessionId: `openclaw-session-${agentId}`,
  };
}
