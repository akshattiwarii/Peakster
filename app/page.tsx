import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { PartnersSection } from "@/components/partners-section";

export default function Home() {
  return (
    <main className="min-h-screen font-sans">
      <Navbar />
      <HeroSection />
      <PartnersSection />
    </main>
  );
}
