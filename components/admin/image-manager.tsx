"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Trash2, Star, Loader2, ImageIcon, RefreshCw, X, CheckCircle2, Plus, PackageSearch, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

interface ProductImage {
  id: string
  product_code: string | null
  image_url: string
  storage_path: string
  original_name: string
  is_main: boolean
  sort_order: number
}

interface Product {
  code: string
  name: string
  category: string
}

type FilterMode = "all" | "assigned" | "unassigned"
type ModalMode = "search" | "create"

const CATEGORIES = [
  "Jugueteria",
  "Libreria",
  "Regaleria",
  "Cotillon",
  "Bazar",
  "Papeleria",
  "Otro",
]

export function ImageManager() {
  const [images, setImages]     = useState<ProductImage[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState<FilterMode>("all")
  const [search, setSearch]     = useState("")

  // Modal
  const [selected, setSelected]             = useState<ProductImage | null>(null)
  const [modalMode, setModalMode]           = useState<ModalMode>("search")
  const [assignSearch, setAssignSearch]     = useState("")
  const [assigningCode, setAssigningCode]   = useState<string | null>(null)

  // Create form
  const [newCode, setNewCode]               = useState("")
  const [newName, setNewName]               = useState("")
  const [newCategory, setNewCategory]       = useState(CATEGORIES[0])
  const [newPriceMayor, setNewPriceMayor]   = useState("")
  const [newPriceBulto, setNewPriceBulto]   = useState("")
  const [creating, setCreating]             = useState(false)
  const [createError, setCreateError]       = useState("")

  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Lightbox
  const [lightbox, setLightbox] = useState<ProductImage | null>(null)

  const openLightbox = (img: ProductImage, e: React.MouseEvent) => {
    e.stopPropagation()
    setLightbox(img)
  }

  const closeLightbox = () => setLightbox(null)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const [{ data: imgs }, { data: prods }] = await Promise.all([
      supabase
        .from("product_images")
        .select("id, product_code, image_url, storage_path, original_name, is_main, sort_order")
        .order("created_at", { ascending: false }),
      supabase
        .from("products")
        .select("code, name, category")
        .order("name", { ascending: true })
        .limit(2000),
    ])
    setImages(imgs ?? [])
    setProducts(prods ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // Calculate productMap and filtered early for lightbox functions
  const productMap = Object.fromEntries(products.map((p) => [p.code, p]))

  const filtered = images.filter((img) => {
    if (filter === "assigned"   && img.product_code === null) return false
    if (filter === "unassigned" && img.product_code !== null) return false
    if (search.trim()) {
      const s = search.toLowerCase()
      const prodName = img.product_code ? (productMap[img.product_code]?.name ?? "") : ""
      return (
        (img.product_code ?? "").includes(s) ||
        prodName.toLowerCase().includes(s) ||
        img.original_name.toLowerCase().includes(s)
      )
    }
    return true
  })

  const lightboxIndex = lightbox ? filtered.findIndex((i) => i.id === lightbox.id) : -1

  const lightboxPrev = () => {
    if (lightboxIndex <= 0) return
    setLightbox(filtered[lightboxIndex - 1])
  }

  const lightboxNext = () => {
    if (lightboxIndex >= filtered.length - 1) return
    setLightbox(filtered[lightboxIndex + 1])
  }

  // Close lightbox on Escape, navigate with arrow keys
  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")      closeLightbox()
      if (e.key === "ArrowLeft")   lightboxPrev()
      if (e.key === "ArrowRight")  lightboxNext()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightbox, lightboxIndex, filtered])

  const filteredProducts = products.filter((p) => {
    if (!assignSearch.trim()) return true
    const s = assignSearch.toLowerCase()
    return p.code.includes(s) || p.name.toLowerCase().includes(s)
  }).slice(0, 50)

  const openModal = (img: ProductImage) => {
    setSelected(img)
    setModalMode("search")
    setAssignSearch("")
    setAssigningCode(null)
    setNewCode("")
    setNewName("")
    setNewCategory(CATEGORIES[0])
    setNewPriceMayor("")
    setNewPriceBulto("")
    setCreateError("")
  }

  const closeModal = () => {
    setSelected(null)
    setAssigningCode(null)
    setCreateError("")
  }

  const assign = async (code: string) => {
    if (!selected) return
    setAssigningCode(code)
    const supabase = createClient()
    const alreadyHasImage = images.some((i) => i.product_code === code)
    const makeMain = !alreadyHasImage
    if (makeMain) {
      await supabase.from("product_images").update({ is_main: false }).eq("product_code", code).eq("is_main", true)
    }
    await supabase.from("product_images").update({ product_code: code, is_main: makeMain }).eq("id", selected.id)
    closeModal()
    await load()
  }

  const createAndAssign = async () => {
    if (!selected) return
    setCreateError("")
    const code = newCode.trim()
    const name = newName.trim()
    if (!code || !name) {
      setCreateError("El codigo y el nombre son obligatorios.")
      return
    }
    setCreating(true)
    const supabase = createClient()

    const { data: existing } = await supabase.from("products").select("code").eq("code", code).maybeSingle()
    if (existing) {
      setCreateError(`Ya existe un producto con el codigo ${code}.`)
      setCreating(false)
      return
    }

    const { error: insertErr } = await supabase.from("products").insert({
      code,
      name,
      category: newCategory,
      price_mayor: parseFloat(newPriceMayor) || 0,
      price_bulto: parseFloat(newPriceBulto) || 0,
    })

    if (insertErr) {
      setCreateError(insertErr.message)
      setCreating(false)
      return
    }

    await supabase.from("product_images").update({ product_code: code, is_main: true }).eq("id", selected.id)
    setCreating(false)
    closeModal()
    await load()
  }

  const unassign = async (img: ProductImage) => {
    const supabase = createClient()
    await supabase.from("product_images").update({ product_code: null, is_main: false }).eq("id", img.id)
    await load()
  }

  const setMain = async (img: ProductImage) => {
    if (!img.product_code || img.is_main) return
    const supabase = createClient()
    await supabase.from("product_images").update({ is_main: false }).eq("product_code", img.product_code).eq("is_main", true)
    await supabase.from("product_images").update({ is_main: true }).eq("id", img.id)
    await load()
  }

  const deleteImage = async (img: ProductImage) => {
    setDeletingId(img.id)
    const supabase = createClient()
    if (img.storage_path) {
      await supabase.storage.from("product-images").remove([img.storage_path])
    }
    await supabase.from("product_images").delete().eq("id", img.id)
    if (selected?.id === img.id) closeModal()
    setDeletingId(null)
    await load()
  }

  const unassignedCount = images.filter((i) => i.product_code === null).length
  const assignedCount   = images.filter((i) => i.product_code !== null).length

  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card px-5 py-3">
        <span className="text-sm text-muted-foreground">
          Total: <span className="font-semibold text-foreground">{images.length}</span>
        </span>
        <span className="text-sm text-muted-foreground">
          Asignadas: <span className="font-semibold text-[#22c55e]">{assignedCount}</span>
        </span>
        <span className="text-sm text-muted-foreground">
          Sin asignar: <span className="font-semibold text-amber-500">{unassignedCount}</span>
        </span>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="ml-auto bg-transparent text-xs">
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      {/* Filters + search */}
      <div className="flex flex-wrap gap-3">
        <div className="flex rounded-xl border border-border bg-card p-1">
          {(["all", "assigned", "unassigned"] as FilterMode[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filter === f ? "bg-[#1EA7E1] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "Todas" : f === "assigned" ? "Asignadas" : "Sin asignar"}
              {f === "unassigned" && unassignedCount > 0 && (
                <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] text-white">{unassignedCount}</span>
              )}
            </button>
          ))}
        </div>
        <div className="relative min-w-48 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por codigo, nombre o archivo..."
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#1EA7E1]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <ImageIcon className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No hay imagenes</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((img) => {
            const prod       = img.product_code ? productMap[img.product_code] : null
            const isDeleting = deletingId === img.id
            return (
              <div
                key={img.id}
                className={`group relative overflow-hidden rounded-xl border transition-all ${
                  img.product_code === null
                    ? "border-amber-200 bg-amber-50/30"
                    : img.is_main
                    ? "border-[#1EA7E1]/60 bg-[#E6F6FD]/40"
                    : "border-border bg-card"
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <img
                    src={img.image_url}
                    alt={img.original_name}
                    className="h-full w-full cursor-zoom-in object-cover"
                    onClick={(e) => openLightbox(img, e)}
                  />

                  {img.is_main && img.product_code && (
                    <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-[#1EA7E1] px-2 py-0.5 text-[10px] font-semibold text-white">
                      <Star className="h-2.5 w-2.5 fill-white" />Principal
                    </div>
                  )}
                  {img.product_code === null && (
                    <div className="absolute left-1.5 top-1.5 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      Sin asignar
                    </div>
                  )}

                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => openLightbox(img, e)}
                      className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-white flex items-center gap-1.5"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                      Ver imagen
                    </button>
                    <button
                      onClick={() => openModal(img)}
                      className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-white"
                    >
                      {img.product_code ? "Reasignar" : "Asignar producto"}
                    </button>
                    {img.product_code && !img.is_main && (
                      <button onClick={() => setMain(img)} className="rounded-lg bg-[#1EA7E1]/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1EA7E1]">
                        Hacer principal
                      </button>
                    )}
                    {img.product_code && (
                      <button onClick={() => unassign(img)} className="rounded-lg bg-amber-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-500">
                        Desasignar
                      </button>
                    )}
                  </div>

                  {isDeleting ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                      <Loader2 className="h-6 w-6 animate-spin text-destructive" />
                    </div>
                  ) : (
                    <button
                      onClick={() => deleteImage(img)}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive/80 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <div className="space-y-0.5 p-2">
                  {prod ? (
                    <>
                      <p className="truncate text-[11px] font-semibold text-foreground" title={prod.name}>{prod.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{img.product_code}</p>
                    </>
                  ) : (
                    <p className="truncate text-[11px] text-muted-foreground" title={img.original_name}>{img.original_name}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); lightboxPrev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          <div
            className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.image_url}
              alt={lightbox.original_name}
              className="max-h-[80vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 rounded-xl bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur-sm">
              {lightbox.product_code ? (
                <>
                  <span className="font-mono text-[#7dd3fc]">{lightbox.product_code}</span>
                  <span className="text-white/40">—</span>
                  <span className="font-medium">{productMap[lightbox.product_code]?.name ?? lightbox.original_name}</span>
                  {lightbox.is_main && (
                    <span className="flex items-center gap-1 rounded-full bg-[#1EA7E1] px-2 py-0.5 text-[11px] font-semibold">
                      <Star className="h-2.5 w-2.5 fill-white" />Principal
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-semibold">Sin asignar</span>
                  <span className="text-white/70">{lightbox.original_name}</span>
                </>
              )}
              <span className="text-xs text-white/40">{lightboxIndex + 1} / {filtered.length}</span>
            </div>
          </div>

          {lightboxIndex < filtered.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); lightboxNext() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeModal}>
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                  <img src={selected.image_url} alt={selected.original_name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Asignar imagen</h3>
                  <p className="max-w-[240px] truncate text-xs text-muted-foreground">{selected.original_name}</p>
                </div>
              </div>
              <button onClick={closeModal} className="rounded-lg p-1.5 hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-1 border-b border-border px-6 py-3">
              <button
                onClick={() => setModalMode("search")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  modalMode === "search"
                    ? "bg-[#1EA7E1] text-white"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <PackageSearch className="h-4 w-4" />
                Producto existente
              </button>
              <button
                onClick={() => setModalMode("create")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  modalMode === "create"
                    ? "bg-[#1EA7E1] text-white"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Plus className="h-4 w-4" />
                Crear producto nuevo
              </button>
            </div>

            {/* Search existing */}
            {modalMode === "search" && (
              <div className="space-y-3 p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={assignSearch}
                    onChange={(e) => setAssignSearch(e.target.value)}
                    placeholder="Buscar por codigo o nombre..."
                    className="pl-9 text-sm"
                    autoFocus
                  />
                </div>
                <div className="max-h-64 overflow-y-auto rounded-xl border border-border">
                  {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">No se encontraron productos</p>
                      <button
                        onClick={() => setModalMode("create")}
                        className="text-xs font-medium text-[#1EA7E1] hover:underline"
                      >
                        Crear producto nuevo
                      </button>
                    </div>
                  ) : (
                    filteredProducts.map((p) => (
                      <button
                        key={p.code}
                        onClick={() => assign(p.code)}
                        disabled={!!assigningCode}
                        className="flex w-full items-center gap-3 border-b border-border/50 px-4 py-3 text-left text-sm transition-colors last:border-0 hover:bg-secondary disabled:opacity-60"
                      >
                        <span className="w-16 flex-shrink-0 font-mono text-xs text-muted-foreground">{p.code}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground">{p.name}</p>
                          <p className="text-[11px] text-muted-foreground">{p.category}</p>
                        </div>
                        {assigningCode === p.code
                          ? <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-[#1EA7E1]" />
                          : assigningCode
                          ? null
                          : <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-muted-foreground/20" />
                        }
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Create new product */}
            {modalMode === "create" && (
              <div className="space-y-4 p-6">
                <p className="text-xs text-muted-foreground">
                  Se creara el producto y esta imagen quedara asignada como imagen principal.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Codigo *</label>
                    <Input
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value.trim())}
                      placeholder="Ej: 10070"
                      className="font-mono text-sm"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Categoria *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Nombre del producto *</label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ej: Auto a control remoto rojo"
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Precio mayor</label>
                    <Input
                      value={newPriceMayor}
                      onChange={(e) => setNewPriceMayor(e.target.value)}
                      placeholder="0.00"
                      type="number"
                      min="0"
                      step="0.01"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Precio bulto</label>
                    <Input
                      value={newPriceBulto}
                      onChange={(e) => setNewPriceBulto(e.target.value)}
                      placeholder="0.00"
                      type="number"
                      min="0"
                      step="0.01"
                      className="text-sm"
                    />
                  </div>
                </div>

                {createError && (
                  <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {createError}
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setModalMode("search")}
                    className="flex-1 bg-transparent text-xs"
                    disabled={creating}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={createAndAssign}
                    disabled={creating || !newCode.trim() || !newName.trim()}
                    className="flex-1 bg-[#1EA7E1] text-xs text-white hover:bg-[#1794c7]"
                  >
                    {creating
                      ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Creando...</>
                      : <><Plus className="mr-1.5 h-3.5 w-3.5" />Crear y asignar</>
                    }
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
