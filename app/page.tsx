"use client";
import { useCallback, useState } from "react";
import { FolderPicker } from "@/components/FolderPicker";
import { RepoSummary } from "@/components/RepoSummary";
import { PracticeRoom } from "@/components/room/PracticeRoom";
import { SessionSettings, type Settings } from "@/components/SessionSettings";
import { SummaryScreen } from "@/components/summary/SummaryScreen";
import { generateQuestions, gradeAnswer } from "@/lib/api";
import { DEMO_SET, demoFeedback } from "@/lib/demo";
import { gradeAll } from "@/lib/gradeAll";
import type { HintLevel } from "@/lib/hints";
import { loadHistory, saveSession, type SessionRecord } from "@/lib/history";
import type { RepoLoad } from "@/lib/repo";
import type { QuestionSet } from "@/lib/schemas";
import type { Answer } from "@/lib/session";
import { suggestLevel, summarize } from "@/lib/summary";

type Stage = "setup" | "generating" | "room" | "grading" | "summary";

export default function Home() {
  const [stage, setStage] = useState<Stage>("setup");
  const [repo, setRepo] = useState<RepoLoad | null>(null);
  const [settings, setSettings] = useState<Settings>({ count: 8, role: "", level: 1, friend: false });
  const [set, setSet] = useState<QuestionSet | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [error, setError] = useState("");
  const [demo, setDemo] = useState(false);
  const [record, setRecord] = useState<SessionRecord | null>(null);
  const [history, setHistory] = useState<SessionRecord[]>([]);

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

  const finish = useCallback(
    async (a: Answer[]) => {
      let graded = a;
      setAnswers(a);
      if (a.some((x) => !x.feedback && !x.error)) {
        setStage("grading");
        const files = repo?.files ?? [];
        const grade = demo
          ? async (...args: Parameters<typeof demoFeedback>) => demoFeedback(...args)
          : (...args: Parameters<typeof demoFeedback>) => gradeAnswer(files, ...args);
        graded = await gradeAll(a, grade);
        setAnswers(graded);
      }
      const rec = summarize(graded, settings.level);
      setRecord(rec);
      // Demo runs are canned, so keep them out of real progress history.
      setHistory(demo ? loadHistory() : saveSession(rec));
      setStage("summary");
    },
    [repo, demo, settings.level],
  );

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Poise</h1>
        <p className="mt-1 text-muted">Practice defending your take-home on camera until it feels boring.</p>
      </header>

      {stage === "setup" && (
        <>
          {repo ? <RepoSummary repo={repo} onClear={() => setRepo(null)} /> : <FolderPicker onLoad={setRepo} />}
          <SessionSettings value={settings} onChange={setSettings} />
          {repo && (
            <button className="self-start rounded-full bg-accent px-6 py-3 font-medium text-white" onClick={prepare}>
              Prepare my interview
            </button>
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
        <PracticeRoom files={repo?.files ?? []} set={set} onFinish={finish} demo={demo} level={settings.level} friend={settings.friend} />
      )}

      {stage === "grading" && (
        <p className="animate-pulse text-muted">Interview over. Your coach is reviewing all {answers.length} answers…</p>
      )}

      {stage === "summary" && record && (
        <SummaryScreen
          rec={record}
          answers={answers}
          history={history}
          next={suggestLevel(record)}
          onAgain={(level: HintLevel) => {
            setSettings((st) => ({ ...st, level }));
            setStage("setup");
          }}
        />
      )}
    </main>
  );
}
