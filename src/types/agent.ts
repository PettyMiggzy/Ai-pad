export type AgentStatus =
  | "draft"
  | "provisioning"
  | "active"
  | "paused"
  | "suspended"
  | "cancelled";

export type AgentChannelType = "webchat" | "telegram";

export type GroupBehaviorMode =
  | "mention_only"
  | "direct_or_mention"
  | "owner_only";

export interface AgentPersona {
  tone: string;
  style: string;
  proactivity: "low" | "medium" | "high";
}

export interface AgentMemoryPolicy {
  mode: "none" | "explicit_only" | "profile_only";
  allowGroupMemory: boolean;
}

export interface AgentBillingConfig {
  monthlyPriceCents: number;
  apiBucketBalanceCents: number;
  pauseOnZeroBalance: boolean;
  spendCapDailyCents?: number | null;
}

export interface AgentChannelConfig {
  type: AgentChannelType;
  enabled: boolean;
  mode?: GroupBehaviorMode;
}

export interface AgentConfig {
  id: string;
  ownerUserId: string;
  name: string;
  templateName: "artemis";
  purpose: string;
  description?: string;
  persona: AgentPersona;
  systemPrompt: string;
  channels: AgentChannelConfig[];
  allowedTools: string[];
  memoryPolicy: AgentMemoryPolicy;
  billing: AgentBillingConfig;
  status: AgentStatus;
}
