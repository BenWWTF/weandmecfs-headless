"use client";

import { useEffect, useRef, useState } from "react";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3 translate-x-[1px]" fill="currentColor" aria-hidden="true">
      <path d="M6 4.5v15l14-7.5-14-7.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden="true">
      <path d="M6 4.5h4v15H6v-15zm8 0h4v15h-4v-15z" />
    </svg>
  );
}

export function AudioPlayer({
  src,
  duration,
  label = "Listen to this article",
}: {
  src: string;
  duration?: string;
  label?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };
    const onTime = () => {
      if (a.duration > 0) setProgress((a.currentTime / a.duration) * 100);
    };
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnd);
    a.addEventListener("timeupdate", onTime);
    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("timeupdate", onTime);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play();
    else a.pause();
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-center sm:justify-start gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause audio" : "Play audio"}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink/70 text-ink hover:border-ink transition"
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <span className="text-base text-ink">{label}</span>
        {duration && (
          <>
            <span aria-hidden className="text-ink/30">·</span>
            <span className="text-base text-ink/55 tabular-nums">{duration}</span>
          </>
        )}
      </div>

      {playing && (
        <div
          className="pointer-events-none absolute left-0 bottom-0 h-px bg-blue transition-[width] duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        />
      )}
      <audio ref={audioRef} src={src} preload="none" />
    </div>
  );
}
