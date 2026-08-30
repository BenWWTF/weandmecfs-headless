import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/basePath";
import { Reveal } from "@/components/site/Reveal";
import { Split } from "@/components/site/Split";

export const revalidate = 300;

export async function generateMetadata() {
  return {
    title: "About ME/CFS — WE&ME Foundation",
    description:
      "Myalgic encephalomyelitis / chronic fatigue syndrome is a debilitating disease affecting 20M+ people worldwide. Learn what it is, and what it isn't.",
  };
}

const ILLU = withBasePath("/images/illustrations/illustrations-1.svg");
const PORTRAIT_REST = withBasePath("/images/portrait-rest.jpg");
const STORY_MILA = withBasePath("/images/stories/mila.jpg");

const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.08em] text-blue";
const HEADLINE =
  "headline text-[34px] md:text-[52px] lg:text-[40px] font-semibold leading-[1] tracking-[-0.01em]";
const BODY = "text-[17px] leading-[1.5] text-ink/85 max-w-[65ch]";
const WRAP = "mx-auto w-full max-w-[1200px] px-7 py-16 md:px-12";

const whoFacts = [
  "Approximately 0.4% to 0.8% of the population: between 32 and 65 million people worldwide, with high uncertainty due to the lack of research.",
  "All age groups are affected: children, young adults, and older adults.",
  "Up to three quarters of those affected are women.",
  "The disease frequently develops following a bacterial or viral infection, such as Epstein-Barr virus infection or COVID-19.",
  "Other reported triggers include surgery, accidents, and toxic exposures.",
];

const comorbidities = [
  {
    title: "POTS – Postural Orthostatic Tachycardia Syndrome",
    body: "The circulatory disturbances (orthostatic intolerance) associated with ME/CFS frequently manifest as POTS, a disorder of the autonomic nervous system in which the body has difficulty regulating blood circulation when standing up. When moving from a lying or sitting position to standing, the heart rate increases markedly without a corresponding drop in blood pressure. Typical symptoms include palpitations, dizziness, and light-headedness.",
  },
  {
    title: "MCAS – Mast Cell Activation Syndrome",
    body: "Mast cells are part of the body's innate immune system and play an important role in the body's defence against disease. In the chronic immunological disorder MCAS, they are activated too easily and too frequently, resulting in the release of pro-inflammatory substances. Because mast cells are found throughout the body's tissues and mucous membranes, symptoms are diverse. They range from skin rashes to gastrointestinal complaints, shortness of breath, and severe headaches.",
  },
  {
    title: "hEDS – Hypermobile Ehlers-Danlos Syndrome",
    body: "In this hereditary disorder, the connective tissue in the joints, skin, and blood vessels is less stable than usual because of alterations in collagen structure. The characteristic features of hEDS are joint hypermobility and hyperextensible skin. Typical symptoms include chronic pain, often affecting the muscles and joints, and rapid fatigability.",
  },
  {
    title: "SFN – Small Fiber Neuropathy",
    body: "SFN is a disorder affecting the small, thin nerve fibres responsible for pain, temperature, and autonomic sensation, and can usually be diagnosed by means of a skin biopsy. Typical symptoms include burning or stabbing pain beginning in the hands and feet, hypersensitivity to touch, and impaired sweating and temperature regulation.",
  },
];

