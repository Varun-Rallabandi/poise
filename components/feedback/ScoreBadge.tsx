export function ScoreBadge({ score }: { score: number }) {
  const tone = score >= 8 ? "bg-accent text-white" : score >= 5 ? "bg-accent-soft text-accent" : "bg-warn/15 text-warn";
  return (
    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold ${tone}`}>
      {score}
    </span>
  );
}
