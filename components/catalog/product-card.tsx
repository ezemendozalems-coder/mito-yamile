"use client"

import React from "react"
import { useState } from "react"
import { Plus, Check, Package, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { categories } from "@/lib/products-data"
import { ImageLightbox } from "@/components/catalog/image-lightbox"
import type { Product } from "@/lib/supabase/get-products"

interface ProductCardProps {
  product: Product
  isAdmin?: boolean
  isEdited?: boolean
  onUpdatePrice?: (code: string, field: "priceMayor" | "priceBulto", value: number) => void
  onUpdateName?: (code: string, name: string) => void
  onResetPrice?: (code: string) => void
}

export function ProductCard({
  product,
  isAdmin = false,
  isEdited = false,
  onUpdatePrice,
  onUpdateName,
  onResetPrice,
}: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [editName, setEditName] = useState<string>(product.name)
  const [editMayor, setEditMayor] = useState<string>(String(product.priceMayor))
  const [editBulto, setEditBulto] = useState<string>(String(product.priceBulto))

  const category = categories.find((c) => c.id === product.category)
  const allImages = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : [])
  const hasMultipleImages = allImages.length > 1

  const handleAddToCart = () => {
    addItem(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  const handleSaveName = () => {
    const trimmed = editName.trim()
    if (trimmed && trimmed !== product.name) {
      onUpdateName?.(product.code, trimmed)
    }
  }

  const handleSaveMayor = () => {
    const val = Number.parseFloat(editMayor) || 0
    onUpdatePrice?.(product.code, "priceMayor", val)
  }

  const handleSaveBulto = () => {
    const val = Number.parseFloat(editBulto) || 0
    onUpdatePrice?.(product.code, "priceBulto", val)
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1EA7E1]/10 ${
        isAdmin ? "border-[#FFC400]" : "border-border"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-secondary">
        {allImages.length > 0 ? (
          <>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="h-full w-full cursor-pointer"
              aria-label="Ver imagen en grande"
            >
              <img
                src={allImages[currentImageIndex] || "/placeholder.svg"}
                alt={`${product.name}${hasMultipleImages ? ` - Imagen ${currentImageIndex + 1}` : ""}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </button>
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 opacity-0 shadow transition-opacity hover:bg-white group-hover:opacity-100"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="h-3 w-3 text-[#0B3C5D]" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 opacity-0 shadow transition-opacity hover:bg-white group-hover:opacity-100"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="h-3 w-3 text-[#0B3C5D]" />
                </button>
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx) }}
                      className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? "w-3 bg-white" : "w-1.5 bg-white/50"}`}
                      aria-label={`Ver imagen ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#E6F6FD] to-[#d0edfa]">
            <Package className="mb-1 h-8 w-8 text-[#1EA7E1]/40" />
            <span className="text-xs font-medium text-[#1EA7E1]/50">{product.code}</span>
          </div>
        )}

        {/* Category badge - pill style sobre la imagen */}
        <span className="absolute left-2 top-2 rounded-full bg-[#1EA7E1] px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
          {category?.name || product.category}
        </span>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && allImages.length > 0 && (
        <ImageLightbox
          images={allImages}
          initialIndex={currentImageIndex}
          productName={product.name}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        {/* Name — max 2 lines */}
        <h3 className="mb-1 line-clamp-2 min-h-[2.5rem] text-xs font-semibold leading-tight text-foreground sm:text-sm">
          {product.name}
        </h3>

        {/* Code */}
        <p className="mb-2 text-[10px] text-muted-foreground">Cod: {product.code}</p>

        {/* Admin edit mode */}
        {isAdmin ? (
          <div className="mb-3 space-y-2">
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-muted-foreground">Nombre</label>
              <Input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                className="h-7 text-xs"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-muted-foreground">Precio Mayor</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={editMayor}
                  onChange={(e) => setEditMayor(e.target.value)}
                  onBlur={handleSaveMayor}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveMayor()}
                  className="h-7 text-xs"
                />
              </div>
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-medium text-muted-foreground">Precio Bulto</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={editBulto}
                  onChange={(e) => setEditBulto(e.target.value)}
                  onBlur={handleSaveBulto}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveBulto()}
                  className="h-7 text-xs"
                />
              </div>
            </div>
            {isEdited && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onResetPrice?.(product.code)}
                className="h-6 w-full text-[10px] text-muted-foreground hover:text-destructive"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Restaurar original
              </Button>
            )}
          </div>
        ) : (
          /* Prices */
          <div className="mb-3 mt-auto">
            {product.priceMayor > 0 ? (
              <>
                <p className="text-sm font-bold text-[#0B3C5D] sm:text-base">
                  ${product.priceMayor.toLocaleString("es-AR")}
                </p>
                {product.priceBulto > 0 ? (
                  <p className="text-[10px] text-muted-foreground">
                    Bulto: ${product.priceBulto.toLocaleString("es-AR")}
                  </p>
                ) : (
                  <p className="text-[10px] text-muted-foreground/50">Bulto no aplica</p>
                )}
              </>
            ) : (
              <p className="text-xs text-muted-foreground">Consultar precio</p>
            )}
          </div>
        )}

        {/* Add to cart button — full width, never clips */}
        {!isAdmin && (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`mt-auto flex w-full items-center justify-center gap-1 rounded-[10px] px-2 py-2.5 text-xs font-semibold text-white transition-all duration-200 active:scale-95 ${
              isAdded
                ? "bg-[#22c55e] hover:bg-[#22c55e]"
                : "bg-[#1EA7E1] hover:bg-[#1794c7]"
            }`}
            aria-label={isAdded ? "Producto agregado al pedido" : "Agregar pedido"}
          >
            {isAdded ? (
              <>
                <Check className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">Agregado</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">+ Agregar pedido</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
