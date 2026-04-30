import { createClient } from "@/lib/supabase/client"

export type ProductImagesMap = Record<string, { main: string; all: string[] }>

/**
 * Fetches all assigned product images from Supabase.
 * Uses product_code + image_url from the new schema.
 */
export async function fetchProductImagesMap(): Promise<ProductImagesMap> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("product_images")
    .select("product_code, image_url, is_main, sort_order")
    .not("product_code", "is", null)
    .order("sort_order", { ascending: true })

  if (error || !data) return {}

  const map: ProductImagesMap = {}

  for (const row of data) {
    if (!row.product_code) continue
    if (!map[row.product_code]) {
      map[row.product_code] = { main: "", all: [] }
    }
    map[row.product_code].all.push(row.image_url)
    if (row.is_main || map[row.product_code].main === "") {
      map[row.product_code].main = row.image_url
    }
  }

  return map
}
