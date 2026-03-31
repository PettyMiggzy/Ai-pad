import Link from "next/link";

export function Nav() {
  return (
    <nav className="border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2 text-white font-semibold tracking-tight">
          <span className="text-blue-500 text-lg">⚡</span>
          <span>MIT Agents</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/dashboard" className="text-zinc-400 hover:text-white transition">
            Dashboard
          </Link>
          <Link href="/pricing" className="text-zinc-400 hover:text-white transition">
            Pricing
          </Link>
          <Link
            href="/dashboard/agents/new"
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500 transition"
          >
            Create Agent
          </Link>
        </div>
      </div>
    </nav>
  );
}
