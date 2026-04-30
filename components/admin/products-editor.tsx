"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Save, X, Loader2 } from "lucide-react"
import { categories } from "@/lib/products-data"

type Product = {
  code: string
  name: string
  category: string
  price_mayor: number
  price_bulto: number
}

export function ProductsEditor() {
  const [search, setSearch] = useState("")
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    try {
      const { data: dbProducts, error } = await supabase
        .from("products")
        .select("*")
        .order("code")

      if (error) throw error

      setAllProducts(dbProducts || [])
    } catch (error) {
      console.error("[v0] Error loading products:", error)
      setAllProducts([])
    } finally {
      setLoading(false)
    }
  }

  async function saveProduct(product: Product) {
    setSaving(true)
    try {
      const { error } = await supabase.from("products").upsert({
        code: product.code,
        name: product.name,
        category: product.category,
        price_mayor: product.price_mayor,
        price_bulto: product.price_bulto,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      setAllProducts(prev =>
        prev.map(p => (p.code === product.code ? product : p))
      )
      setEditingProduct(null)
    } catch (error) {
      console.error("[v0] Error saving product:", error)
      alert("Error al guardar el producto")
    } finally {
      setSaving(false)
    }
  }

  const filteredProducts = allProducts.filter(
    p =>
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#1EA7E1]" />
      </div>
    )
  }

  if (allProducts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 py-12 text-center">
        <p className="text-lg font-medium text-foreground">No hay productos en la base de datos</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Haz clic en el botón <span className="font-semibold">"Seed desde estáticos"</span> arriba para cargar todos los productos.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por código o nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left font-medium">Código</th>
              <th className="p-3 text-left font-medium">Nombre</th>
              <th className="p-3 text-left font-medium">Categoría</th>
              <th className="p-3 text-right font-medium">Precio Mayor</th>
              <th className="p-3 text-right font-medium">Precio Bulto</th>
              <th className="p-3 text-center font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.slice(0, 50).map(product => {
              const isEditing = editingProduct?.code === product.code

              return (
                <tr key={product.code} className="border-t hover:bg-muted/30">
                  <td className="p-3 font-mono text-xs">{product.code}</td>
                  <td className="p-3">
                    {isEditing ? (
                      <Input
                        value={editingProduct.name}
                        onChange={e =>
                          setEditingProduct({ ...editingProduct, name: e.target.value })
                        }
                        className="h-8"
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td className="p-3">
                    {isEditing ? (
                      <select
                        value={editingProduct.category}
                        onChange={e =>
                          setEditingProduct({
                            ...editingProduct,
                            category: e.target.value,
                          })
                        }
                        className="h-8 rounded-md border bg-background px-2 text-sm"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      categories.find(c => c.id === product.category)?.name ||
                      product.category
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editingProduct.price_mayor}
                        onChange={e =>
                          setEditingProduct({
                            ...editingProduct,
                            price_mayor: Number(e.target.value),
                          })
                        }
                        className="h-8 text-right"
                      />
                    ) : (
                      `$${product.price_mayor.toLocaleString()}`
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editingProduct.price_bulto}
                        onChange={e =>
                          setEditingProduct({
                            ...editingProduct,
                            price_bulto: Number(e.target.value),
                          })
                        }
                        className="h-8 text-right"
                      />
                    ) : (
                      `$${product.price_bulto.toLocaleString()}`
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => saveProduct(editingProduct)}
                            disabled={saving}
                            className="h-8 bg-[#22c55e] hover:bg-[#16a34a]"
                          >
                            {saving ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Save className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingProduct(null)}
                            disabled={saving}
                            className="h-8"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingProduct(product)}
                          className="h-8"
                        >
                          Editar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filteredProducts.length > 50 && (
        <p className="text-center text-sm text-muted-foreground">
          Mostrando 50 de {filteredProducts.length} productos. Usa el buscador para ver más.
        </p>
      )}
    </div>
  )
}
