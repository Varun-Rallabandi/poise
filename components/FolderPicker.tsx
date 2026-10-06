"use client";
import { useState } from "react";
import { readRepoFolder, type RepoLoad } from "@/lib/repo";

export function FolderPicker({ onLoad }: { onLoad: (repo: RepoLoad) => void }) {
  const [loading, setLoading] = useState(false);

  async function handle(list: FileList | null) {
    if (!list?.length) return;
    setLoading(true);
    try {
      onLoad(await readRepoFolder(list));
    } finally {
      setLoading(false);
    }
  }

  return (
    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-surface p-8 text-center transition hover:border-accent">
      <span className="text-lg font-medium">{loading ? "Reading files…" : "Choose your take-home folder"}</span>
      <span className="text-sm text-muted">Stays in your browser until you start a session. node_modules, builds and lockfiles are skipped.</span>
      <input
        type="file"
        className="hidden"
        // @ts-expect-error webkitdirectory is non-standard but supported in all major browsers
        webkitdirectory=""
        multiple
        onChange={(e) => handle(e.target.files)}
      />
    </label>
  );
}
