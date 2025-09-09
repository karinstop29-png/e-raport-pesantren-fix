import { createClient } from "@/lib/supabase/server"
import type { Student } from "@/lib/types/database"

export async function getStudents() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("students").select("*").order("full_name")

  if (error) throw error
  return data as Student[]
}

export async function getStudentById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("students").select("*").eq("id", id).single()

  if (error) throw error
  return data as Student
}

export async function createStudent(student: Omit<Student, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("students").insert(student).select().single()

  if (error) throw error
  return data as Student
}

export async function updateStudent(id: string, updates: Partial<Student>) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("students").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data as Student
}

export async function deleteStudent(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("students").delete().eq("id", id)

  if (error) throw error
}

export async function getStudentsByClass(classId: string, academicYear: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("class_students")
    .select(`
      *,
      student:students(*)
    `)
    .eq("class_id", classId)
    .eq("academic_year", academicYear)

  if (error) throw error
  return data
}
