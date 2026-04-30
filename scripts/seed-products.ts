import { createClient } from "@supabase/supabase-js"
import { products } from "../lib/products-data"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

async function seedProducts() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  console.log(`[Seed] Starting seed for ${products.length} products...`)

  // Prepare data for upsert
  const productsData = products.map((p) => ({
    code: p.code,
    name: p.name,
    category: p.category,
    price_mayor: p.priceMayor,
    price_bulto: p.priceBulto,
    updated_at: new Date().toISOString(),
  }))

  // Batch insert/upsert in chunks of 100
  const CHUNK_SIZE = 100
  let inserted = 0

  for (let i = 0; i < productsData.length; i += CHUNK_SIZE) {
    const chunk = productsData.slice(i, i + CHUNK_SIZE)
    
    const { error } = await supabase
      .from("products")
      .upsert(chunk, { onConflict: "code" })

    if (error) {
      console.error(`[Seed] Error inserting chunk ${i / CHUNK_SIZE + 1}:`, error)
      throw error
    }

    inserted += chunk.length
    console.log(`[Seed] Inserted ${inserted}/${productsData.length} products...`)
  }

  console.log(`[Seed] ✓ Successfully seeded ${inserted} products to Supabase!`)
}

seedProducts().catch((err) => {
  console.error("[Seed] Fatal error:", err)
  process.exit(1)
})
