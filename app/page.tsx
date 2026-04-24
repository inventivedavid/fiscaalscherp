import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ProblemRecognition } from "@/components/ProblemRecognition";
import { Solution } from "@/components/Solution";
import { HowItWorks } from "@/components/HowItWorks";
import { WhatYouGet } from "@/components/WhatYouGet";
import { SocialProof } from "@/components/SocialProof";
import { AboutMaker } from "@/components/AboutMaker";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

// Hero A/B-variant via URL: ?v=a | b | c
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v } = await searchParams;
  const variant: "a" | "b" | "c" =
    v === "a" || v === "c" ? v : "b";

  return (
    <>
      <Nav />
      <main>
        <Hero variant={variant} />
        <ProblemRecognition />
        <Solution />
        <HowItWorks />
        <WhatYouGet />
        <SocialProof />
        <AboutMaker />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
