"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { LogOut, ImageIcon, LayoutDashboard, ArrowLeft, Package, Upload, Grid2X2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { ImageUploader } from "@/components/admin/image-uploader"
import { ImageManager } from "@/components/admin/image-manager"
import { ProductsEditor } from "@/components/admin/products-editor"

export default function AdminPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"imagenes" | "productos">("imagenes")
  const [imageSubTab, setImageSubTab] = useState<"subir" | "gestionar">("subir")
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserEmail(user.email ?? null)
    })
  }, [])

  const handleSeedProducts = async () => {
    if (!confirm("¿Estás seguro de que quieres insertar todos los productos en Supabase? Esto hará upsert por código.")) return
    
    setIsSeeding(true)
    setSeedResult(null)
    
    try {
      const response = await fetch("/api/seed-products", { method: "POST" })
      const data = await response.json()
      
      if (data.success) {
        setSeedResult(`✓ ${data.inserted} productos insertados exitosamente`)
      } else {
        setSeedResult(`✗ Error: ${data.error}`)
      }
    } catch (error) {
      setSeedResult(`✗ Error de red: ${error}`)
    } finally {
      setIsSeeding(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-[#0B3C5D]">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src="/images/logo-mito.png"
                alt="MITO Yamile"
                width={100}
                height={40}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <div className="hidden h-8 w-px bg-white/20 sm:block" />
            <div className="hidden items-center gap-2 sm:flex">
              <LayoutDashboard className="h-4 w-4 text-[#1EA7E1]" />
              <span className="text-sm font-semibold text-white">Panel Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="hidden text-xs text-white/60 sm:block">{userEmail}</span>
            )}
            <Button asChild variant="ghost" size="sm" className="text-white/70 hover:bg-white/10 hover:text-white">
              <Link href="/">
                <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                Sitio
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white/70 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="mr-1 h-3.5 w-3.5" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex gap-1">
            <button
              onClick={() => setActiveTab("imagenes")}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "imagenes"
                  ? "border-[#1EA7E1] text-[#1EA7E1]"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              Imagenes
            </button>
            <button
              onClick={() => setActiveTab("productos")}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "productos"
                  ? "border-[#1EA7E1] text-[#1EA7E1]"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              <Package className="h-4 w-4" />
              Productos
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 lg:px-8">
        {activeTab === "imagenes" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">Imagenes de Productos</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Sube nuevas imagenes o gestioná las existentes por producto.
              </p>
            </div>

            {/* Sub-tabs */}
            <div className="mb-6 flex gap-1 rounded-xl border border-border bg-card p-1 w-fit">
              <button
                onClick={() => setImageSubTab("subir")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  imageSubTab === "subir"
                    ? "bg-[#1EA7E1] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Upload className="h-4 w-4" />
                Subir imagenes
              </button>
              <button
                onClick={() => setImageSubTab("gestionar")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  imageSubTab === "gestionar"
                    ? "bg-[#1EA7E1] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid2X2 className="h-4 w-4" />
                Gestionar
              </button>
            </div>

            {imageSubTab === "subir" && (
              <ImageUploader onUploaded={() => setImageSubTab("gestionar")} />
            )}
            {imageSubTab === "gestionar" && <ImageManager />}
          </div>
        )}

        {activeTab === "productos" && (
          <div>
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Editar Productos</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Edita el nombre, categoría y precios de los productos. Los cambios se guardan en Supabase.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button
                  onClick={handleSeedProducts}
                  disabled={isSeeding}
                  variant="outline"
                  size="sm"
                  className="border-[#1EA7E1] text-[#1EA7E1] hover:bg-[#1EA7E1] hover:text-white"
                >
                  {isSeeding ? "Insertando..." : "Seed desde estáticos"}
                </Button>
                {seedResult && (
                  <p className={`text-xs ${seedResult.startsWith("✓") ? "text-green-600" : "text-red-600"}`}>
                    {seedResult}
                  </p>
                )}
              </div>
            </div>
            <ProductsEditor />
          </div>
        )}
      </main>
    </div>
  )
}
