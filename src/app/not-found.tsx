import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">AI Pad</p>
        <h1 className="text-4xl font-semibold tracking-tight">Not found</h1>
        <p className="text-zinc-400">
          That agent page doesn&apos;t exist yet or the ID is wrong.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-900"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
