import Link from "next/link";
import { Nav } from "@/components/ui/nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="max-w-md space-y-4 text-center">
          <div className="text-4xl">🤖</div>
          <h1 className="text-3xl font-bold text-white">Not Found</h1>
          <p className="text-zinc-400">
            That page doesn&apos;t exist or the agent ID is wrong.
          </p>
          <Link
            href="/dashboard"
            className="inline-block rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    </>
  );
}
