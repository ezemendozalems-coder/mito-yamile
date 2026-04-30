import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedBlocks } from "@/components/home/featured-blocks"
import { AboutPreview } from "@/components/home/about-preview"
import { HowToBuy } from "@/components/home/how-to-buy"
import { FAQSection } from "@/components/home/faq-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <FeaturedBlocks />
        <AboutPreview />
        <HowToBuy />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
