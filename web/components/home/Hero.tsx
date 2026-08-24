import Image from "next/image";
import { withBasePath } from "@/lib/basePath";

const DONATE_URL = "https://donate.weandmecfs.org/en-us/";

// Real hero image — `hero-bed.jpg` from the GitHub mockup, downloaded
// from the Lovable CDN during the rebuild.
const HERO_IMAGE = withBasePath("/images/hero.jpg");

/**
 * Homepage hero. Photo of a person with ME/CFS, sitting up in bed by
 * a bright window — the same asset the Lovable mockup uses, pulled
 * straight from the cdn via the project token.
 */
export function Hero() {
  return (
    <>
      {/* Mobile: text over the photo */}
      <section className="md:hidden relative h-[calc(100svh-64px)] w-full overflow-hidden text-white">
        <Image
          src={HERO_IMAGE}
          alt="A person with ME/CFS sitting up in bed by a bright window."
          width={768}
          height={1376}
          priority
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(6,10,8,0) 0%, rgba(6,10,8,0) 40%, rgba(6,10,8,0.45) 56%, rgba(6,10,8,0.75) 72%, rgba(6,10,8,0.88) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 px-7 pb-8 text-left">
          <h1 className="headline text-[min(48px,11vw)] font-semibold normal-case leading-[1] tracking-[-0.025em] text-white">
            <span className="whitespace-nowrap">A future without</span>
            <br />
            ME/CFS.
          </h1>
          <p className="mt-5 max-w-[34ch] text-[18px] font-normal leading-[1.4] text-white/80">
            Millions are bedridden. To restore their health, join us with a
            donation: 100% goes to research. The Ströck family covers all
            organizational&nbsp;costs.
          </p>
          <a
            id="hero-donate"
            href={DONATE_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex h-[52px] items-center justify-center whitespace-nowrap rounded-full bg-blue px-7 text-[18px] font-bold text-white transition hover:opacity-90"
          >
            Fund the Research
          </a>
        </div>
      </section>

      {/* Desktop */}
      <section className="relative hidden md:block w-full h-[calc(100svh-64px)] min-h-[560px] overflow-hidden text-white">
        <Image
          src={HERO_IMAGE}
          alt="A person with ME/CFS sitting up in bed by a bright window."
          width={768}
          height={1376}
          priority
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* The portrait asset is much taller than the container; the
            gradient only kicks in over the bottom ~40 % so the person's
            face and torso in the middle of the image are not darkened. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent from-50% to-black/70"
        />
        <div className="absolute inset-x-0 bottom-0 px-12 pb-8">
          <div className="mx-auto max-w-[1200px]">
            <h1 className="headline text-[clamp(2rem,7vw,5rem)] max-w-3xl normal-case">
              A future without ME/CFS.
            </h1>
            <p className="mt-3 max-w-xl text-[17px] leading-[1.45] text-white/85">
              Millions are bedridden. Be part of the solution to restore their
              health.
            </p>
            <a
              href={DONATE_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex h-[52px] items-center justify-center whitespace-nowrap rounded-full bg-blue px-7 text-[18px] font-bold text-white transition hover:opacity-90"
            >
              Fund the Research
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
