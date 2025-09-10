import { type NextRequest, NextResponse } from "next/server"
import { getTeachers, createTeacher } from "@/lib/services/teachers"
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

    const teachers = await getTeachers()
    return NextResponse.json(teachers)
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const teacher = await createTeacher(body)
    return NextResponse.json(teacher, { status: 201 })
  } catch (error) {
    console.error("Error creating teacher:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
