import type { StoredAgentDraft } from "@/lib/db/agents";

export interface ArtemisRuntimeConfig {
  agentId: string;
  sessionLabel: string;
  model: string;
  initialMessage: string;
  tools: string[];
  metadata: {
    template: "artemis";
    status: string;
    channels: string[];
    memoryMode: string;
  };
}

export function buildArtemisRuntimeConfig(agent: StoredAgentDraft): ArtemisRuntimeConfig {
  return {
    agentId: agent.id,
    sessionLabel: `${agent.name} runtime`,
    model: "GPT",
    initialMessage: `You are now booting as ${agent.name}. Your purpose is: ${agent.purpose}`,
    tools: agent.tools,
    metadata: {
      template: "artemis",
      status: agent.status,
      channels: agent.channels.map((channel) => channel.type),
      memoryMode: agent.memory.mode,
    },
  };
}
