import { NextResponse } from "next/server";

import { sendMessageToAgent } from "@/lib/runtime/send-message";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    agentId?: string;
    message?: string;
  };

  if (!body.agentId || !body.message) {
    return NextResponse.json(
      { error: "agentId and message are required" },
      { status: 400 },
    );
  }

  try {
    const result = await sendMessageToAgent({
      agentId: body.agentId,
      message: body.message,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Send failed",
      },
      { status: 500 },
    );
  }
}
