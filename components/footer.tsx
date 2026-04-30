import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react"

const WA_PRINCIPAL = "https://wa.me/5491150628422?text=Me%20gustaria%20consultar%20sobre%20unos%20productos%20de%20la%20Distribuidora%20Mito%20Yamile"
const WA_SECUNDARIO_1 = "https://wa.me/5491125252815?text=Me%20gustaria%20consultar%20sobre%20unos%20productos%20de%20la%20Distribuidora%20Mito%20Yamile"
const WA_SECUNDARIO_2 = "https://wa.me/5491121827379?text=Me%20gustaria%20consultar%20sobre%20unos%20productos%20de%20la%20Distribuidora%20Mito%20Yamile"

const footerLinks = {
  navegacion: [
    { href: "/", label: "Inicio" },
    { href: "/catalogo", label: "Catalogo" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/contacto", label: "Contacto" },
    { href: "/preguntas-frecuentes", label: "Preguntas Frecuentes" },
  ],
  categorias: [
    { href: "/catalogo?cat=jugueteria", label: "Jugueteria" },
    { href: "/catalogo?cat=libreria", label: "Libreria" },
    { href: "/catalogo?cat=regaleria", label: "Regaleria" },
    { href: "/catalogo?cat=mayorista", label: "Mayorista" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#0B3C5D] text-white">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Image
              src="/images/logo-mito.png"
              alt="MITO YAMILE"
              width={120}
              height={50}
              className="h-14 w-auto object-contain"
            />
            <p className="text-sm text-white/70">
              Distribuidora mayorista de jugueteria, libreria y regaleria.
              Variedad, calidad y precio en un solo lugar.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#1EA7E1]">
              Navegacion
            </h3>
            <ul className="space-y-2">
              {footerLinks.navegacion.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#1EA7E1]">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={WA_PRINCIPAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#22c55e]" />
                  <span>11 5062-8422 (Principal)</span>
                </a>
              </li>
              <li>
                <a
                  href={WA_SECUNDARIO_1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#22c55e]/70" />
                  <span>11 2525-2815 (Alternativo)</span>
                </a>
              </li>
              <li>
                <a
                  href={WA_SECUNDARIO_2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#22c55e]/70" />
                  <span>11 2182-7379 (Alternativo)</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1EA7E1]" />
                <span className="text-sm text-white/70">contacto@mitosyamil.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#FFC400]" />
                <span className="text-sm text-white/70">Boulogne Sour Mer 259,Once, Buenos Aires</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/50" />
                <span className="text-sm text-white/70">Lun-Vie: 9:00 - 16:00</span>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#1EA7E1]">
              Categorias
            </h3>
            <ul className="space-y-2">
              {footerLinks.categorias.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/50">
            {'© '}{new Date().getFullYear()} MITO YAMILE. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
