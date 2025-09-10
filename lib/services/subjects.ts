import { createClient } from "@/lib/supabase/server"
import type { Subject } from "@/lib/types/database"

export async function getSubjects() {
const supabase = await createClient()

const { data, error } = await supabase.from("matapelajarans").select("*").order("nama_mapel")

if (error) throw error
return data as Subject[]
}

export async function getSubjectById(id: string) {
const supabase = await createClient()

const { data, error } = await supabase.from("matapelajarans").select("*").eq("id", id).single()

if (error) throw error
return data as Subject
}

export async function createSubject(subject: Omit<Subject, "id" | "created_at" | "updated_at">) {
const supabase = await createClient()

const { data, error } = await supabase.from("matapelajarans").insert(subject).select().single()

if (error) throw error
return data as Subject
}

export async function updateSubject(id: string, updates: Partial<Subject>) {
const supabase = await createClient()

const { data, error } = await supabase.from("matapelajarans").update(updates).eq("id", id).select().single()

if (error) throw error
return data as Subject
}

export async function deleteSubject(id: string) {
const supabase = await createClient()

const { error } = await supabase.from("matapelajarans").delete().eq("id", id)

if (error) throw error
}