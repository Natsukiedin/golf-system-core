'use server'

import { createClient } from '@/utils/supabase/server'

interface PartUsage {
  part_id: string
  quantity: number
}

export async function calculateTaskPrice(partsUsed: PartUsage[], laborType?: string) {
  const supabase = await createClient()
  
  let partsTotal = 0
  let laborTotal = 0

  // 1. Calculate parts total based on inventory prices
  if (partsUsed && partsUsed.length > 0) {
    const partIds = partsUsed.map(p => p.part_id)
    const { data: inventoryItems, error: invError } = await supabase
      .from('inventory')
      .select('id, price')
      .in('id', partIds)

    if (!invError && inventoryItems) {
      for (const usage of partsUsed) {
        const item = inventoryItems.find(i => i.id === usage.part_id)
        if (item) {
          partsTotal += (item.price || 0) * usage.quantity
        }
      }
    }
  }

  // 2. Calculate labor total based on pricing table
  if (laborType) {
    const { data: pricingData, error: priceError } = await supabase
      .from('pricing')
      .select('price')
      .eq('labor_type', laborType)
      .single()

    if (!priceError && pricingData) {
      laborTotal = pricingData.price || 0
    }
  }

  const subtotal = partsTotal + laborTotal
  const tax = Math.floor(subtotal * 0.10) // Assuming 10% tax
  const total = subtotal + tax

  return {
    partsTotal,
    laborTotal,
    subtotal,
    tax,
    total
  }
}

export async function getPricingOptions() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('pricing').select('*').order('labor_type', { ascending: true })
  
  if (error) throw new Error(error.message)
  return data
}
