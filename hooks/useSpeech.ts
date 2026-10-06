"use client";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { computeMetrics } from "@/lib/metrics";
import type { Metrics } from "@/lib/schemas";
import { createRecognition, isSpeechSupported, type Recognition } from "@/lib/speechRecognition";

const PAUSE_GAP_MS = 1500;

export function useSpeech() {
  const [listening, setListening] = useState(false);
  const [finalText, setFinalText] = useState("");
  const [interim, setInterim] = useState("");
  const [metrics, setMetrics] = useState<Metrics>(computeMetrics("", 0, 0));
  const [error, setError] = useState("");

  const rec = useRef<Recognition | null>(null);
  const wantOn = useRef(false);
  const startedAt = useRef(0);
  const lastHeard = useRef(0);
  const longestPause = useRef(0);
  const finalRef = useRef("");

  // Browser capability never changes, so subscribe is a no-op. Server render assumes support.
  const supported = useSyncExternalStore(
    () => () => {},
    () => isSpeechSupported(),
    () => true,
  );
  const [unsupported, setUnsupported] = useState(false);

  // Live metrics tick while recording; counts current silence toward longest pause.
  useEffect(() => {
    if (!listening) return;
    const id = setInterval(() => {
      const now = Date.now();
      const gap = (now - lastHeard.current) / 1000;
      if (gap * 1000 > PAUSE_GAP_MS) longestPause.current = Math.max(longestPause.current, gap);
      setMetrics(computeMetrics(finalRef.current, (now - startedAt.current) / 1000, longestPause.current));
    }, 500);
    return () => clearInterval(id);
  }, [listening]);

  const start = useCallback(() => {
    const r = createRecognition();
    if (!r) return setUnsupported(true);
    finalRef.current = "";
    setFinalText("");
    setInterim("");
    setError("");
    longestPause.current = 0;
    startedAt.current = lastHeard.current = Date.now();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";
    r.onresult = (e) => {
      lastHeard.current = Date.now();
      let live = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalRef.current += res[0].transcript.trim() + " ";
        else live += res[0].transcript;
      }
      setFinalText(finalRef.current);
      setInterim(live);
    };
    r.onerror = (e) => {
      if (e.error !== "no-speech" && e.error !== "aborted") setError(e.error);
    };
    // Chrome ends recognition after silence; restart while the user is still answering.
    r.onend = () => {
      if (wantOn.current) {
        try {
          r.start();
        } catch {}
      } else setListening(false);
    };
    rec.current = r;
    wantOn.current = true;
    r.start();
    setListening(true);
  }, []);

  const stop = useCallback((): { transcript: string; metrics: Metrics } => {
    wantOn.current = false;
    rec.current?.stop();
    setListening(false);
    const transcript = (finalRef.current + " " + interim).trim();
    const m = computeMetrics(transcript, (Date.now() - startedAt.current) / 1000, longestPause.current);
    setMetrics(m);
    return { transcript, metrics: m };
  }, [interim]);

  return { supported: supported && !unsupported, listening, finalText, interim, metrics, error, start, stop };
}
