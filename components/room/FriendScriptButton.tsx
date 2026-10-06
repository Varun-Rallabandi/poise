"use client";
import { useState } from "react";
import { friendScript } from "@/lib/friend";
import type { QuestionSet } from "@/lib/schemas";

export function FriendScriptButton({ set }: { set: QuestionSet }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(friendScript(set));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button className="rounded-full border border-border px-5 py-2.5 text-sm" onClick={copy}>
      {copied ? "Copied. Paste it to your friend in Meet chat" : "Copy questions for your friend"}
    </button>
  );
}