function GraphicPlaceholder({ caption }: { caption: string }) {
  return (
    <figure className="mt-8 w-full rounded-2xl border border-dashed border-ink/15 bg-ink/5 px-6 py-14">
      <figcaption className="text-center">
        <span className="block text-[11px] uppercase tracking-[0.08em] text-ink/45">
          Graphic, in preparation
        </span>
        <span className="mt-2 block text-[15px] text-ink/50">{caption}</span>
      </figcaption>
    </figure>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="w-full bg-empathy text-ink">
        <Reveal className={`${WRAP} md:grid md:grid-cols-12 md:gap-16`}>
          <div className="md:col-span-8">
            <p className={EYEBROW}>What is ME/CFS?</p>
            <h1 className="headline mt-3 text-[40px] md:text-[64px] leading-[1] tracking-[-0.01em]">
              Imagine getting the flu, and never getting out of bed.
            </h1>
            <p className="mt-6 text-[17px] leading-[1.5] text-ink/85 max-w-[60ch]">
              Myalgic encephalomyelitis / chronic fatigue syndrome (ME/CFS) is
              one of the most disabling, and most ignored, chronic diseases of
              our time. It can happen to anyone.
            </p>
          </div>
          <div className="md:col-span-4 md:flex md:items-end md:justify-end">
            <Image
              src={ILLU}
              alt=""
              aria-hidden
              width={220}
              height={200}
              className="hidden md:block w-[220px] h-auto"
            />
          </div>
        </Reveal>
      </section>

      {/* What */}
      <section id="what" className="scroll-mt-24 bg-white">
        <Reveal className={WRAP}>
          <Split
            left={
              <>
                <p className={EYEBROW}>What is ME/CFS?</p>
                <h2 className="headline text-[28px] md:text-[40px] font-semibold leading-[1] tracking-[-0.01em] mt-3">
                  Myalgic Encephalomyelitis / Chronic Fatigue Syndrome
                </h2>
              </>
            }
          >
            <p className={`${BODY} mt-5`}>
              ME/CFS is a debilitating chronic disease that greatly reduces
              people&rsquo;s ability to function. Even minor physical and
              cognitive exertion can lead to a worsening of their condition and
              an aggravation of symptoms. This deterioration often occurs only
              hours or days after the exertion. Recovery may take a very long
              time and may remain incomplete. This characteristic phenomenon is
              known as Post-Exertional Malaise (PEM), the hallmark symptom of
              ME/CFS.
            </p>
            <p className={`${BODY} mt-5`}>
              The most common symptoms include profound exhaustion, a flu-like
              malaise, unrefreshing sleep, pain, gastrointestinal complaints,
              and difficulties with thinking, memory, or concentration. During an
              episode of PEM, symptoms become more severe, and new symptoms
              often appear as well. Repeated episodes of PEM may lead to a
              permanent worsening of the disease.
            </p>
            <p className={`${BODY} mt-5`}>
              For many people affected, even everyday sensory stimuli such as
              noise, light, smells, or touch constitute a burden that
              exacerbates their symptoms. Prolonged sitting or standing also
              frequently worsens their condition.
            </p>
          </Split>
        </Reveal>
      </section>

      {/* Who */}
      <section id="who" className="scroll-mt-24 bg-mint text-ink">
        <Reveal className={WRAP}>
          <Split
            left={
              <>
                <p className={EYEBROW}>Who develops ME/CFS?</p>
                <h2 className={`${HEADLINE} mt-3`}>Anyone. At any age.</h2>
              </>
            }
          >
            <ul className="mt-8 divide-y divide-ink/20 border-t border-b border-ink/20">
              {whoFacts.map((fact) => (
                <li key={fact} className={`${BODY} py-5 md:py-7`}>
                  {fact}
                </li>
              ))}
            </ul>
          </Split>
        </Reveal>
      </section>

      {/* Severity */}
      <section id="severity" className="scroll-mt-24 bg-white">
        <Reveal className={WRAP}>
          <Split
            left={
              <>
                <p className={EYEBROW}>Severity and disease burden</p>
                <h2 className={`${HEADLINE} mt-3`}>Often invisible. Often devastating.</h2>
              </>
            }
          >
            <p className={`${BODY} mt-5`}>
              People with ME/CFS often do not appear ill, yet they are often
              severely impaired. Work, school or university studies, social
              activities, and everyday tasks are frequently possible only to a
              limited extent or no longer possible at all.
            </p>
            <p className={`${BODY} mt-5`}>
              In severe and very severe cases, those affected are bedridden and
              dependent on assistance for all activities of daily living. In
              rare cases, nutrition via a feeding tube may also become
              necessary. Many are required to remain constantly in a dark, quiet
              room. They spend most of their time in near-complete isolation,
              without distraction or stimulation from conversation, reading, or
              television. Compared with many other diseases, people with
              severe ME/CFS experience among the lowest levels of quality of
              life.
            </p>
            <figure className="mt-8">
              <Image
                src={PORTRAIT_REST}
                alt="A person resting in a darkened room"
                width={1600}
                height={900}
                className="aspect-[16/9] w-full rounded-2xl object-cover"
              />
            </figure>
            <GraphicPlaceholder caption="Graphic: quality of life in comparison" />
            <p className={`${BODY} mt-5`}>
              Because of the severity of the disease, its chronic course, and
              its relative prevalence, the global disease burden of ME/CFS is
              high: it is estimated to be twice that of HIV/AIDS, for example.
              The disease also imposes substantial societal costs through lost
              productivity, as young people affected may be unable to complete
              their education and adults may leave the workforce. Family
              members caring for severely affected individuals may also have to
              give up employment.
            </p>
            <p className={`${BODY} mt-5`}>
              Despite this, ME/CFS is dramatically underfunded. Studies
              comparing research funding with disease burden demonstrate this
              clearly. In the United States, research funding for ME/CFS provided
              by the National Institutes of Health (NIH) amounts to only about
              1% of what would be appropriate given the disease burden.
            </p>
            <GraphicPlaceholder caption="Graphic: NIH funding for ME/CFS compared with other diseases (CrunchME)" />
            <p className={`${BODY} mt-5`}>
              The severity and disease burden of ME/CFS highlight the urgent
              need for increased attention and support for both specialised
              treatment centres and ME/CFS research.
            </p>
          </Split>
        </Reveal>
      </section>

      {/* Course, diagnosis & treatment */}
      <section id="course" className="scroll-mt-24 bg-empathy text-ink">
        <Reveal className={WRAP}>
          <Split
            left={
              <>
                <p className={EYEBROW}>Course, diagnosis &amp; treatment</p>
                <h2 className={`${HEADLINE} mt-3`}>No test. No cure. Not yet.</h2>
              </>
            }
          >
            <p className={`${BODY} mt-5`}>
              ME/CFS may begin suddenly or develop gradually. The nature and
              severity of symptoms often change over the course of the illness.
              In the long term, some people experience an improvement in their
              health status, whereas in others it remains unchanged or
              continues to deteriorate. While recovery is common in the first
              few years of illness, complete recovery after this is rare.
              Recovery seems to be more likely in children and young people.
              For most people affected beyond three years from onset, ME/CFS is
              a severely disabling, chronic, long-term illness.
            </p>
            <p className={`${BODY} mt-5`}>
              The causes of ME/CFS are not yet understood. There is no
              laboratory test that can confirm the disease. Diagnosis is based
              on the characteristic symptoms, which must substantially impair
              daily life and persist for several months. In addition, other
              conditions with similar symptoms must be ruled out.
            </p>
            <p className={`${BODY} mt-5`}>
              At present, there is no cure and no disease-modifying treatment
              for ME/CFS that has been proven effective. Treatment primarily
              targets individual symptoms such as sleep disturbances, pain, or
              orthostatic intolerance. Many people benefit from adapting their
              activities to their available capacity and avoiding PEM
              (pacing).
            </p>
            <p className={`${BODY} mt-5`}>
              Therapies involving the gradual increase of physical activity,
              such as Graded Exercise Therapy (GET), have not been shown to
              provide benefit. Many people treated with these approaches report
              a long-term or permanent deterioration in their health.
              Consequently, several medical guidelines advise against such
              approaches. According to current knowledge, Cognitive Behavioural
              Therapy (CBT) also does not improve the disease itself.
            </p>
          </Split>
        </Reveal>
      </section>

      {/* Terminology & comorbidities */}
      <section id="terminology" className="scroll-mt-24 bg-white">
        <Reveal className={WRAP}>
          <Split
            left={
              <>
                <p className={EYEBROW}>Terminology &amp; comorbidities</p>
                <h2 className={`${HEADLINE} mt-3`}>One disease. Many names.</h2>
              </>
            }
          >
            <p className={`${BODY} mt-5`}>
              During the twentieth century, the disease was referred to by
              various names, all of which are problematic in different ways.
              The most commonly used terms are Myalgic Encephalomyelitis (ME)
              and Chronic Fatigue Syndrome (CFS). The World Health
              Organization classifies both ME and CFS as neurological diseases
              under the same ICD-10 code G93.3.
            </p>
            <p className={`${BODY} mt-5`}>
              In recent years, the combined term ME/CFS has become increasingly
              established in the scientific literature and has been adopted by
              healthcare providers, professionals, and patient organisations.
              In keeping with this emerging consensus, the technical term
              ME/CFS is used here to refer to the disease, without prejudice
              regarding its pathology.
            </p>
            <p className={`${BODY} mt-5`}>
              Many people with ME/CFS also experience additional medical
              conditions that can further increase the limitations caused by
              ME/CFS. Conversely, pre-existing conditions or comorbidities may
              also worsen as a result of ME/CFS. The precise relationships
              between these conditions remain insufficiently understood. Their
              frequent co-occurrence may indicate related and interconnected
              disease mechanisms.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-12">
              {comorbidities.map((c) => (
                <div key={c.title}>
                  <h3 className="headline text-[22px] font-semibold leading-[1.1]">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[17px] leading-[1.5] text-ink/85">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </Split>
        </Reveal>
      </section>

      {/* Closing */}
      <section className="scroll-mt-24 bg-white">
        <Reveal className={WRAP}>
          <p className={EYEBROW}>From the lives of those affected</p>
          <h2 className={`${HEADLINE} mt-3`}>Real people. Real stakes.</h2>
          <div className="mt-8 max-w-[420px]">
            <Image
              src={STORY_MILA}
              alt="Portrait from the WE&ME story series"
              width={1200}
              height={900}
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
          </div>
          <Link
            href="/stories"
            className="mt-6 inline-flex items-center text-[16px] font-semibold text-blue no-underline hover:opacity-80"
          >
            All stories →
          </Link>
        </Reveal>
      </section>
    </>
  );
}
