import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  "Mas de 30 años en el mercado mayorista",
  "Amplia variedad de productos de calidad",
  "Atencion personalizada por WhatsApp",
  "Envios a todo el pais",
  "Precios competitivos por bulto y unidad",
  "Stock permanente y novedades constantes",
]

export function AboutPreview() {
  return (
    <section className="bg-[#E6F6FD] py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div>
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-[#1EA7E1]">
              Quienes Somos
            </span>
            <h2 className="mb-6 text-3xl font-bold text-[#0B3C5D] sm:text-4xl">
              Tu distribuidora de{" "}
              <span className="text-[#1EA7E1]">confianza</span>
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              MITO YAMILE es una distribuidora mayorista consolidada, especializada en 
              jugueteria, libreria y regaleria. Ofrecemos un catalogo amplio con 
              precios competitivos para que tu comercio crezca.
            </p>

            {/* Features list */}
            <ul className="mb-8 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-[#22c55e]" />
                  <span className="text-sm text-[#0B3C5D]">{feature}</span>
                </li>
              ))}
            </ul>

            <Button asChild className="bg-[#0B3C5D] hover:bg-[#0a3350]">
              <Link href="/nosotros">
                Conoce mas sobre nosotros
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-card p-8 shadow-xl">
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-xl bg-[#E6F6FD] p-6 text-center">
                  <div className="mb-2 text-4xl font-bold text-[#1EA7E1]">30+</div>
                  <div className="text-sm text-muted-foreground">Años de experiencia</div>
                </div>
                <div className="rounded-xl bg-[#0B3C5D] p-6 text-center text-white">
                  <div className="mb-2 text-4xl font-bold">500+</div>
                  <div className="text-sm text-white/70">Clientes activos</div>
                </div>
                <div className="rounded-xl bg-[#FFC400] p-6 text-center">
                  <div className="mb-2 text-4xl font-bold text-[#0B3C5D]">1000+</div>
                  <div className="text-sm text-[#0B3C5D]/70">Productos en stock</div>
                </div>
                <div className="rounded-xl bg-[#22c55e] p-6 text-center text-white">
                  <div className="mb-2 text-4xl font-bold">24hs</div>
                  <div className="text-sm text-white/70">Respuesta rapida</div>
                </div>
              </div>
            </div>
            {/* Decorative */}
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-[#1EA7E1]/20" />
          </div>
        </div>
      </div>
    </section>
  )
}
