'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getClubSpecs(customerId?: string) {
  const supabase = await createClient()
  let query = supabase.from('club_specs').select('*').order('created_at', { ascending: false })
  
  if (customerId) {
    query = query.eq('customer_id', customerId)
  }
  
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data
}

export async function getClubSpecById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('club_specs').select('*').eq('id', id).single()
  
  if (error) throw new Error(error.message)
  return data
}

export async function createClubSpec(specData: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('club_specs').insert(specData).select().single()
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/customers')
  return data
}

export async function createClubSpecsBulk(specsData: any[]) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('club_specs').insert(specsData).select()
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/customers')
  return data
}

export async function updateClubSpec(id: string, specData: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('club_specs').update(specData).eq('id', id).select().single()
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/customers')
  return data
}

export async function deleteClubSpec(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('club_specs').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/customers')
}
