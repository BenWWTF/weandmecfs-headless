import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-7 py-32 md:px-12 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
          404
        </p>
        <h1 className="headline mt-4 text-[clamp(2.5rem,8vw,5.5rem)] font-semibold leading-[0.95]">
          Not here.
        </h1>
        <p className="mt-6 mx-auto max-w-[40ch] text-[18px] leading-[1.5] text-ink/80">
          The page you were looking for doesn&rsquo;t exist — at least not
          here. Try the homepage, or read a patient story.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-[52px] items-center justify-center whitespace-nowrap rounded-full bg-blue px-7 text-[18px] font-semibold text-white transition hover:opacity-90"
          >
            Back to home
          </Link>
          <Link
            href="/stories"
            className="inline-flex h-[52px] items-center justify-center whitespace-nowrap rounded-full border border-ink px-7 text-[18px] font-semibold text-ink transition hover:bg-ink hover:text-white"
          >
            Read a story
          </Link>
        </div>
      </div>
    </section>
  );
}
