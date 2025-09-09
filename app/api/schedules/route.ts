import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const academicYear = searchParams.get("academic_year") || "2024/2025"
    const semester = searchParams.get("semester") || "GANJIL"

    const { data, error } = await supabase
      .from("schedules")
      .select(`
        *,
        class:classes(*),
        subject:subjects(*),
        teacher:teachers(*)
      `)
      .eq("academic_year", academicYear)
      .eq("semester", semester)
      .order("day_of_week")
      .order("start_time")

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching schedules:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
