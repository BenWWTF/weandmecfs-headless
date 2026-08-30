"use client";

import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";

const DONATE_BASE = "https://donate.weandmecfs.org/de-at/";
const CONTACT_URL = "https://www.weandmecfs.org/contact/";
const TAX_DETAILS_URL =
  "https://www.weandmecfs.org/donate-and-help/#donation-account-information";

function donateUrl(amount: number, monthly: boolean): string {
  const params = new URLSearchParams({
    "rnw-amount": String(amount),
    "rnw-payment_type": monthly ? "recurring" : "single",
  });
  if (monthly) params.set("rnw-recurring_interval", "monthly");
  return `${DONATE_BASE}?${params.toString()}`;
}

const PRESETS = [25, 50, 75, 100, 250] as const;

const STICKER =
  "inline-flex items-center rounded-full border border-ink px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.08em]";
const EYEBROW =
  "text-[12px] font-bold uppercase tracking-[0.12em] text-ink/60";
const BLUE_KICKER =
  "text-[12px] font-bold uppercase tracking-[0.12em] text-blue";
const PATH_H2 =
  "headline text-[28px] leading-[1.1] md:text-[36px]";
const WHITE_PILL =
  "mt-auto inline-flex h-[48px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-ink bg-white px-6 text-[13px] font-bold uppercase tracking-[0.08em] text-ink transition hover:bg-ink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 md:w-[320px]";

const GUARDIANS = [
  {
    name: "Julia Scheve",
    role: "Awareness",
    bio: "Management consultant and fitness trainer in Vienna. Julia watched her best friend become ill with ME/CFS and now works on making the disease visible.",
  },
  {
    name: "Kathrin Fuchs",
    role: "Industry & network",
    bio: "Works in the pharmaceutical industry and knows how much even a small contribution can move. Kathrin’s support goes back to a school friendship, which makes this personal.",
  },
  {
    name: "Laura Karasinski",
    role: "Design & craft",
    bio: "Founder of a design studio in Vienna. Laura photographs the portraits of the team and gives that time and craft to the foundation. Her involvement goes back to a long friendship.",
  },
];

const OTHER_WAYS = [
  { label: "Become a Guardian4ME", href: "#guardians" },
  { label: "Partner with us as a company", href: "#companies" },
  { label: "Fund a research project", href: "#major-giving" },
  { label: "Share our campaigns", href: "#visibility" },
];

