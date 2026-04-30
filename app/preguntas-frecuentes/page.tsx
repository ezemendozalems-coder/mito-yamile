import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FAQSection } from "@/components/home/faq-section"

export default function PreguntasFrecuentesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
