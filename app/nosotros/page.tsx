import Link from "next/link"
import { ArrowRight, CheckCircle, Users, Target, Award, Truck, MessageCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

const WA_PRINCIPAL = "https://wa.me/5491150628422?text=Me%20gustaria%20consultar%20sobre%20unos%20productos%20de%20la%20Distribuidora%20Mito%20Yamile"

const values = [
  {
    icon: Users,
    title: "Atencion Personalizada",
    description: "Cada cliente es importante. Brindamos un servicio cercano y profesional.",
  },
  {
    icon: Target,
    title: "Calidad Garantizada",
    description: "Seleccionamos cuidadosamente cada producto que ofrecemos.",
  },
  {
    icon: Award,
    title: "Experiencia",
    description: "Mas de una decada en el mercado mayorista nos respalda.",
  },
  {
    icon: Truck,
    title: "Envios a Todo el Pais",
    description: "Llegamos a donde necesites con envios seguros y rapidos.",
  },
]

const features = [
  "Amplio stock permanente",
  "Precios competitivos mayoristas",
  "Actualizacion constante de productos",
  "Atencion por WhatsApp inmediata",
  "Variedad de rubros en un solo lugar",
  "Facilidades de pago",
]

export default function NosotrosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#0B3C5D] py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-white/20" />
            <div className="absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-[#FFC400]/20" />
          </div>
          <div className="container relative mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-3xl text-center text-white">
              <h1 className="mb-6 text-4xl font-bold sm:text-5xl">
                Quienes Somos
              </h1>
              <p className="text-xl text-white/80">
                Conoce la historia y los valores de MITO YAMILE
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Story */}
              <div>
                <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-[#1EA7E1]">
                  Nuestra Historia
                </span>
                <h2 className="mb-6 text-3xl font-bold text-[#0B3C5D]">
                  Mas de 30 años trabajando para vos
                </h2>
                <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    MITO YAMILE nacio como un emprendimiento familiar 
                    con la vision de ofrecer productos de calidad a precios mayoristas 
                    accesibles para comerciantes de toda la region.
                  </p>
                  <p>
                    Con el paso de los anos, fuimos creciendo y ampliando nuestra oferta, 
                    convirtiéndonos en una distribuidora de referencia en jugueteria, 
                    libreria, regaleria y mas.
                  </p>
                  <p>
                    Hoy somos una distribuidora consolidada que mantiene los valores 
                    que nos caracterizaron desde el primer dia: honestidad, calidad, 
                    precios competitivos y atencion personalizada.
                  </p>
                </div>
              </div>

              {/* Stats Card */}
              <div className="relative">
                <div className="overflow-hidden rounded-2xl bg-card p-8 shadow-xl">
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
                      <div className="mb-2 text-4xl font-bold">100%</div>
                      <div className="text-sm text-white/70">Compromiso</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-[#1EA7E1]/20" />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-[#E6F6FD] py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-12 text-center">
              <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-[#1EA7E1]">
                Nuestros Valores
              </span>
              <h2 className="text-3xl font-bold text-[#0B3C5D]">
                Por que elegirnos
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <div
                    key={value.title}
                    className="rounded-xl bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#1EA7E1] text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-bold text-[#0B3C5D]">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features List */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-[#1EA7E1]">
                Ventajas
              </span>
              <h2 className="mb-8 text-3xl font-bold text-[#0B3C5D]">
                Que ofrecemos
              </h2>

              <div className="grid gap-4 text-left sm:grid-cols-2">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4"
                  >
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-[#22c55e]" />
                    <span className="text-[#0B3C5D]">{feature}</span>
                  </div>
                ))}
              </div>

              <Button asChild className="mt-8 bg-[#1EA7E1] hover:bg-[#1794c7]">
                <Link href="/catalogo">
                  Explorar Catalogo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0B3C5D] py-16">
          <div className="container mx-auto px-4 text-center lg:px-8">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Listo para comprar?
            </h2>
            <p className="mb-8 text-lg text-white/70">
              Contactanos y empeza a disfrutar de los mejores precios mayoristas
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild className="bg-[#1EA7E1] hover:bg-[#1794c7]">
                <Link href="/catalogo">
                  Ver Catalogo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="bg-[#22c55e] hover:bg-[#16a34a]">
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
        </section>
      </main>
      <Footer />
    </>
  )
}