export default function SupportPage() {
  const [amount, setAmount] = useState<number | "other">(50);
  const [custom, setCustom] = useState("");
  const [monthly, setMonthly] = useState(true);

  const finalAmount = amount === "other" ? Number(custom) : amount;
  const disabled = !finalAmount || finalAmount < 1;

  const pillBase =
    "inline-flex min-h-[48px] items-center justify-center rounded-full border-[1.5px] border-ink px-4 py-3 text-[15px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2";
  const pillOn = "bg-blue border-blue text-white";
  const pillOff = "bg-white text-ink hover:border-blue hover:text-blue";

  return (
    <div className="min-h-screen bg-paper text-ink">
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-[1200px] px-7 pt-10 pb-10 md:px-12 md:pt-16">
          <p className={`${STICKER} bg-mint mb-6`}>
            Donate &amp; help · Reg. ZG 18163
          </p>
          <h1 className="headline text-[clamp(2.75rem,7vw,4.5rem)]">
            JOIN
            <br />
            OUR <span className="text-blue">CAUSE.</span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-[16px] leading-[1.5] text-ink/85 md:text-[17px]">
            Every donation, no matter the size, fuels critical research and
            brings us one step closer to a cure.{" "}
            <span className="font-bold text-ink">
              100% of your donation funds our mission.
            </span>
          </p>
        </section>

        {/* Donation form */}
        <section className="mx-auto max-w-[1200px] px-7 pt-4 md:px-12">
          <div className="max-w-[760px] rounded-[22px] border-[1.5px] border-ink bg-white p-6 md:p-8">
            <p className={EYEBROW}>Make a donation</p>
            <h2 className="headline mt-3 text-[26px] md:text-[32px]">
              Choose an amount
            </h2>

            <fieldset className="mt-6">
              <legend className={`${EYEBROW} mb-3`}>How often?</legend>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Monthly", value: true },
                  { label: "One-time", value: false },
                ].map((f) => (
                  <button
                    type="button"
                    key={f.label}
                    aria-pressed={monthly === f.value}
                    onClick={() => setMonthly(f.value)}
                    className={`${pillBase} uppercase tracking-[0.06em] ${
                      monthly === f.value ? pillOn : pillOff
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className={`${EYEBROW} mb-3`}>Amount</legend>
              <div className="grid grid-cols-3 gap-3">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={amount === p}
                    onClick={() => {
                      setAmount(p);
                      setCustom("");
                    }}
                    className={`${pillBase} ${amount === p ? pillOn : pillOff}`}
                  >
                    €{p}
                  </button>
                ))}
                <button
                  type="button"
                  aria-pressed={amount === "other"}
                  onClick={() => setAmount("other")}
                  className={`${pillBase} ${amount === "other" ? pillOn : pillOff}`}
                >
                  Other
                </button>
              </div>

              {amount === "other" && (
                <div className="mt-3 flex min-h-[48px] items-center overflow-hidden rounded-full border-[1.5px] border-ink bg-white focus-within:ring-2 focus-within:ring-blue">
                  <span className="pl-5 pr-2 text-[15px] font-bold">€</span>
                  <input
                    autoFocus
                    type="number"
                    min={1}
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="Amount"
                    aria-label="Custom amount in euro"
                    className="w-full bg-transparent py-3 pr-5 text-[16px] outline-none"
                  />
                </div>
              )}
            </fieldset>

            {disabled ? (
              <button
                type="button"
                disabled
                className="mt-6 inline-flex h-[52px] w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-urgency px-7 text-[16px] font-bold uppercase tracking-[0.06em] text-ink opacity-50"
              >
                Donate →
              </button>
            ) : (
              <a
                href={donateUrl(finalAmount, monthly)}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-urgency px-7 text-[16px] font-bold uppercase tracking-[0.06em] text-ink transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                Donate €{finalAmount}
                {monthly ? " / month" : ""} →
              </a>
            )}

            <p className="mt-4 text-center text-[13px] leading-[1.45] text-ink/60">
              You&rsquo;ll continue on our secure donation platform.
              Tax-deductible in Austria (Reg. Nr. ZG 18163). Cancel anytime.
            </p>
          </div>
        </section>

        {/* Two info boxes */}
        <section className="mx-auto max-w-[1200px] px-7 pt-10 md:px-12 md:pt-14">
          <div className="grid items-stretch gap-6 md:grid-cols-2">
            {/* Bank transfer */}
            <div className="flex flex-col rounded-[22px] bg-empathy p-6 md:p-8">
              <p className={EYEBROW}>Prefer a bank transfer?</p>
              <div className="mt-6 space-y-4 text-[15px] md:text-[16px]">
                {[
                  { label: "Account holder", value: "WE&ME Foundation" },
                  { label: "IBAN", value: "[IBAN]" },
                  { label: "BIC", value: "[BIC]" },
                  { label: "Reference", value: "Optional" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[120px_1fr] gap-4 md:grid-cols-[150px_1fr]"
                  >
                    <span className="text-ink">{row.label}</span>
                    <span className="break-all text-ink">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="pt-8" />
              <a
                href={TAX_DETAILS_URL}
                target="_blank"
                rel="noreferrer"
                className={WHITE_PILL}
              >
                Donation &amp; tax details →
              </a>
            </div>

            {/* Other ways to help */}
            <div className="flex flex-col rounded-[22px] bg-mint p-6 md:p-8">
              <p className={EYEBROW}>Other ways to help</p>
              <ul className="mt-6 space-y-4">
                {OTHER_WAYS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="inline-flex items-center gap-3 text-[16px] text-ink transition hover:text-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue md:text-[17px]"
                    >
                      <span aria-hidden>→</span>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="pt-8" />
              <a
                href={CONTACT_URL}
                target="_blank"
                rel="noreferrer"
                className={WHITE_PILL}
              >
                Contact the foundation →
              </a>
            </div>
          </div>
        </section>

        {/* Full-bleed mint: four support paths */}
        <section className="mt-10 bg-mint md:mt-14">
          <Reveal className="mx-auto max-w-[1200px] px-7 py-14 md:px-12 md:py-20">
            <div id="guardians" className="scroll-mt-24">
              <p className={BLUE_KICKER}>Exchange Energy</p>
              <h2 className={`mt-2 ${PATH_H2}`}>Become a Guardian4ME</h2>
              <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.55] text-ink/85 md:text-[17px]">
                Guardians4ME, a programme created by the WE&amp;ME Foundation,
                asks volunteers to contribute something patients are often
                unable to give: energy. By attending demonstrations, organising
                campaigns, creating content or speaking with policymakers,
                Guardians carry patients&rsquo; concerns into public and
                political debate when ME/CFS limits their ability to advocate
                for themselves. What unites Guardians is a shared commitment:
                to act where patients cannot.
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {GUARDIANS.map((p) => {
                  const initials = p.name
                    .split(/\s+/)
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();
                  return (
                    <article
                      key={p.name}
                      className="flex flex-col rounded-[22px] bg-white p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-[17px] font-bold leading-[1.2]">
                            {p.name}
                          </h3>
                          <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-ink/50">
                            {p.role}
                          </p>
                        </div>
                        <span
                          aria-hidden
                          className="h-12 w-12 shrink-0 rounded-full bg-blue/15 inline-flex items-center justify-center text-[12px] font-bold text-blue"
                        >
                          {initials}
                        </span>
                      </div>
                      <p className="mt-3 text-[15px] leading-[1.45] text-ink/80">
                        {p.bio}
                      </p>
                    </article>
                  );
                })}
              </div>

              <a
                href={CONTACT_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-1 text-[16px] font-bold text-blue no-underline hover:opacity-80"
              >
                Contact us →
              </a>
            </div>

            {/* Companies */}
            <div
              id="companies"
              className="mt-8 scroll-mt-24 border-t border-mint-line pt-8"
            >
              <p className={BLUE_KICKER}>Companies</p>
              <h2 className={`mt-2 ${PATH_H2}`}>
                Partner with us as a company
              </h2>
              <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.55] text-ink/85 md:text-[17px]">
                [Beschreibung dieses Unterstützungswegs. Länge nach Bedarf.]
              </p>
              <a
                href={CONTACT_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-1 text-[16px] font-bold text-blue no-underline hover:opacity-80"
              >
                Contact us →
              </a>
            </div>

            {/* Major giving */}
            <div
              id="major-giving"
              className="mt-8 scroll-mt-24 border-t border-mint-line pt-8"
            >
              <p className={BLUE_KICKER}>Major Giving</p>
              <h2 className={`mt-2 ${PATH_H2}`}>Fund a research project</h2>
              <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.55] text-ink/85 md:text-[17px]">
                [Beschreibung dessen, was es heißt, ein Forschungsprojekt zu
                tragen: Größenordnung, Ablauf und welche Rückmeldung Förderer
                erhalten. Länge nach Bedarf.]
              </p>
              <a
                href={CONTACT_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-1 text-[16px] font-bold text-blue no-underline hover:opacity-80"
              >
                Contact us →
              </a>
            </div>

            {/* Visibility */}
            <div
              id="visibility"
              className="mt-8 scroll-mt-24 border-t border-mint-line pt-8"
            >
              <p className={BLUE_KICKER}>Visibility</p>
              <h2 className={`mt-2 ${PATH_H2}`}>Share our campaigns</h2>
              <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.55] text-ink/85 md:text-[17px]">
                [Beschreibung der laufenden Kampagnen, des verfügbaren
                Materials und der Rolle, die Sichtbarkeit bei ME/CFS spielt.
                Länge nach Bedarf.]
              </p>
              <a
                href={CONTACT_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-1 text-[16px] font-bold text-blue no-underline hover:opacity-80"
              >
                Contact us →
              </a>
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
