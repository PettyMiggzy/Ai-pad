import { getAgentDraftById } from "@/lib/db/agents";
import { createRun, updateRunStatus } from "@/lib/db/runs";
import { sendMessageToAgent } from "@/lib/runtime/send-message";
import type { TriggerType } from "@/types/mission";

export async function executeAgentTrigger(params: {
  agentId: string;
  triggerType: TriggerType;
}) {
  const agent = await getAgentDraftById(params.agentId);

  if (!agent) {
    throw new Error("Agent not found");
  }

  const run = await createRun({
    agentId: params.agentId,
    triggerType: params.triggerType,
    costCents: 5,
  });

  await updateRunStatus({ runId: run.id, status: "running" });

  const message = `Trigger fired for ${agent.name}. Execute the configured mission now and prepare a response for delivery.`;

  await sendMessageToAgent({
    agentId: params.agentId,
    message,
  });

  await updateRunStatus({
    runId: run.id,
    status: "delivered",
    costCents: 5,
  });

  return {
    ok: true,
    runId: run.id,
    agentId: params.agentId,
    triggerType: params.triggerType,
    status: "delivered",
  };
}
