import { attachRuntimeToAgent, getAgentDraftById } from "@/lib/db/agents";
import {
  buildArtemisRuntimeConfig,
  type ArtemisRuntimeConfig,
} from "@/lib/runtime/build-config";
import { callOpenClawGateway } from "@/lib/runtime/openclaw-gateway";

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
    const mockResult: ProvisionAgentResult = {
      ok: true,
      mode: "mock",
      agentId,
      runtime,
      sessionKey: `mock:${agentId}`,
      sessionId: `mock-session-${agentId}`,
    };

    await attachRuntimeToAgent({
      agentId,
      sessionKey: mockResult.sessionKey,
      sessionId: mockResult.sessionId,
    });

    return mockResult;
  }

  const created = await callOpenClawGateway<{
    key: string;
    sessionId: string;
  }>({
    method: "sessions.create",
    params: {
      key: `agent:artemis:${agentId}`,
      agentId: "main",
      label: runtime.sessionLabel,
      model: runtime.model,
      message: runtime.initialMessage,
    },
  });

  await attachRuntimeToAgent({
    agentId,
    sessionKey: created.key,
    sessionId: created.sessionId,
  });

  return {
    ok: true,
    mode: "openclaw",
    agentId,
    runtime,
    sessionKey: created.key,
    sessionId: created.sessionId,
  };
}
