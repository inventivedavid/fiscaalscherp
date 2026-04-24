import { Nav } from "@/components/platform/Nav";
import { Hero } from "@/components/platform/Hero";
import { StatsStrip } from "@/components/platform/StatsStrip";
import { ProductMap } from "@/components/platform/ProductMap";
import { Methodology } from "@/components/platform/Methodology";
import { PricingBlock } from "@/components/platform/PricingBlock";
import { FAQ } from "@/components/platform/FAQ";
import { ClosingCTA } from "@/components/platform/ClosingCTA";
import { Footer } from "@/components/platform/Footer";

export const revalidate = 120;

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StatsStrip />
        <ProductMap />
        <Methodology />
        <PricingBlock />
        <FAQ />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
