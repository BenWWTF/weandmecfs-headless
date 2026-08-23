import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/basePath";

const PHOTO = withBasePath("/images/researcher-portrait.jpg");

/**
 * "From the lab" — the researcher quote section.
 *
 * Currently a static Akiko Iwasaki placeholder, mirroring the
 * upstream mockup. The placeholder is documented in the source
 * as needing replacement with an approved quote before
 * publishing. The real Scientific Advisory Board lives on the
 * /foundation page.
 */
export function Researcher() {
  return (
    <section className="bg-[#f0f6ef]">
      <div className="mx-auto w-full max-w-[1200px] px-7 py-12 md:px-12">
        <div className="md:flex md:items-center md:gap-12">
          <div className="md:order-2 md:flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue md:hidden">
              From the lab
            </p>
            <div className="mt-5 w-[260px] max-w-full overflow-hidden rounded-2xl md:hidden">
              <Image
                src={PHOTO}
                alt="Portrait of Akiko Iwasaki"
                width={520}
                height={650}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-[50%_20%]"
              />
            </div>

            <figure>
              <p className="hidden md:block text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
                From the lab
              </p>
              {/* PLACEHOLDER – replace with Akiko Iwasaki's approved sentence before publishing. */}
              <blockquote className="mt-8 md:mt-4">
                <p className="headline text-[24px] md:text-[32px] font-semibold normal-case leading-[1.3] tracking-[-0.01em] text-ink">
                  &ldquo;ME/CFS has never lacked patients or questions, only
                  funding. WE&amp;ME is taking that seriously, with real
                  rigour.&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-5">
                <span className="block text-[17px] font-normal leading-[1.4] text-ink">
                  Akiko Iwasaki
                </span>
                <span className="block text-[15px] leading-[1.4] text-ink/55">
                  Sterling Professor of Immunobiology, Yale School of Medicine
                </span>
                <span className="block text-[15px] leading-[1.4] text-ink/55">
                  HHMI Investigator
                </span>
              </figcaption>
              <div className="mt-4 flex items-center gap-4">
                <a
                  href="https://x.com/VirusesImmunity"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Akiko Iwasaki on X"
                  className="text-ink hover:text-blue transition-colors"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                    <path d="M17.5 3h3.1l-6.8 7.8L21.8 21h-6.2l-4.4-5.7L6 21H2.9l7.3-8.3L2.5 3h6.4l4 5.3L17.5 3Zm-1.1 16.1h1.7L7.7 4.8H5.9l10.5 14.3Z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/akiko-iwasaki-4b90a21b1/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Akiko Iwasaki on LinkedIn"
                  className="text-ink hover:text-blue transition-colors"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.76-1.95C21.4 8.75 22 11 22 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3-2 0-2.3 1.57-2.3 3.2V21h-4V9Z" />
                  </svg>
                </a>
              </div>
            </figure>
          </div>

          <div className="hidden md:block md:order-1 md:w-[380px] md:shrink-0">
            <div className="overflow-hidden rounded-2xl">
              <Image
                src={PHOTO}
                alt="Portrait of Akiko Iwasaki"
                width={760}
                height={950}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-[50%_20%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
