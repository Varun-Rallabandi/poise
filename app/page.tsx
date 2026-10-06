"use client";
import { useState } from "react";
import { FolderPicker } from "@/components/FolderPicker";
import { RepoSummary } from "@/components/RepoSummary";
import type { RepoLoad } from "@/lib/repo";

export default function Home() {
  const [repo, setRepo] = useState<RepoLoad | null>(null);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Poise</h1>
        <p className="mt-1 text-muted">Practice defending your take-home on camera until it feels boring.</p>
      </header>
      {repo ? <RepoSummary repo={repo} onClear={() => setRepo(null)} /> : <FolderPicker onLoad={setRepo} />}
    </main>
  );
}
