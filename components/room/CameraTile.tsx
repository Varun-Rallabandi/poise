"use client";
import { useCamera } from "@/hooks/useCamera";

export function CameraTile({ on }: { on: boolean }) {
  const { videoRef, error } = useCamera(on);
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
      {on && !error ? (
        <video ref={videoRef} autoPlay muted playsInline className="h-full w-full -scale-x-100 object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-white/60">
          {error ? `Camera: ${error}` : "Camera off"}
        </div>
      )}
      <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-0.5 text-xs text-white">You</span>
    </div>
  );
}
