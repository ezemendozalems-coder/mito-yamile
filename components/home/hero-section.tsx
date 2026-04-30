"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Desktop version - content over background image */}
      <div className="hidden sm:block">
        <div className="relative w-full" style={{ aspectRatio: "1536 / 1024" }}>
          <Image
            src="/images/hero-bg.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />

          {/* Centered content overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex max-w-xl flex-col items-center px-6 text-center">
              {/* Logo */}
              <Image
                src="/images/logo-mito.png"
                alt="MITO Distribuidora"
                width={180}
                height={80}
                className="mb-6 h-auto w-20 object-contain sm:w-24 lg:w-28"
                priority
              />

              {/* Title */}
              <h1 className="text-balance text-2xl font-extrabold leading-tight text-[#0B3C5D] sm:text-3xl md:text-4xl lg:text-5xl" style={{ fontFamily: 'var(--font-heading)' }}>
                {"Descubrí nuestra amplia variedad "}
                <span className="text-[#f59e0b]">mayorista</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-4 text-pretty text-sm font-bold leading-relaxed text-[#f59e0b] sm:text-base md:text-lg">
                {"Juguetería, librería y regalería en un solo catálogo. Precios mayoristas y atención inmediata."}
              </p>

              {/* Buttons */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-xl bg-[#1EA7E1] px-8 text-sm font-semibold text-white shadow-lg hover:bg-[#1890c5] sm:h-14 sm:text-base"
                >
                  <Link href="/catalogo">Ver Catálogo</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-xl bg-[#22c55e] px-8 text-sm font-semibold text-white shadow-lg hover:bg-[#16a34a] sm:h-14 sm:text-base"
                >
                  <Link
                    href="https://wa.me/5491150628422?text=Me%20gustaria%20consultar%20sobre%20unos%20productos%20de%20la%20Distribuidora%20Mito%20Yamile"
                    target="_blank"
                  >
                    Pedido por WhatsApp
                  </Link>
                </Button>
              </div>

              {/* Detail badges */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                <span className="flex items-center gap-1.5 text-xs font-medium text-[#f59e0b] sm:text-sm">
                  <svg className="h-4 w-4 shrink-0 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {"Atención inmediata"}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-[#f59e0b] sm:text-sm">
                  <svg className="h-4 w-4 shrink-0 text-[#1EA7E1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {"Precios mayoristas"}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-[#f59e0b] sm:text-sm">
                  <svg className="h-4 w-4 shrink-0 text-[#facc15]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {"Envíos a todo el país"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile version - clean, organized, single block */}
      <div className="relative block sm:hidden">
        <div className="relative w-full" style={{ minHeight: "600px" }}>
          <Image
            src="/images/hero-bg.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          
          {/* Content overlay */}
          <div className="relative z-10 flex min-h-[600px] flex-col items-center justify-center px-6 py-10 text-center">
            {/* Logo */}
            <Image
              src="/images/logo-mito.png"
              alt="MITO Distribuidora"
              width={80}
              height={36}
              className="mx-auto mb-5 h-auto w-16 object-contain"
            />

        {/* Title - reduced size, better spacing */}
        <h1 className="text-balance text-xl font-extrabold leading-snug text-[#0B3C5D]" style={{ fontFamily: 'var(--font-heading)' }}>
          {"Descubrí nuestra amplia variedad "}
          <span className="text-[#f59e0b]">mayorista</span>
        </h1>

        {/* Subtitle - white, bold, improved contrast */}
        <p className="mt-3 text-pretty text-sm font-bold leading-relaxed text-white">
          {""}
        </p>

        {/* Buttons - full width with side padding */}
        <div className="mt-6 flex flex-col gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 w-full rounded-xl bg-[#1EA7E1] text-sm font-semibold text-white shadow-lg hover:bg-[#1890c5]"
          >
            <Link href="/catalogo">Ver Catálogo</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="h-12 w-full rounded-xl bg-[#22c55e] text-sm font-semibold text-white shadow-lg hover:bg-[#16a34a]"
          >
            <Link
              href="https://wa.me/5491150628422?text=Me%20gustaria%20consultar%20sobre%20unos%20productos%20de%20la%20Distribuidora%20Mito%20Yamile"
              target="_blank"
            >
              Pedido por WhatsApp
            </Link>
          </Button>
        </div>

        {/* Detail badges - vertical column, centered, organized */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <span className="flex items-center gap-2 text-sm font-medium text-[#0B3C5D]">
            <svg className="h-4 w-4 shrink-0 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {"Atención inmediata"}
          </span>
          <span className="flex items-center gap-2 text-sm font-medium text-[#0B3C5D]">
            <svg className="h-4 w-4 shrink-0 text-[#1EA7E1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {"Precios mayoristas"}
          </span>
          <span className="flex items-center gap-2 text-sm font-medium text-[#0B3C5D]">
            <svg className="h-4 w-4 shrink-0 text-[#facc15]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {"Envíos a todo el país"}
          </span>
        </div>
          </div>
        </div>
      </div>
    </section>
  )
}
