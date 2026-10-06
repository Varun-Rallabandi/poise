"use client";
import { useEffect, useRef, useState } from "react";

/** Webcam preview only. Nothing is recorded or uploaded. */
export function useCamera(enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled) return;
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 }, audio: false })
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Camera unavailable"));
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [enabled]);

  return { videoRef, error };
}
