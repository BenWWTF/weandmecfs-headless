"use client";

import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";
import { AudioPlayer } from "./AudioPlayer";

const SESSION_KEY = "post:mode";

/**
 * Renders a post's full body (raw WP HTML) with an optional audio
 * player and a Full / In short toggle. Only used for posts that carry
 * both a short-form summary and an audio narration — most posts render
 * their body directly on the server without this client component.
 */
export function PostBodyWithVersions({
  fullHtml,
  shortText,
  audioUrl,
  audioDuration,
  children,
}: {
  fullHtml: string;
  shortText?: string;
  audioUrl?: string;
  audioDuration?: string;
  children?: ReactNode;
}) {
  const hasShort = Boolean(shortText);
  const [isShort, setIsShort] = useState(false);

  useEffect(() => {
    if (!hasShort) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "short") setIsShort(true);
    } catch {
      /* ignore */
    }
  }, [hasShort]);

  const setMode = (mode: "full" | "short") => {
    try {
      sessionStorage.setItem(SESSION_KEY, mode);
    } catch {
      /* ignore */
    }
    setIsShort(mode === "short");
  };

  return (
    <>
      {(audioUrl || hasShort) && (
        <div className="mx-auto mt-10 max-w-[720px] px-5 sm:px-8">
          <div className="border-t border-b border-ink/15">
            <div className="flex flex-col items-center justify-center gap-5 py-5">
              {audioUrl && <AudioPlayer src={audioUrl} duration={audioDuration} />}
              {hasShort && <VersionToggle isShort={isShort} onSetMode={setMode} />}
            </div>
          </div>
        </div>
      )}

      {isShort ? (
        <ShortBody text={shortText!} />
      ) : (
        <div key="full" className="animate-in fade-in duration-300">
          <div
            className="mx-auto max-w-[720px] px-5 sm:px-8 py-14 sm:py-20 text-[17px] sm:text-[18px] leading-[1.6] text-ink/85 [&>p]:mt-6 [&>p:first-of-type]:mt-0 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:mt-1 [&>p:first-of-type]:first-letter:font-bold [&>p:first-of-type]:first-letter:leading-[0.82] [&>p:first-of-type]:first-letter:text-[5.5rem] [&>p:first-of-type]:first-letter:text-blue [&>h2]:mt-14 [&>h2]:mb-5 [&>h2]:text-[11px] [&>h2]:font-bold [&>h2]:uppercase [&>h2]:tracking-[0.24em] [&>h2]:text-ink/60 [&>blockquote]:my-12 [&>blockquote]:border-l-2 [&>blockquote]:border-blue [&>blockquote]:pl-6 [&>blockquote>p]:headline [&>blockquote>p]:mt-0 [&>blockquote>p]:text-2xl [&>blockquote>p]:normal-case [&>blockquote>p]:text-ink [&>em]:italic"
            dangerouslySetInnerHTML={{ __html: fullHtml }}
          />
          {children}
        </div>
      )}
    </>
  );
}

function ShortBody({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/);
  return (
    <div
      key="short"
      className="mx-auto max-w-[720px] px-5 sm:px-8 py-14 sm:py-20 text-[17px] sm:text-[18px] leading-[1.8] text-ink/85 animate-in fade-in duration-300"
    >
      {paragraphs.map((p, i) => (
        <p key={i} className={i === 0 ? "" : "mt-6"}>
          {p}
        </p>
      ))}
    </div>
  );
}

function VersionToggle({
  isShort,
  onSetMode,
}: {
  isShort: boolean;
  onSetMode: (mode: "full" | "short") => void;
}) {
  const purpose = isShort
    ? "The essentials of this piece, for limited-energy days. The full version is here when you want it."
    : "Limited energy today? The short version has the essentials.";

  const tablistRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);
  const activeKey = isShort ? "short" : "full";

  useEffect(() => {
    const tablist = tablistRef.current;
    const btn = buttonRefs.current[activeKey];
    if (!tablist || !btn) return;
    const left = btn.offsetLeft - 4;
    const width = btn.offsetWidth + 8;
    setIndicator({ left, width });
    setReady(true);
  }, [activeKey]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Article length"
        className="relative inline-flex items-center gap-6 text-sm"
      >
        <ToggleOption
          label="Full"
          active={!isShort}
          onClick={() => onSetMode("full")}
          ref={(el) => {
            buttonRefs.current.full = el;
          }}
        />
        <ToggleOption
          label="In short"
          active={isShort}
          onClick={() => onSetMode("short")}
          ref={(el) => {
            buttonRefs.current.short = el;
          }}
        />
        <span
          className={
            "pointer-events-none absolute bottom-0 h-[2px] bg-blue " +
            (ready ? "transition-all duration-200 ease-out" : "")
          }
          style={{ left: indicator.left, width: indicator.width }}
        />
      </div>
      <p className="max-w-sm text-center text-xs text-ink/55">{purpose}</p>
    </div>
  );
}

const ToggleOption = forwardRef<
  HTMLButtonElement,
  { label: string; active: boolean; onClick: () => void }
>(function ToggleOption({ label, active, onClick }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={
        "pb-1 transition-colors " +
        (active ? "text-ink" : "text-ink/50 hover:text-ink")
      }
    >
      {label}
    </button>
  );
});
