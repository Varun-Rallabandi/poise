export function TranscriptPanel({ text, interim, listening }: { text: string; interim: string; listening: boolean }) {
  return (
    <div className="min-h-24 rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed">
      <div className="mb-1 flex items-center gap-2 text-xs text-muted">
        {listening && <span className="h-2 w-2 animate-pulse rounded-full bg-danger" />}
        {listening ? "Listening" : "Transcript"}
      </div>
      {text || interim ? (
        <p>
          {text}
          <span className="text-muted">{interim}</span>
        </p>
      ) : (
        <p className="text-muted">Your answer will appear here as you talk.</p>
      )}
    </div>
  );
}
