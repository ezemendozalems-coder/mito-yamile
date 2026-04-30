import { createClient } from "@/lib/supabase/client"

export interface Product {
  code: string
  name: string
  category: string
  priceMayor: number
  priceBulto: number
  image?: string
  images?: string[]
}

export interface Category {
  id: string
  name: string
}

/**
 * Fetch all products from Supabase joined with their main image from product_images
 */
export async function fetchProducts(): Promise<Product[]> {
  const supabase = createClient()

  const [{ data: prods, error }, { data: images }] = await Promise.all([
    supabase
      .from("products")
      .select("code, name, category, price_mayor, price_bulto")
      .order("name", { ascending: true }),
    supabase
      .from("product_images")
      .select("product_code, image_url, is_main, sort_order")
      .not("product_code", "is", null)
      .order("sort_order", { ascending: true }),
  ])

  if (error) {
    console.error("[fetchProducts] Error:", error)
    return []
  }

  // Build a map: product_code -> { main url, all urls }
  const imageMap = new Map<string, { main: string; all: string[] }>()
  for (const img of images || []) {
    if (!img.product_code) continue
    if (!imageMap.has(img.product_code)) {
      imageMap.set(img.product_code, { main: "", all: [] })
    }
    const entry = imageMap.get(img.product_code)!
    entry.all.push(img.image_url)
    if (img.is_main || entry.main === "") {
      entry.main = img.image_url
    }
  }

  return (prods || []).map((p) => {
    const imgs = imageMap.get(p.code)
    return {
      code: p.code,
      name: p.name,
      category: p.category,
      priceMayor: Number(p.price_mayor),
      priceBulto: Number(p.price_bulto),
      image: imgs?.main || "",
      images: imgs?.all || [],
    }
  })
}

/**
 * Static categories list (kept in sync with products-data.ts)
 */
export const categories = [
  { id: "novedades", name: "Novedades" },
  { id: "temporada", name: "Articulos de temporada" },
  { id: "bazar", name: "Bazar" },
  { id: "ferreteria", name: "Ferreteria" },
  { id: "indumentaria", name: "Indumentaria" },
  { id: "inflables", name: "Inflables" },
  { id: "jugueteria", name: "Jugueteria" },
  { id: "libreria", name: "Libreria" },
  { id: "mochilas", name: "Mochilas" },
  { id: "regaleria", name: "Regaleria" },
  { id: "tecnologia", name: "Tecnologia" },
  { id: "varios", name: "Varios" },
]
