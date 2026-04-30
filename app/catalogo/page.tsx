"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Search, ShoppingCart, Settings, RotateCcw, X, ArrowUpDown, ArrowDownAZ, ArrowUpAZ, ArrowDown01, ArrowUp01, Lock } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/catalog/product-card"
import { CategoryFilter } from "@/components/catalog/category-filter"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { usePriceEditor } from "@/hooks/use-price-editor"
import { fetchProductImagesMap, type ProductImagesMap } from "@/lib/supabase/get-product-images"
import { fetchProducts, categories, type Product } from "@/lib/supabase/get-products"

export default function CatalogoPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("default")
  const [showCodePrompt, setShowCodePrompt] = useState(false)
  const [codeInput, setCodeInput] = useState("")
  const [codeError, setCodeError] = useState(false)
  const codeInputRef = useRef<HTMLInputElement>(null)
  const [imagesMap, setImagesMap] = useState<ProductImagesMap>({})
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { totalItems, setIsCartOpen } = useCart()
  const priceEditor = usePriceEditor()

  useEffect(() => {
    Promise.all([
      fetchProductImagesMap(),
      fetchProducts()
    ]).then(([images, prods]) => {
      setImagesMap(images)
      setProducts(prods)
      setIsLoading(false)
    })
  }, [])

  const ADMIN_CODE = "101299"

  const handleAdminToggle = () => {
    if (priceEditor.isAdmin) {
      priceEditor.setIsAdmin(false)
      return
    }
    setShowCodePrompt(true)
    setCodeInput("")
    setCodeError(false)
    setTimeout(() => codeInputRef.current?.focus(), 100)
  }

  const handleCodeSubmit = () => {
    if (codeInput === ADMIN_CODE) {
      priceEditor.setIsAdmin(true)
      setShowCodePrompt(false)
      setCodeInput("")
      setCodeError(false)
    } else {
      setCodeError(true)
      setCodeInput("")
      codeInputRef.current?.focus()
    }
  }

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        product.name.toLowerCase().includes(q) ||
        product.code.toLowerCase().includes(q)
      const matchesCategory =
        selectedCategory === null || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Apply sorting
    const sorted = [...filtered]
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.priceMayor - b.priceMayor)
        break
      case "price-desc":
        sorted.sort((a, b) => b.priceMayor - a.priceMayor)
        break
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        break
    }
    return sorted
  }, [products, searchQuery, selectedCategory, sortBy])

  // Build products with potentially edited prices and Supabase images
  const displayProducts = useMemo(() => {
    return filteredProducts.map((product) => {
      const { priceMayor, priceBulto } = priceEditor.getPrice(
        product.code,
        product.priceMayor,
        product.priceBulto
      )

      const { name } = priceEditor.getName(product.code, product.name)

      // Merge Supabase images if available
      const supaImages = imagesMap[product.code]
      let image = product.image
      let images = product.images

      if (supaImages) {
        image = supaImages.main || supaImages.all[0] || product.image
        images = supaImages.all.length > 0 ? supaImages.all : product.images
      }

      return { ...product, name, priceMayor, priceBulto, image, images }
    })
  }, [filteredProducts, priceEditor, imagesMap])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-secondary/30">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-[#0B3C5D] to-[#1EA7E1] py-12 text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                Catalogo Mayorista
              </h1>
              <p className="mb-6 text-lg text-white/80">
                Explora nuestra amplia variedad de productos. Arma tu pedido y
                finalizalo por WhatsApp.
              </p>

              {/* Search */}
              <div className="relative mx-auto max-w-xl">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por nombre o codigo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 rounded-full border-0 bg-white pl-12 pr-4 text-foreground shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Admin Toggle Bar */}
        <div className="container mx-auto px-4 pt-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAdminToggle}
              className={`h-8 w-8 ${priceEditor.isAdmin ? "text-[#FFC400]" : "text-muted-foreground/40 hover:text-muted-foreground"}`}
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Administrar precios</span>
            </Button>

            {priceEditor.isAdmin && priceEditor.editedCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={priceEditor.resetAllPrices}
                className="border-destructive/50 bg-transparent text-xs text-destructive hover:bg-destructive/10"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Restablecer precios originales ({priceEditor.editedCount})
              </Button>
            )}
          </div>
        </div>

        {/* Code Prompt Modal */}
        {showCodePrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCodePrompt(false)}>
            <div
              className="mx-4 w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B3C5D]">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Acceso restringido</h3>
                  <p className="text-xs text-muted-foreground">Ingresa el codigo de administrador</p>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleCodeSubmit() }}>
                <Input
                  ref={codeInputRef}
                  type="password"
                  inputMode="numeric"
                  placeholder="Codigo de acceso"
                  value={codeInput}
                  onChange={(e) => { setCodeInput(e.target.value); setCodeError(false) }}
                  className={`mb-3 h-11 text-center text-lg tracking-widest ${codeError ? "border-destructive ring-1 ring-destructive" : ""}`}
                  autoFocus
                />
                {codeError && (
                  <p className="mb-3 text-center text-xs font-medium text-destructive">
                    Codigo incorrecto. Intenta de nuevo.
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setShowCodePrompt(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#1EA7E1] text-white hover:bg-[#1794c7]"
                  >
                    Acceder
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Catalog Content */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Category Filter */}
            <div className="mb-8 overflow-x-auto pb-2">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Sort & Results bar */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {displayProducts.length}
                  </span>{" "}
                  productos
                  {selectedCategory && (
                    <>
                      {" "}en{" "}
                      <span className="font-semibold text-foreground">
                        {categories.find((c) => c.id === selectedCategory)?.name}
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort buttons */}
                <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
                  <span className="px-2 text-xs text-muted-foreground">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </span>
                  <button
                    onClick={() => setSortBy(sortBy === "name-asc" ? "name-desc" : "name-asc")}
                    className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                      sortBy === "name-asc" || sortBy === "name-desc"
                        ? "bg-[#1EA7E1] text-white"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {sortBy === "name-desc" ? (
                      <ArrowUpAZ className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownAZ className="h-3.5 w-3.5" />
                    )}
                    Nombre
                  </button>
                  <button
                    onClick={() => setSortBy(sortBy === "price-asc" ? "price-desc" : "price-asc")}
                    className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                      sortBy === "price-asc" || sortBy === "price-desc"
                        ? "bg-[#1EA7E1] text-white"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {sortBy === "price-desc" ? (
                      <ArrowUp01 className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDown01 className="h-3.5 w-3.5" />
                    )}
                    Precio
                  </button>
                  {sortBy !== "default" && (
                    <button
                      onClick={() => setSortBy("default")}
                      className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Mobile cart button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent lg:hidden"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  ({totalItems})
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="py-16 text-center">
                <p className="text-lg text-muted-foreground">Cargando productos...</p>
              </div>
            ) : displayProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {displayProducts.map((product) => (
                  <ProductCard
                    key={product.code}
                    product={product}
                    isAdmin={priceEditor.isAdmin}
                    onUpdatePrice={priceEditor.updatePrice}
                    onUpdateName={priceEditor.updateName}
                    onResetPrice={priceEditor.resetPrice}
                    isEdited={priceEditor.getPrice(product.code, 0, 0).isEdited}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-lg text-muted-foreground">
                  No se encontraron productos
                </p>
                <p className="mt-2 text-sm text-muted-foreground/70">
                  Intenta con otra busqueda o categoria
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Floating Cart Button - Mobile */}
        {totalItems > 0 && (
          <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
            <Button
              onClick={() => setIsCartOpen(true)}
              className="h-11 w-full rounded-xl bg-[#22c55e] text-sm font-semibold shadow-lg hover:bg-[#16a34a]"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Ver pedido ({totalItems})
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
