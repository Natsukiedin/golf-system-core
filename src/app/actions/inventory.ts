'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getInventory() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('inventory').select('*').order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  return data
}

export async function getInventoryById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('inventory').select('*').eq('id', id).single()
  
  if (error) throw new Error(error.message)
  return data
}

export async function getLowStockAlerts() {
  const supabase = await createClient()
  // Fetching all inventory to check against thresholds. 
  // In a large DB, a database function/RPC or view would be more efficient.
  const { data, error } = await supabase.from('inventory').select('*')
  
  if (error) throw new Error(error.message)
  
  // Filter items where stock_quantity is less than or equal to min_threshold (default to 5 if undefined)
  const alerts = data.filter((item: any) => {
    const threshold = item.min_threshold !== undefined && item.min_threshold !== null ? item.min_threshold : 5
    return item.stock_quantity <= threshold
  })
  
  return alerts
}

export async function createInventoryItem(itemData: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('inventory').insert(itemData).select().single()
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/inventory')
  return data
}

export async function updateInventoryItem(id: string, itemData: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('inventory').update(itemData).eq('id', id).select().single()
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/inventory')
  return data
}

export async function deleteInventoryItem(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('inventory').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/inventory')
}
