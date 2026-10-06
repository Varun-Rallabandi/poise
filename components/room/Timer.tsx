"use client";
import { useEffect, useState } from "react";
import { mmss } from "@/lib/format";

/** Session clock. Purely visual, so a bit of drift doesn't matter. */
export function Timer({ startedAt }: { startedAt: number }) {
  const [now, setNow] = useState(startedAt);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono text-sm tabular-nums text-muted">{mmss((now - startedAt) / 1000)}</span>;
}
