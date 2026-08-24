import Link from "next/link";
import Image from "next/image";
import { withBasePath } from "@/lib/basePath";

// Local illustration from the Lovable mockup, downloaded via the
// project token during the rebuild.
const ILLU = withBasePath("/images/illustrations/illustrations-1.svg");

/**
 * "What is ME/CFS?" empathy-banded section. Static copy in session 1.
 * In session 2 the body text moves into an ACF flexible-content field
 * so editors can update the disease description without a deploy.
 */
export function Disease() {
  return (
    <section className="w-full">
      <div className="bg-empathy text-ink">
        <div className="mx-auto w-full max-w-[1200px] px-7 py-16 md:px-12 md:grid md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-blue">
              What is ME/CFS?
            </p>
            <h2 className="headline mt-3 text-[34px] md:text-[52px] leading-[1] tracking-[-0.01em]">
              Imagine getting the flu — and never getting out of bed.
            </h2>
            <Image
              src={ILLU}
              alt=""
              aria-hidden
              width={440}
              height={400}
              className="mt-8 hidden md:block w-[220px] h-auto"
            />
          </div>
          <div className="md:col-span-7 space-y-5">
            <p className="mt-5 text-[17px] leading-[1.45] text-ink/85 md:mt-0">
              Myalgic Encephalomyelitis/Chronic Fatigue Syndrome (ME/CFS) is a
              serious, life-altering disease that can leave people unable to
              work, study, care for themselves, or even leave their bed. It
              affects people of all ages and often develops after an infection.
            </p>
            <p className="text-[17px] leading-[1.45] text-ink/85">
              Based on a prevalence of approximately 0.4% to 0.8%, an estimated{" "}
              <span className="font-semibold">
                32 to 65 million people worldwide are living with ME/CFS
              </span>
              . Despite its enormous impact, there are still no approved
              treatments, and the disease remains dramatically underfunded and
              underresearched.
            </p>
            <div>
              <Link
                href="/about#what"
                className="mt-6 inline-flex items-center gap-1.5 text-[17px] font-semibold text-blue"
              >
                Learn more about ME/CFS →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
