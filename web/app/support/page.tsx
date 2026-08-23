"use client";

import { useState } from "react";

const DONATE_BASE = "https://donate.weandmecfs.org/de-at/";

function donateUrl(amount: number, monthly: boolean): string {
  const params = new URLSearchParams({
    "rnw-amount": String(amount),
    "rnw-payment_type": monthly ? "recurring" : "single",
  });
  if (monthly) params.set("rnw-recurring_interval", "monthly");
  return `${DONATE_BASE}?${params.toString()}`;
}

const PRESETS = [5, 15, 30, 50, 100];
const ALLOCATIONS = [
  { pct: "70%", label: "Biomedical research grants & fellowships" },
  { pct: "20%", label: "Patient & family support" },
  { pct: "10%", label: "Public awareness campaigns" },
];

const OTHER_WAYS = [
  "Become a Guardian4ME",
  "Partner with us as a company",
  "Fund a research project",
  "Share our campaigns",
];

const STICKER =
  "inline-flex items-center rounded-full border border-ink px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.08em]";

export default function SupportPage() {
  const [amount, setAmount] = useState(5);
  const [custom, setCustom] = useState("");
  const [monthly, setMonthly] = useState(true);

  const finalAmount = Number(custom) || amount;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-[1400px] px-5 pt-10 pb-10 md:px-10 md:pt-16">
          <p className={`${STICKER} bg-urgency mb-6`}>
            Donate &amp; help · Reg. ZG 18163
          </p>
          <h1 className="headline text-[clamp(3rem,10vw,9rem)]">
            JOIN
            <br />
            OUR <span className="text-blue">CAUSE.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl leading-snug text-ink/80">
            Every donation, no matter the size, fuels critical research and
            brings us one step closer to a cure.{" "}
            <span className="bg-urgency px-1">
              100% of your donation funds our mission.
            </span>
          </p>
        </section>

        {/* Donation form + side rail */}
        <section className="mx-auto max-w-[1400px] px-5 pb-20 md:px-10 md:pb-28 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7 rounded-[2rem] border border-ink bg-paper p-6 md:p-10">
            <p className="headline text-xs text-ink/50">Make a donation</p>
            <h2 className="headline mt-2 text-3xl md:text-4xl">Choose an amount</h2>

            <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setAmount(p); setCustom(""); }}
                  className={`${STICKER} justify-center py-3 text-base transition ${
                    amount === p && !custom
                      ? "bg-blue text-white border-ink"
                      : "bg-paper hover:bg-mint"
                  }`}
                >
                  €{p}
                </button>
              ))}
            </div>

            <label className="mt-6 block">
              <span className="headline text-xs text-ink/60">
                Or enter a custom amount
              </span>
              <div className="mt-2 flex items-center border border-ink rounded-full overflow-hidden bg-paper focus-within:ring-2 focus-within:ring-blue">
                <span className="px-4 headline">€</span>
                <input
                  type="number"
                  min={1}
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder="Amount"
                  className="w-full bg-transparent py-3 pr-4 outline-none text-lg"
                />
              </div>
            </label>

            <fieldset className="mt-6">
              <legend className="headline text-xs text-ink/60 mb-2">
                Frequency
              </legend>
              <div className="flex gap-2">
                {[
                  { label: "One-time", monthly: false },
                  { label: "Monthly", monthly: true },
                ].map((f) => (
                  <button
                    type="button"
                    key={f.label}
                    onClick={() => setMonthly(f.monthly)}
                    className={`flex-1 ${STICKER} justify-center py-3 ${
                      monthly === f.monthly
                        ? "bg-urgency"
                        : "bg-paper hover:bg-mint"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <a
              href={donateUrl(finalAmount, monthly)}
              target="_blank"
              rel="noreferrer"
              className={`mt-8 w-full ${STICKER} bg-blue text-white border-ink py-4 text-lg hover:-rotate-1 transition-transform justify-center`}
            >
              Donate €{finalAmount}
              {monthly ? " / month" : ""} →
            </a>

            <p className="mt-4 text-xs text-ink/50 text-center">
              You&rsquo;ll continue on our secure donation platform. Donations
              are tax-deductible in Austria (Reg. Nr. ZG 18163).
            </p>
          </div>

          <aside className="md:col-span-5 space-y-6">
            <div id="donations" className="rounded-[2rem] border border-ink bg-mint p-6 md:p-8">
              <p className="headline text-xs text-ink/60">Where it goes</p>
              <ul className="mt-4 space-y-4">
                {ALLOCATIONS.map((r) => (
                  <li
                    key={r.pct}
                    className="flex items-baseline justify-between border-b border-ink/20 pb-3 last:border-0"
                  >
                    <span className="headline text-2xl">{r.pct}</span>
                    <span className="text-sm text-ink/80 text-right ml-4">
                      {r.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div id="guardian" className="rounded-[2rem] border border-ink bg-empathy p-6 md:p-8">
              <p className="headline text-xs text-ink/60">Other ways to help</p>
              <ul className="mt-4 space-y-3 text-lg">
                {OTHER_WAYS.map((w) => (
                  <li key={w}>→ {w}</li>
                ))}
              </ul>
              <a
                href="https://www.weandmecfs.org/contact/"
                target="_blank"
                rel="noreferrer"
                className={`${STICKER} mt-6 bg-paper hover:-rotate-2 transition-transform`}
              >
                Contact the foundation →
              </a>
            </div>

            <div id="materials" className="rounded-[2rem] border border-ink bg-urgency p-6 md:p-8">
              <p className="headline text-xs text-ink/60">Bank transfer</p>
              <p className="mt-3 headline text-lg leading-tight">
                WE&amp;ME FOUNDATION
              </p>
              <a
                href="https://www.weandmecfs.org/donate-and-help/#donation-account-information"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm underline underline-offset-4"
              >
                Show account details →
              </a>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
