import type { RepoLoad } from "@/lib/repo";
import { approxTokens } from "@/lib/format";

export function RepoSummary({ repo, onClear }: { repo: RepoLoad; onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="font-medium">
          {repo.files.length} files loaded <span className="text-muted">· ~{approxTokens(repo.totalChars)} tokens</span>
        </p>
        <button onClick={onClear} className="text-sm text-muted underline-offset-2 hover:underline">
          Change folder
        </button>
      </div>
      <ul className="mt-3 max-h-40 overflow-auto font-mono text-xs text-muted">
        {repo.files.map((f) => (
          <li key={f.path}>{f.path}</li>
        ))}
      </ul>
      {repo.skipped.length > 0 && (
        <details className="mt-3 text-sm text-warn">
          <summary className="cursor-pointer">{repo.skipped.length} files skipped</summary>
          <ul className="mt-1 font-mono text-xs">
            {repo.skipped.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
