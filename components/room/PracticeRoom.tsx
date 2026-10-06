"use client";
import { useEffect, useReducer, useState } from "react";
import { useSpeech } from "@/hooks/useSpeech";
import { gradeAnswer } from "@/lib/api";
import { demoFeedback } from "@/lib/demo";
import { deferFeedback, hintFor, type HintLevel } from "@/lib/hints";
import type { QuestionSet } from "@/lib/schemas";
import { initSession, sessionReducer, type Answer } from "@/lib/session";
import type { RepoFile } from "@/lib/types";
import { speak, stopSpeaking } from "@/lib/voice";
import { FeedbackCard } from "../feedback/FeedbackCard";
import { FriendScriptButton } from "./FriendScriptButton";
import { CameraTile } from "./CameraTile";
import { Controls } from "./Controls";
import { HintPanel } from "./HintPanel";
import { InterviewerTile } from "./InterviewerTile";
import { MetricsBar } from "./MetricsBar";
import { QuestionCard } from "./QuestionCard";
import { Timer } from "./Timer";
import { TranscriptPanel } from "./TranscriptPanel";

type Props = { files: RepoFile[]; set: QuestionSet; onFinish: (answers: Answer[]) => void; demo?: boolean; level: HintLevel; friend?: boolean };

export function PracticeRoom({ files, set, onFinish, demo = false, level, friend = false }: Props) {
  const [s, dispatch] = useReducer(sessionReducer, set.questions, (qs) => initSession(qs, deferFeedback(level)));
  const [startedAt] = useState(() => Date.now());
  const [repeating, setRepeating] = useState(false);
  const speech = useSpeech();
  const q = s.questions[s.index];
  const speaking = s.phase === "asking" || repeating;

  // Interviewer asks each question out loud.
  useEffect(() => {
    if (s.phase !== "asking") return;
    let cancelled = false;
    // In friend mode a person asks on Meet, so skip TTS and go straight to ready.
    const ask = friend ? Promise.resolve() : speak(q.question);
    ask.then(() => {
      if (!cancelled) dispatch({ type: "asked" });
    });
    return () => {
      cancelled = true;
      stopSpeaking();
    };
  }, [s.phase, q, friend]);

  // Grade the answer as soon as the candidate finishes.
  useEffect(() => {
    if (s.phase !== "grading") return;
    const a = s.answers[s.answers.length - 1];
    const grade = demo
      ? Promise.resolve(demoFeedback(a.question, a.transcript, a.metrics))
      : gradeAnswer(files, a.question, a.transcript, a.metrics);
    grade
      .then((feedback) => dispatch({ type: "graded", feedback }))
      .catch((e: Error) => dispatch({ type: "gradeFailed", error: e.message }));
  }, [s.phase, s.answers, files, demo]);

  useEffect(() => {
    if (s.phase === "done") onFinish(s.answers);
  }, [s.phase, s.answers, onFinish]);

  function repeat() {
    setRepeating(true);
    speak(q.question).then(() => setRepeating(false));
  }

  function begin() {
    stopSpeaking();
    setRepeating(false);
    speech.start();
    dispatch({ type: "begin" });
  }

  function end() {
    const { transcript, metrics } = speech.stop();
    dispatch({ type: "end", transcript, metrics });
  }

  // Space starts and stops an answer, so you can keep your eyes on the camera.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code !== "Space" || (e.target as HTMLElement).closest("input, textarea, button")) return;
      if (s.phase === "ready") {
        e.preventDefault();
        begin();
      } else if (s.phase === "answering") {
        e.preventDefault();
        end();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (s.phase === "intro")
    return (
      <div className="flex flex-col items-start gap-4">
        <CameraTile on />
        <p className="text-muted">
          Check your camera, take a breath. {set.questions.length} questions.
        </p>
        {friend && (
          <p className="text-sm text-muted">
            Join a Google Meet with your friend, send them the script below, and keep this tab open beside the call.
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-accent px-5 py-2.5 text-white" onClick={() => dispatch({ type: "start" })}>
            Start interview
          </button>
          {friend && <FriendScriptButton set={set} />}
        </div>
      </div>
    );

  if (s.phase === "done") return null;
  const last = s.answers[s.answers.length - 1];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">Practice session</span>
        <Timer startedAt={startedAt} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <InterviewerTile speaking={!friend && speaking} label={friend ? "Your friend (on Google Meet)" : "Interviewer"} />
        <CameraTile on />
      </div>
      <QuestionCard q={q} n={s.index + 1} total={s.questions.length} showText={!friend} />
      {(s.phase === "ready" || s.phase === "answering") && <HintPanel hint={hintFor(level, q)} />}
      {!speech.supported && (
        <p className="text-sm text-warn">Speech-to-text needs Chrome or Edge. You can still practice out loud.</p>
      )}
      {speech.error && <p className="text-sm text-danger">Microphone: {speech.error}</p>}
      {(s.phase === "answering" || s.phase === "grading") && (
        <>
          <MetricsBar m={speech.metrics} />
          <TranscriptPanel text={speech.finalText} interim={speech.interim} listening={speech.listening} />
        </>
      )}
      {s.phase === "review" && last?.error && (
        <div className="rounded-xl border border-border bg-surface p-4 text-sm">
          <p className="text-danger">{last.error}</p>
        </div>
      )}
      {s.phase === "review" && last?.feedback && <FeedbackCard fb={last.feedback} />}
      {(s.phase === "ready" || s.phase === "answering") && (
        <p className="text-xs text-muted">Tip: press Space to {s.phase === "ready" ? "start" : "finish"} your answer.</p>
      )}
      <Controls
        phase={s.phase}
        onRepeat={repeat}
        onBegin={begin}
        onEnd={end}
        onNext={() => dispatch({ type: "next" })}
        isLast={s.index === s.questions.length - 1}
        followUp={last?.feedback?.followUp || undefined}
        onFollowUp={() => last?.feedback && dispatch({ type: "followUp", question: last.feedback.followUp })}
        onHearBetter={last?.feedback ? () => speak(last.feedback!.betterAnswer) : undefined}
      />
    </div>
  );
}
