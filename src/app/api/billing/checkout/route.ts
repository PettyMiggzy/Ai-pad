import { NextResponse } from "next/server";

import { calculateArtemisCheckoutTotal } from "@/lib/billing/pricing";
import { getStripeServer, isStripeConfigured } from "@/lib/billing/stripe";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    agentId?: string;
    name?: string;
    initialBucketTopupCents?: number;
  };

  const pricing = calculateArtemisCheckoutTotal(
    Number(body.initialBucketTopupCents ?? 0),
  );

  if (!isStripeConfigured()) {
    return NextResponse.json({
      ok: true,
      mode: "mock",
      message: "Stripe not configured yet",
      pricing,
      agentId: body.agentId ?? null,
      agentName: body.name ?? "Artemis",
    });
  }

  const stripe = getStripeServer();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${baseUrl}/dashboard/agents?checkout=success`,
    cancel_url: `${baseUrl}/dashboard/agents?checkout=cancelled`,
    metadata: {
      agentId: body.agentId ?? "",
      agentName: body.name ?? "Artemis",
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: pricing.creationFeeCents,
          product_data: {
            name: "Artemis creation fee",
          },
        },
      },
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: pricing.firstMonthCents,
          product_data: {
            name: "Artemis first month",
          },
        },
      },
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: pricing.initialBucketTopupCents,
          product_data: {
            name: "Artemis API bucket top-up",
          },
        },
      },
    ],
  });

  return NextResponse.json({
    ok: true,
    mode: "stripe",
    checkoutUrl: session.url,
    pricing,
  });
}
