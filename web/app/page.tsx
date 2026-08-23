import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import { WhyFund } from "@/components/home/WhyFund";
import { Researcher } from "@/components/home/Researcher";
import { Disease } from "@/components/home/Disease";
import { Stories } from "@/components/home/Stories";
import { Campaign } from "@/components/home/Campaign";
import { Guardians } from "@/components/home/Guardians";
import { BarsDivider } from "@/components/home/BarsDivider";
import { Latest } from "@/components/home/Latest";
import { getProjects } from "@/lib/wp";

export const revalidate = 60;

export default async function HomePage() {
  // WhyFund needs the projects up front (it's a client component
  // because of GSAP, but the data is server-fetched and passed in).
  const projects = await getProjects();

  return (
    <>
      <Hero />
      <WhyFund projects={projects} />
      <Suspense fallback={null}>
        <Researcher />
        <Disease />
        <Stories />
        <Campaign />
        <Guardians />
      </Suspense>
      <BarsDivider />
      <Suspense fallback={null}>
        <Latest />
      </Suspense>
    </>
  );
}
