"use client"

import Link from "next/link"
import { ArrowRight, Gamepad2, PenTool, Gift, Package, Backpack } from "lucide-react"

const blocks = [
  {
    id: "jugueteria",
    href: "/catalogo",
    icon: Gamepad2,
    title: "Jugueteria",
    description: "Amplio surtido de juguetes para todas las edades. Marcas reconocidas y novedades permanentes.",
    cta: "Ver jugueteria",
    color: "bg-[#1EA7E1]",
    accent: "border-[#1EA7E1]",
  },
  {
    id: "libreria",
    href: "/catalogo",
    icon: PenTool,
    title: "Libreria",
    description: "Utiles escolares, materiales de oficina y todo lo que tu comercio necesita en libreria.",
    cta: "Ver libreria",
    color: "bg-[#0B3C5D]",
    accent: "border-[#0B3C5D]",
  },
  {
    id: "mochilas",
    href: "/catalogo",
    icon: Backpack,
    title: "Mochilas",
    description: "Mochilas escolares, deportivas y de viaje. Variedad de diseños, tamaños y marcas para todos los gustos.",
    cta: "Ver mochilas",
    color: "bg-[#9333ea]",
    accent: "border-[#9333ea]",
  },
  {
    id: "regaleria",
    href: "/catalogo",
    icon: Gift,
    title: "Regaleria",
    description: "Articulos de regalo, bazar, decoracion y temporada. Ideal para comercios minoristas.",
    cta: "Ver regaleria",
    color: "bg-[#FFC400]",
    accent: "border-[#FFC400]",
  },
  {
    id: "mayorista",
    href: "/catalogo",
    icon: Package,
    title: "Mayorista",
    description: "Precios especiales por bulto y volumen. Condiciones exclusivas para comercios.",
    cta: "Ver todo el catalogo",
    color: "bg-[#22c55e]",
    accent: "border-[#22c55e]",
  },
]

export function FeaturedBlocks() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-[#1EA7E1]">
            Nuestras categorias
          </span>
          <h2 className="mb-4 text-balance text-3xl font-bold text-[#0B3C5D] sm:text-4xl">
            Todo lo que tu comercio necesita
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Distribuidora mayorista con catalogo amplio en jugueteria, libreria, regaleria y mas. Precios competitivos para hacer crecer tu negocio.
          </p>
        </div>

        {/* Blocks Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {blocks.map((block) => {
            const Icon = block.icon
            return (
              <Link
                key={block.id}
                href={block.href}
                className={`group relative overflow-hidden rounded-2xl border-t-4 ${block.accent} bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1EA7E1]/5`}
              >
                {/* Icon */}
                <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl ${block.color} ${block.id === "regaleria" ? "text-[#0B3C5D]" : "text-white"} ${block.id === "mochilas" ? "text-white" : ""} shadow-lg transition-transform group-hover:scale-110`}>
                  <Icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-xl font-bold text-[#0B3C5D]">
                  {block.title}
                </h3>

                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {block.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-sm font-semibold text-[#1EA7E1] transition-colors group-hover:text-[#0B3C5D]">
                  <span>{block.cta}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
