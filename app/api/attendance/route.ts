import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const date = searchParams.get("date")
  const classId = searchParams.get("class_id")
  const subjectId = searchParams.get("subject_id")

  try {
    let query = supabase.from("attendance").select(`
        *,
        student:students(id, full_name, student_id),
        subject:subjects(id, name),
        teacher:teachers(id, full_name)
      `)

    if (date) {
      query = query.eq("date", date)
    }
    if (classId) {
      query = query.eq("class_id", classId)
    }
    if (subjectId) {
      query = query.eq("subject_id", subjectId)
    }

    const { data, error } = await query.order("date", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  try {
    const body = await request.json()
    const { attendanceRecords } = body

    // Bulk insert attendance records
    const { data, error } = await supabase.from("attendance").insert(attendanceRecords).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
