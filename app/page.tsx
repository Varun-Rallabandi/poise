"use client";
import { useCallback, useState } from "react";
import { FolderPicker } from "@/components/FolderPicker";
import { RepoSummary } from "@/components/RepoSummary";
import { PracticeRoom } from "@/components/room/PracticeRoom";
import { SessionSettings, type Settings } from "@/components/SessionSettings";
import { generateQuestions } from "@/lib/api";
import { DEMO_SET } from "@/lib/demo";
import type { RepoLoad } from "@/lib/repo";
import type { QuestionSet } from "@/lib/schemas";
import type { Answer } from "@/lib/session";

type Stage = "setup" | "generating" | "room" | "summary";

export default function Home() {
  const [stage, setStage] = useState<Stage>("setup");
  const [repo, setRepo] = useState<RepoLoad | null>(null);
  const [settings, setSettings] = useState<Settings>({ count: 8, role: "", level: 1 });
  const [set, setSet] = useState<QuestionSet | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [error, setError] = useState("");
  const [demo, setDemo] = useState(false);

  function startDemo() {
    setDemo(true);
    setSet(DEMO_SET);
    setStage("room");
  }

  async function prepare() {
    if (!repo) return;
    setDemo(false);
    setError("");
    setStage("generating");
    try {
      setSet(await generateQuestions(repo.files, settings.count, settings.role));
      setStage("room");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStage("setup");
    }
  }

  const finish = useCallback((a: Answer[]) => {
    setAnswers(a);
    setStage("summary");
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Poise</h1>
        <p className="mt-1 text-muted">Practice defending your take-home on camera until it feels boring.</p>
      </header>

      {stage === "setup" && (
        <>
          {repo ? <RepoSummary repo={repo} onClear={() => setRepo(null)} /> : <FolderPicker onLoad={setRepo} />}
          {repo && (
            <>
              <SessionSettings value={settings} onChange={setSettings} />
              <button className="self-start rounded-full bg-accent px-6 py-3 font-medium text-white" onClick={prepare}>
                Prepare my interview
              </button>
            </>
          )}
          {error && <p className="text-sm text-danger">{error}</p>}
          {!repo && (
            <button className="self-start text-sm text-muted underline underline-offset-2" onClick={startDemo}>
              No repo handy? Try a 3-question demo
            </button>
          )}
        </>
      )}

      {stage === "generating" && (
        <p className="animate-pulse text-muted">Reading your code and writing the questions an interviewer would ask…</p>
      )}

      {stage === "room" && set && (repo || demo) && (
        <PracticeRoom files={repo?.files ?? []} set={set} onFinish={finish} demo={demo} />
      )}

      {stage === "summary" && (
        <p>
          Session complete: {answers.length} answers.{" "}
          <button className="underline" onClick={() => setStage("setup")}>
            Practice again
          </button>
        </p>
      )}
    </main>
  );
}
