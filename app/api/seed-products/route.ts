import { createClient } from "@/lib/supabase/server"
import { products } from "@/lib/products-data"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = await createClient()

    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log(`[Seed API] Starting seed for ${products.length} products...`)

    // Prepare data
    const productsData = products.map((p) => ({
      code: p.code,
      name: p.name,
      category: p.category,
      price_mayor: p.priceMayor,
      price_bulto: p.priceBulto,
      updated_at: new Date().toISOString(),
    }))

    // Insert in batches
    const BATCH_SIZE = 100
    let inserted = 0
    const errors = []

    for (let i = 0; i < productsData.length; i += BATCH_SIZE) {
      const batch = productsData.slice(i, i + BATCH_SIZE)
      
      const { error } = await supabase
        .from("products")
        .upsert(batch, { onConflict: "code" })

      if (error) {
        console.error(`[Seed API] Error batch ${i / BATCH_SIZE + 1}:`, error)
        errors.push(error)
      } else {
        inserted += batch.length
        console.log(`[Seed API] Progress: ${inserted}/${productsData.length}`)
      }
    }

    return NextResponse.json({
      success: true,
      inserted,
      total: productsData.length,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error("[Seed API] Fatal error:", error)
    return NextResponse.json(
      { error: "Failed to seed products" },
      { status: 500 }
    )
  }
}
