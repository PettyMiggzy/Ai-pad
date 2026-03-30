export type TriggerType = "manual" | "interval" | "daily" | "webhook";

export interface AgentMission {
  objective: string;
  instructions: string[];
  validationMode: "none" | "sampled" | "always";
}

export interface AgentTrigger {
  type: TriggerType;
  enabled: boolean;
  intervalMinutes?: number;
  dailyTime?: string;
  webhookPath?: string;
}

export interface AgentRunRecord {
  id: string;
  agentId: string;
  triggerType: TriggerType;
  status: "queued" | "running" | "validated" | "delivered" | "failed";
  startedAt: string;
  completedAt?: string;
  costCents: number;
}
