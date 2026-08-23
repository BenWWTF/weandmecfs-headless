import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata = {
  title: "Shop — WE&ME Foundation",
  description:
    "The WE&ME shop is coming. Everything sold here funds biomedical research, with overhead covered by the Ströck family.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <SiteNav />
      <main className="mx-auto w-full max-w-[1200px] px-7 py-16 md:px-12 md:py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
          Shop
        </p>
        <h1 className="headline mt-3 text-[34px] font-semibold leading-[1] tracking-[-0.01em] md:text-[52px]">
          The WE&amp;ME shop is coming.
        </h1>
        <p className="mt-5 max-w-[34ch] text-[17px] leading-[1.45] text-ink/85">
          Everything sold here will fund research the same way a donation
          does: 100% to research, overhead covered by the Ströck family. Sign
          up to the newsletter and we&apos;ll tell you when it opens.
        </p>
        <Link
          href="/blog#newsletter"
          className="mt-8 inline-flex h-[52px] items-center justify-center whitespace-nowrap rounded-full bg-blue px-7 text-[18px] font-semibold text-white transition hover:opacity-90"
        >
          Get the newsletter
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
