import { NextResponse } from "next/server";

import { buildArtemisPrompt } from "@/lib/prompts/artemis";
import { createAgentSchema } from "@/lib/validation/agent";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createAgentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const systemPrompt = buildArtemisPrompt({
    name: data.name,
    purpose: data.purpose,
    tone: data.persona.tone,
    style: data.persona.style,
  });

  return NextResponse.json({
    ok: true,
    message: "Agent draft validated",
    agent: {
      name: data.name,
      template: "artemis",
      systemPrompt,
      status: "draft",
    },
  });
}
