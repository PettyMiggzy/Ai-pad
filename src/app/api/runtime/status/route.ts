import { NextResponse } from "next/server";

import { getAgentRuntimeStatus } from "@/lib/runtime/get-status";

export async function POST(req: Request) {
  const body = (await req.json()) as { agentId?: string };

  if (!body.agentId) {
    return NextResponse.json({ error: "agentId is required" }, { status: 400 });
  }

  try {
    const result = await getAgentRuntimeStatus(body.agentId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Status lookup failed",
      },
      { status: 500 },
    );
  }
}
