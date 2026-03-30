import { NextResponse } from "next/server";

import { executeAgentTrigger } from "@/lib/runtime/execute-trigger";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    agentId?: string;
    triggerType?: "manual" | "interval" | "daily" | "webhook";
  };

  if (!body.agentId || !body.triggerType) {
    return NextResponse.json(
      { error: "agentId and triggerType are required" },
      { status: 400 },
    );
  }

  try {
    const result = await executeAgentTrigger({
      agentId: body.agentId,
      triggerType: body.triggerType,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Execution failed",
      },
      { status: 500 },
    );
  }
}
