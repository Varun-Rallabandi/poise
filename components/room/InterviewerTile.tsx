export function InterviewerTile({ speaking, label = "Interviewer" }: { speaking: boolean; label?: string }) {
  return (
    <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-[#2b302d]">
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-white transition ${
          speaking ? "ring-4 ring-accent/50 ring-offset-4 ring-offset-[#2b302d]" : ""
        }`}
      >
        AI
      </div>
      <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-0.5 text-xs text-white">{label}</span>
    </div>
  );
}
