import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import type { CreateAgentInput } from "@/lib/validation/agent";
import {
  getSupabaseAdminClient,
  isSupabaseConfigured,
} from "@/lib/db/server";

const DATA_FILE = join(process.cwd(), ".data", "agents.json");

export interface StoredAgentDraft {
  id: string;
  name: string;
  templateName: "artemis";
  purpose: string;
  description?: string;
  persona: CreateAgentInput["persona"];
  channels: CreateAgentInput["channels"];
  tools: string[];
  knowledge: CreateAgentInput["knowledge"];
  memory: CreateAgentInput["memory"];
  billing: CreateAgentInput["billing"];
  systemPrompt: string;
  status: "draft";
  createdAt: string;
}

async function ensureStore() {
  await mkdir(dirname(DATA_FILE), { recursive: true });

  try {
    await readFile(DATA_FILE, "utf8");
  } catch {
    await writeFile(DATA_FILE, "[]\n", "utf8");
  }
}

async function readAgentsFile(): Promise<StoredAgentDraft[]> {
  await ensureStore();
  const raw = await readFile(DATA_FILE, "utf8");
  return JSON.parse(raw) as StoredAgentDraft[];
}

async function writeAgentsFile(agents: StoredAgentDraft[]) {
  await writeFile(DATA_FILE, `${JSON.stringify(agents, null, 2)}\n`, "utf8");
}

async function createAgentDraftFile(
  input: CreateAgentInput & { systemPrompt: string },
) {
  const agents = await readAgentsFile();

  const draft: StoredAgentDraft = {
    id: randomUUID(),
    name: input.name,
    templateName: "artemis",
    purpose: input.purpose,
    description: input.description,
    persona: input.persona,
    channels: input.channels,
    tools: input.tools,
    knowledge: input.knowledge,
    memory: input.memory,
    billing: input.billing,
    systemPrompt: input.systemPrompt,
    status: "draft",
    createdAt: new Date().toISOString(),
  };

  agents.push(draft);
  await writeAgentsFile(agents);

  return draft;
}

async function listAgentDraftsFile() {
  return readAgentsFile();
}

async function getAgentDraftByIdFile(id: string) {
  const agents = await readAgentsFile();
  return agents.find((agent) => agent.id === id) ?? null;
}

async function createAgentDraftSupabase(
  input: CreateAgentInput & { systemPrompt: string },
) {
  const supabase = getSupabaseAdminClient();
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  const payload = {
    id,
    name: input.name,
    template_name: "artemis",
    purpose: input.purpose,
    description: input.description ?? null,
    persona: input.persona,
    system_prompt: input.systemPrompt,
    communication_channels: input.channels,
    allowed_tools: input.tools,
    knowledge_config: input.knowledge,
    memory_policy: input.memory,
    model_profile: {
      plan: input.billing.plan,
    },
    status: "draft",
    api_bucket_balance_cents: input.billing.initialBucketTopupCents,
    pause_on_zero_balance: input.billing.pauseOnZeroBalance,
    created_at: createdAt,
    updated_at: createdAt,
  };

  const { error } = await supabase.from("agents").insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  return {
    id,
    name: input.name,
    templateName: "artemis" as const,
    purpose: input.purpose,
    description: input.description,
    persona: input.persona,
    channels: input.channels,
    tools: input.tools,
    knowledge: input.knowledge,
    memory: input.memory,
    billing: input.billing,
    systemPrompt: input.systemPrompt,
    status: "draft" as const,
    createdAt,
  };
}

async function listAgentDraftsSupabase() {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("agents")
    .select(
      "id, name, purpose, description, persona, system_prompt, communication_channels, allowed_tools, knowledge_config, memory_policy, status, created_at",
    )
    .eq("template_name", "artemis")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    templateName: "artemis" as const,
    purpose: row.purpose,
    description: row.description ?? undefined,
    persona: (row.persona ?? {}) as CreateAgentInput["persona"],
    channels: (row.communication_channels ?? []) as CreateAgentInput["channels"],
    tools: (row.allowed_tools ?? []) as string[],
    knowledge: (row.knowledge_config ?? { urls: [], notes: [] }) as CreateAgentInput["knowledge"],
    memory: (row.memory_policy ?? {
      mode: "explicit_only",
      allowGroupMemory: false,
    }) as CreateAgentInput["memory"],
    billing: {
      plan: "tier1",
      initialBucketTopupCents: 0,
      pauseOnZeroBalance: true,
    },
    systemPrompt: row.system_prompt,
    status: (row.status ?? "draft") as "draft",
    createdAt: row.created_at,
  }));
}

async function getAgentDraftByIdSupabase(id: string) {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("agents")
    .select(
      "id, name, purpose, description, persona, system_prompt, communication_channels, allowed_tools, knowledge_config, memory_policy, status, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    templateName: "artemis" as const,
    purpose: data.purpose,
    description: data.description ?? undefined,
    persona: (data.persona ?? {}) as CreateAgentInput["persona"],
    channels: (data.communication_channels ?? []) as CreateAgentInput["channels"],
    tools: (data.allowed_tools ?? []) as string[],
    knowledge: (data.knowledge_config ?? { urls: [], notes: [] }) as CreateAgentInput["knowledge"],
    memory: (data.memory_policy ?? {
      mode: "explicit_only",
      allowGroupMemory: false,
    }) as CreateAgentInput["memory"],
    billing: {
      plan: "tier1",
      initialBucketTopupCents: 0,
      pauseOnZeroBalance: true,
    },
    systemPrompt: data.system_prompt,
    status: (data.status ?? "draft") as "draft",
    createdAt: data.created_at,
  };
}

export async function createAgentDraft(
  input: CreateAgentInput & { systemPrompt: string },
) {
  if (isSupabaseConfigured()) {
    return createAgentDraftSupabase(input);
  }

  return createAgentDraftFile(input);
}

export async function listAgentDrafts() {
  if (isSupabaseConfigured()) {
    return listAgentDraftsSupabase();
  }

  return listAgentDraftsFile();
}

export async function getAgentDraftById(id: string) {
  if (isSupabaseConfigured()) {
    return getAgentDraftByIdSupabase(id);
  }

  return getAgentDraftByIdFile(id);
}
