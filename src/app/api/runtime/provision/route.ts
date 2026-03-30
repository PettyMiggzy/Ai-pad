import { NextResponse } from "next/server";

import { provisionAgentRuntime } from "@/lib/runtime/provision-agent";

export async function POST(req: Request) {
  const body = (await req.json()) as { agentId?: string };

  if (!body.agentId) {
    return NextResponse.json({ error: "agentId is required" }, { status: 400 });
  }

  try {
    const result = await provisionAgentRuntime(body.agentId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Provisioning failed",
      },
      { status: 500 },
    );
  }
}
