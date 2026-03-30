import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import type { CreateAgentInput } from "@/lib/validation/agent";

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

async function readAgents(): Promise<StoredAgentDraft[]> {
  await ensureStore();
  const raw = await readFile(DATA_FILE, "utf8");
  return JSON.parse(raw) as StoredAgentDraft[];
}

async function writeAgents(agents: StoredAgentDraft[]) {
  await writeFile(DATA_FILE, `${JSON.stringify(agents, null, 2)}\n`, "utf8");
}

export async function createAgentDraft(input: CreateAgentInput & { systemPrompt: string }) {
  const agents = await readAgents();

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
  await writeAgents(agents);

  return draft;
}

export async function listAgentDrafts() {
  return readAgents();
}
