'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getTasks() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  return data
}

export async function getTaskById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single()
  
  if (error) throw new Error(error.message)
  return data
}

export async function createTask(taskData: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('tasks').insert(taskData).select().single()
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/tasks')
  return data
}

export async function updateTask(id: string, taskData: any) {
  const supabase = await createClient()
  
  // Inventory deduction logic when status changes to 'お渡し済'
  if (taskData.status === 'お渡し済') {
    let usedParts = taskData.used_parts
    
    // If used_parts is not provided in the update payload, fetch it from the existing task
    if (!usedParts) {
      const { data: existingTask } = await supabase.from('tasks').select('used_parts').eq('id', id).single()
      if (existingTask) {
        usedParts = existingTask.used_parts
      }
    }
    
    if (usedParts && Array.isArray(usedParts)) {
      // Note: For full atomicity and safety, this should ideally be handled via a Supabase RPC or Database Trigger.
      // Doing it sequentially here for demonstration.
      for (const part of usedParts) {
        if (part.part_id && part.quantity) {
          const { data: inventoryItem } = await supabase.from('inventory').select('stock_quantity').eq('id', part.part_id).single()
          if (inventoryItem) {
            const newQuantity = Math.max(0, inventoryItem.stock_quantity - part.quantity)
            await supabase.from('inventory').update({ stock_quantity: newQuantity }).eq('id', part.part_id)
          }
        }
      }
    }
  }

  const { data, error } = await supabase.from('tasks').update(taskData).eq('id', id).select().single()
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/tasks')
  revalidatePath(`/tasks/${id}`)
  revalidatePath('/inventory') // Revalidate inventory as stock might have changed
  return data
}

export async function deleteTask(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/tasks')
}
