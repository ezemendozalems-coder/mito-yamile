import { createClient } from "@/lib/supabase/client"

export type ProductImagesMap = Record<string, { main: string; all: string[] }>

const PAGE_SIZE = 1000

/**
 * Fetches all assigned product images from Supabase.
 * Uses product_code + image_url from the new schema.
 *
 * Paginates via .range() because Supabase/PostgREST caps a single response
 * at 1000 rows — without this, rows past the cap get silently dropped.
 */
export async function fetchProductImagesMap(): Promise<ProductImagesMap> {
  const supabase = createClient()

  const data: { product_code: string; image_url: string; is_main: boolean; sort_order: number }[] = []
  let from = 0
  while (true) {
    const { data: page, error } = await supabase
      .from("product_images")
      .select("product_code, image_url, is_main, sort_order")
      .not("product_code", "is", null)
      .order("sort_order", { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      console.error("[fetchProductImagesMap] Error:", error)
      break
    }
    if (!page || page.length === 0) break
    data.push(...page)
    if (page.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

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
