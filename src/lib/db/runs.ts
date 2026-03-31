import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import type { AgentRunRecord, TriggerType } from "@/types/mission";

const RUNS_FILE = join(process.cwd(), ".data", "runs.json");

async function ensureStore() {
  await mkdir(dirname(RUNS_FILE), { recursive: true });

  try {
    await readFile(RUNS_FILE, "utf8");
  } catch {
    await writeFile(RUNS_FILE, "[]\n", "utf8");
  }
}

async function readRuns(): Promise<AgentRunRecord[]> {
  await ensureStore();
  const raw = await readFile(RUNS_FILE, "utf8");
  return JSON.parse(raw) as AgentRunRecord[];
}

async function writeRuns(runs: AgentRunRecord[]) {
  await writeFile(RUNS_FILE, `${JSON.stringify(runs, null, 2)}\n`, "utf8");
}

export async function createRun(params: {
  agentId: string;
  triggerType: TriggerType;
  costCents?: number;
}) {
  const runs = await readRuns();

  const run: AgentRunRecord = {
    id: randomUUID(),
    agentId: params.agentId,
    triggerType: params.triggerType,
    status: "queued",
    startedAt: new Date().toISOString(),
    costCents: params.costCents ?? 0,
  };

  runs.unshift(run);
  await writeRuns(runs);

  return run;
}

export async function listRunsForAgent(agentId: string) {
  const runs = await readRuns();
  return runs.filter((run) => run.agentId === agentId);
}

export async function updateRunStatus(params: {
  runId: string;
  status: AgentRunRecord["status"];
  costCents?: number;
}) {
  const runs = await readRuns();
  const index = runs.findIndex((run) => run.id === params.runId);

  if (index === -1) {
    throw new Error("Run not found");
  }

  const current = runs[index];
  runs[index] = {
    ...current,
    status: params.status,
    costCents: params.costCents ?? current.costCents,
    completedAt:
      params.status === "delivered" || params.status === "failed"
        ? new Date().toISOString()
        : current.completedAt,
  };

  await writeRuns(runs);
  return runs[index];
}
