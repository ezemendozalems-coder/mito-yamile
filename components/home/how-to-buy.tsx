"use client"

import { Search, ShoppingCart, MessageCircle, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Explora el catalogo",
    description: "Navega por nuestras categorias y encuentra los productos que necesitas",
    color: "bg-[#1EA7E1]",
    number: "01",
  },
  {
    icon: ShoppingCart,
    title: "Agrega al pedido",
    description: "Selecciona los productos y agregalos a tu carrito de compras",
    color: "bg-[#FFC400]",
    number: "02",
  },
  {
    icon: MessageCircle,
    title: "Finaliza por WhatsApp",
    description: "Envia tu pedido directamente por WhatsApp con un solo click",
    color: "bg-[#22c55e]",
    number: "03",
  },
  {
    icon: CheckCircle,
    title: "Recibe tu pedido",
    description: "Coordinamos el envio o retiro de tu pedido",
    color: "bg-[#0B3C5D]",
    number: "04",
  },
]

export function HowToBuy() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-[#1EA7E1]">
            Proceso simple
          </span>
          <h2 className="mb-4 text-3xl font-bold text-[#0B3C5D] sm:text-4xl">
            Como comprar
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            En 4 simples pasos podes realizar tu pedido mayorista
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className="group relative text-center"
              >
                {/* Connector line - hidden on last item and mobile */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[60%] top-8 hidden h-0.5 w-[80%] bg-gradient-to-r from-border to-transparent lg:block" />
                )}

                {/* Icon container */}
                <div className="relative mx-auto mb-6 inline-block">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${step.color} text-white shadow-lg transition-transform group-hover:scale-110`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#0B3C5D] text-xs font-bold text-white">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-bold text-[#0B3C5D]">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
