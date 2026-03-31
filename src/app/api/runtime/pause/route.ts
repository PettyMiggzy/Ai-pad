import { NextResponse } from "next/server";

import { pauseAgentRuntime } from "@/lib/runtime/lifecycle";

export async function POST(req: Request) {
  const body = (await req.json()) as { agentId?: string };

  if (!body.agentId) {
    return NextResponse.json({ error: "agentId is required" }, { status: 400 });
  }

  try {
    const result = await pauseAgentRuntime(body.agentId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Pause failed" },
      { status: 500 },
    );
  }
}
