import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const WA_PRINCIPAL = "https://wa.me/5491150628422?text=Me%20gustaria%20consultar%20sobre%20unos%20productos%20de%20la%20Distribuidora%20Mito%20Yamile"

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#1EA7E1] py-16 lg:py-20">
      {/* Decorative elements */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFC400]/20" />

      <div className="container relative mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Empeza tu pedido ahora
          </h2>
          <p className="mb-8 text-lg text-white/80">
            Explora nuestro catalogo mayorista, arma tu pedido y cerralo directo por WhatsApp.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 w-full bg-white px-8 text-base font-semibold text-[#1EA7E1] hover:bg-white/90 sm:w-auto"
            >
              <Link href="/catalogo">
                Ver Catalogo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="h-12 w-full bg-[#22c55e] px-8 text-base font-semibold text-white hover:bg-[#16a34a] sm:w-auto"
            >
              <a
                href={WA_PRINCIPAL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contactar por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
