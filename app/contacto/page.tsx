"use client"

import React from "react"

import { useState } from "react"
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const WA_PRINCIPAL = "https://wa.me/5491150628422?text=Me%20gustaria%20consultar%20sobre%20unos%20productos%20de%20la%20Distribuidora%20Mito%20Yamile"
const WA_SECUNDARIO_1 = "https://wa.me/5491125252815?text=Me%20gustaria%20consultar%20sobre%20unos%20productos%20de%20la%20Distribuidora%20Mito%20Yamile"
const WA_SECUNDARIO_2 = "https://wa.me/5491121827379?text=Me%20gustaria%20consultar%20sobre%20unos%20productos%20de%20la%20Distribuidora%20Mito%20Yamile"

const contactInfo = [
  {
    icon: MessageCircle,
    title: "WhatsApp Principal",
    value: "11 5062-8422",
    href: WA_PRINCIPAL,
    color: "bg-[#22c55e]",
  },
  {
    icon: MessageCircle,
    title: "Atencion Alternativa 1",
    value: "11 2525-2815",
    href: WA_SECUNDARIO_1,
    color: "bg-[#22c55e]/80",
  },
  {
    icon: MessageCircle,
    title: "Atencion Alternativa 2",
    value: "11 2182-7379",
    href: WA_SECUNDARIO_2,
    color: "bg-[#22c55e]/80",
  },
  {
    icon: Mail,
    title: "Email",
    value: "contacto@mitosyamil.com",
    href: "mailto:contacto@mitosyamil.com",
    color: "bg-[#1EA7E1]",
  },
  {
    icon: MapPin,
    title: "Ubicacion",
    value: "Once, CABA",
    href: "#",
    color: "bg-[#0B3C5D]",
  },
]

const horarios = [
  { day: "Lunes a Viernes", hours: "8:00 - 12:00 / 16:00 - 20:00" },
  { day: "Sabados", hours: "8:00 - 13:00" },
  { day: "Domingos", hours: "Cerrado" },
]

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const message = `Hola! Mi nombre es ${formData.name}.%0A%0AEmail: ${formData.email}%0ATelefono: ${formData.phone}%0A%0AMensaje: ${formData.message}`
    window.open(`https://wa.me/541150628422?text=${message}`, "_blank")
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", phone: "", message: "" })
    
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-[#0B3C5D] py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-3xl text-center text-white">
              <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
                Contacto
              </h1>
              <p className="text-xl text-white/80">
                Estamos para ayudarte. Contactanos por el medio que prefieras.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {contactInfo.map((info) => {
                const Icon = info.icon
                return (
                  <a
                    key={info.title}
                    href={info.href}
                    target={info.href.startsWith("http") ? "_blank" : undefined}
                    rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${info.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{info.title}</p>
                      <p className="font-semibold text-[#0B3C5D]">{info.value}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        {/* Form and Horarios */}
        <section className="bg-secondary/30 py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-[#0B3C5D]">
                  Envianos un mensaje
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre *</Label>
                      <Input
                        id="name"
                        placeholder="Tu nombre"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Tu telefono"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje *</Label>
                    <Textarea
                      id="message"
                      placeholder="Como podemos ayudarte?"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1EA7E1] hover:bg-[#1794c7]"
                  >
                    {isSubmitting ? (
                      "Enviando..."
                    ) : isSubmitted ? (
                      "Mensaje enviado!"
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar mensaje por WhatsApp
                      </>
                    )}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Al enviar, seras redirigido a WhatsApp para continuar la conversacion
                  </p>
                </form>
              </div>

              {/* Horarios and Quick Contact */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-[#0B3C5D]">
                  Horarios de Atencion
                </h2>
                <div className="mb-8 overflow-hidden rounded-xl border border-border bg-card">
                  {horarios.map((horario, index) => (
                    <div
                      key={horario.day}
                      className={`flex items-center justify-between p-4 ${
                        index < horarios.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-[#1EA7E1]" />
                        <span className="font-medium text-[#0B3C5D]">{horario.day}</span>
                      </div>
                      <span className="text-muted-foreground">{horario.hours}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Contact - Principal */}
                <div className="mb-4 rounded-xl bg-[#0B3C5D] p-6 text-white">
                  <h3 className="mb-2 text-lg font-bold">Atencion Principal</h3>
                  <p className="mb-4 text-sm text-white/70">
                    Contactanos directamente por WhatsApp y te respondemos al instante.
                  </p>
                  <Button asChild className="w-full bg-[#22c55e] hover:bg-[#16a34a]">
                    <a
                      href={WA_PRINCIPAL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp Principal
                    </a>
                  </Button>
                </div>

                {/* Quick Contact - Secundarios */}
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="mb-2 text-lg font-bold text-[#0B3C5D]">Linea Alternativa 1</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Linea adicional para consultas.
                    </p>
                    <Button asChild variant="outline" className="w-full border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/10">
                      <a
                        href={WA_SECUNDARIO_1}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        WhatsApp Alternativo 1
                      </a>
                    </Button>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="mb-2 text-lg font-bold text-[#0B3C5D]">Linea Alternativa 2</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Otra opción de contacto.
                    </p>
                    <Button asChild variant="outline" className="w-full border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/10">
                      <a
                        href={WA_SECUNDARIO_2}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        WhatsApp Alternativo 2
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
