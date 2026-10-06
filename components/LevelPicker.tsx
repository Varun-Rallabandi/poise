import { LEVELS, type HintLevel } from "@/lib/hints";

export function LevelPicker({ value, onChange }: { value: HintLevel; onChange: (l: HintLevel) => void }) {
  return (
    <fieldset className="grid gap-2 sm:grid-cols-2">
      <legend className="mb-2 text-sm text-muted">How much help?</legend>
      {([1, 2, 3, 4] as HintLevel[]).map((l) => (
        <label
          key={l}
          className={`cursor-pointer rounded-xl border p-3 transition ${
            value === l ? "border-accent bg-accent-soft" : "border-border bg-surface hover:border-accent/50"
          }`}
        >
          <input type="radio" name="level" className="sr-only" checked={value === l} onChange={() => onChange(l)} />
          <span className="font-medium">
            {l}. {LEVELS[l].name}
          </span>
          <span className="block text-sm text-muted">{LEVELS[l].blurb}</span>
        </label>
      ))}
    </fieldset>
  );
}
