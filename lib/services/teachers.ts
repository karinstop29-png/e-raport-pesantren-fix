import { createClient } from "@/lib/supabase/server"
import type { Teacher } from "@/lib/types/database"

export async function getTeachers() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("gurus").select("*").order("nama")

  if (error) throw error
  return data as Teacher[]
}

export async function getTeacherById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("gurus").select("*").eq("id", id).single()

  if (error) throw error
  return data as Teacher
}

export async function createTeacher(teacher: Omit<Teacher, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("gurus").insert(teacher).select().single()

  if (error) throw error
  return data as Teacher
}

export async function updateTeacher(id: string, updates: Partial<Teacher>) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("gurus").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data as Teacher
}

export async function deleteTeacher(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("gurus").delete().eq("id", id)

  if (error) throw error
}
