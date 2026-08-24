import { Reveal } from "./Reveal";

export function PageCTA() {
  return (
    <section className="bg-white">
      <Reveal className="mx-auto w-full max-w-[1200px] px-7 py-16 md:px-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-blue">
          Take part
        </p>
        <h2 className="headline mt-3 text-[34px] leading-[1] tracking-[-0.01em] md:text-[52px]">
          Move the clock.
        </h2>
        <p className="mt-5 max-w-[46ch] text-[17px] leading-[1.5] text-ink/85">
          Every donation goes to research in full. The Ströck family covers all
          running costs of WE&amp;ME.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-8">
          <a
            href="https://donate.weandmecfs.org/en-us/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-[52px] items-center justify-center rounded-full bg-urgency px-7 text-[17px] font-bold text-ink no-underline transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-ink"
          >
            Fund the Research
          </a>
          <a
            href="mailto:contact@weandmecfs.org"
            className="inline-flex items-center gap-1 text-[16px] font-bold text-blue no-underline hover:opacity-80"
          >
            Contact us →
          </a>
        </div>
      </Reveal>
    </section>
  );
}
