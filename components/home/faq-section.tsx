"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const categories = [
  { id: "all", label: "Todos" },
  { id: "compras", label: "Compras" },
  { id: "pagos", label: "Pagos" },
  { id: "envios", label: "Envíos" },
  { id: "mayorista", label: "Mayorista" },
  { id: "productos", label: "Productos" },
  { id: "stock", label: "Stock" },
]

const faqs = [
  {
    id: "1",
    question: "¿Cómo hago un pedido?",
    answer:
      "Elegí los productos desde el catálogo, tocá 'Agregar al pedido' y enviá el pedido por WhatsApp. Te confirmamos stock, total y formas de pago.",
    category: ["compras"],
  },
  {
    id: "2",
    question: "¿Necesito registrarme para comprar?",
    answer: "No. Podés armar tu pedido sin registrarte.",
    category: ["compras"],
  },
  {
    id: "3",
    question: "¿Venden por mayor?",
    answer:
      "Sí. Trabajamos mayorista. Consultanos por WhatsApp para conocer condiciones y mínimos.",
    category: ["mayorista"],
  },
  {
    id: "4",
    question: "¿Cuál es el mínimo de compra mayorista?",
    answer:
      "Depende del producto o categoría. Te lo confirmamos al momento de consultar.",
    category: ["mayorista"],
  },
  {
    id: "5",
    question: '¿Qué significa "Bulto"?',
    answer:
      "Es la cantidad por caja o pack cerrado. Algunos productos se venden por unidad y otros por bulto.",
    category: ["productos"],
  },
  {
    id: "6",
    question: "¿Los precios están actualizados?",
    answer:
      "Sí, aunque el stock puede variar. Siempre confirmamos antes de cerrar el pedido.",
    category: ["productos", "stock"],
  },
  {
    id: "7",
    question: "¿Qué formas de pago aceptan?",
    answer: "Transferencia y otros medios según disponibilidad.",
    category: ["pagos"],
  },
  {
    id: "8",
    question: "¿Hacen envíos?",
    answer: "Sí. Coordinamos envíos según tu zona.",
    category: ["envios"],
  },
  {
    id: "9",
    question: "¿Cuánto tarda el envío?",
    answer: "Depende de la zona y volumen del pedido.",
    category: ["envios"],
  },
  {
    id: "10",
    question: "¿Qué pasa si un producto no tiene imagen?",
    answer:
      "Estamos cargando imágenes progresivamente. Si no ves foto, podés pedirla por WhatsApp.",
    category: ["productos"],
  },
  {
    id: "11",
    question: "¿Puedo pedir factura?",
    answer: "Sí. Avisanos al confirmar el pedido.",
    category: ["compras", "pagos"],
  },
  {
    id: "12",
    question: "¿Cómo sé si hay stock?",
    answer: "Confirmamos stock al momento de cerrar el pedido.",
    category: ["stock"],
  },
]

export function FAQSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || faq.category.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  return (
    <section className="bg-gradient-to-b from-white to-[#faf5f9] py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="text-balance text-3xl font-extrabold leading-tight text-[#0B3C5D] lg:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Preguntas Frecuentes
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-[#4a6d84] lg:text-lg">
            Todo lo que necesitás saber para comprar fácil y rápido.
          </p>

          {/* Search Bar */}
          <div className="relative mt-8">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar una pregunta…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 rounded-xl border-2 border-border/50 bg-white pl-12 text-base shadow-sm transition-all focus:border-[#1EA7E1] focus:ring-2 focus:ring-[#1EA7E1]/20"
            />
          </div>

          {/* Category Filters */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-[#1EA7E1] text-white hover:bg-[#1890c5]"
                    : "border-2 border-border/60 bg-white text-[#0B3C5D] hover:border-[#1EA7E1] hover:bg-[#E6F6FD]"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mx-auto mt-12 max-w-3xl">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border bg-white p-12 text-center">
              <p className="text-lg font-medium text-muted-foreground">
                No se encontraron preguntas que coincidan con tu búsqueda.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
                className="mt-4"
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-3">
              {filteredFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="overflow-hidden rounded-xl border-2 border-border/50 bg-white shadow-sm transition-all hover:border-[#1EA7E1]/40 hover:shadow-md data-[state=open]:border-[#1EA7E1] data-[state=open]:shadow-lg"
                >
                  <AccordionTrigger className="px-6 py-4 text-left text-base font-semibold text-[#0B3C5D] hover:no-underline [&[data-state=open]]:text-[#1EA7E1]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-0 text-base leading-relaxed text-[#4a6d84]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* CTA Block */}
        <div className="mx-auto mt-16 max-w-2xl rounded-2xl border-2 border-[#1EA7E1]/20 bg-gradient-to-br from-[#E6F6FD] to-white p-8 text-center shadow-lg lg:p-12">
          <h3 className="text-balance text-2xl font-bold text-[#0B3C5D] lg:text-3xl">
            ¿Te quedó alguna duda?
          </h3>
          <p className="mt-3 text-pretty text-base text-[#4a6d84] lg:text-lg">
            Nuestro equipo está listo para ayudarte con lo que necesites.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 h-14 rounded-xl bg-[#22c55e] px-8 text-base font-semibold text-white shadow-lg hover:bg-[#16a34a]"
          >
            <Link
              href="https://wa.me/5491150628422?text=Me%20gustaria%20consultar%20sobre%20unos%20productos%20de%20la%20Distribuidora%20Mito%20Yamile"
              target="_blank"
            >
              <svg
                viewBox="0 0 24 24"
                className="mr-2 h-5 w-5 fill-current"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Hablar por WhatsApp
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
