import { z } from "zod";

export const createAgentSchema = z.object({
  name: z.string().min(2).max(80),
  purpose: z.string().min(10).max(2000),
  description: z.string().max(2000).optional(),
  persona: z.object({
    tone: z.string().min(2).max(50),
    style: z.string().min(2).max(50),
    proactivity: z.enum(["low", "medium", "high"]),
  }),
  channels: z
    .array(
      z.object({
        type: z.enum(["webchat", "telegram"]),
        enabled: z.boolean(),
        mode: z
          .enum(["mention_only", "direct_or_mention", "owner_only"])
          .optional(),
      }),
    )
    .min(1),
  tools: z.array(z.string()).default([]),
  knowledge: z
    .object({
      urls: z.array(z.string().url()).default([]),
      notes: z.array(z.string()).default([]),
    })
    .default({ urls: [], notes: [] }),
  memory: z.object({
    mode: z.enum(["none", "explicit_only", "profile_only"]),
    allowGroupMemory: z.boolean(),
  }),
  billing: z.object({
    plan: z.literal("tier1"),
    initialBucketTopupCents: z.number().int().min(0),
    pauseOnZeroBalance: z.boolean(),
  }),
});

export type CreateAgentInput = z.infer<typeof createAgentSchema>;
