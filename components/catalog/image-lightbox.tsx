"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface ImageLightboxProps {
  images: string[]
  initialIndex?: number
  productName: string
  onClose: () => void
}

export function ImageLightbox({ images, initialIndex = 0, productName, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const hasMultiple = images.length > 1

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight" && hasMultiple) goNext()
      if (e.key === "ArrowLeft" && hasMultiple) goPrev()
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose, goNext, goPrev, hasMultiple])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-label={`Imagen de ${productName}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-3 top-3 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        aria-label="Cerrar"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Product name */}
      <div className="absolute left-3 top-3 z-10 max-w-[65%]">
        <p className="truncate rounded-lg bg-black/40 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
          {productName}
        </p>
      </div>

      {/* Navigation arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {hasMultiple && (
        <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-2 backdrop-blur-sm">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${idx === currentIndex ? "w-5 bg-white" : "w-2 bg-white/40 hover:bg-white/60"}`}
                aria-label={`Ver imagen ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main image - centered on screen */}
      <div className="relative z-[1] flex items-center justify-center p-4 sm:p-8">
        <img
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`${productName} - Imagen ${currentIndex + 1}`}
          className="max-h-[80vh] max-w-[90vw] rounded-lg object-contain shadow-2xl sm:max-w-[80vw]"
          draggable={false}
        />
      </div>
    </div>
  )
}
