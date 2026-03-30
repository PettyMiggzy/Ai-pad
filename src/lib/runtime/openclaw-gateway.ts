import crypto from "node:crypto";

interface GatewayRpcSuccess<T> {
  ok: true;
  result: T;
}

interface GatewayRpcFailure {
  ok: false;
  error?: {
    message?: string;
  };
}

type GatewayRpcResponse<T> = GatewayRpcSuccess<T> | GatewayRpcFailure;

export async function callOpenClawGateway<T>(params: {
  method: string;
  params: Record<string, unknown>;
}) {
  const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL;

  if (!gatewayUrl) {
    throw new Error("Missing OPENCLAW_GATEWAY_URL");
  }

  const response = await fetch(gatewayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.OPENCLAW_GATEWAY_TOKEN
        ? {
            Authorization: `Bearer ${process.env.OPENCLAW_GATEWAY_TOKEN}`,
          }
        : {}),
    },
    body: JSON.stringify({
      id: crypto.randomUUID(),
      method: params.method,
      params: params.params,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`OpenClaw gateway HTTP ${response.status}`);
  }

  const data = (await response.json()) as GatewayRpcResponse<T>;

  if (!data.ok) {
    throw new Error(data.error?.message ?? "OpenClaw gateway request failed");
  }

  return data.result;
}
