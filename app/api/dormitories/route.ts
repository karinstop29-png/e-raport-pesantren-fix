import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase.from("kamars").select("*").order("nama")

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching dormitories:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
