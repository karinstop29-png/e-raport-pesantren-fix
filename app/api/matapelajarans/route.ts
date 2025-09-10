import { type NextRequest, NextResponse } from "next/server"
import { getSubjects, createSubject } from "@/lib/services/subjects"
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

    const subjects = await getSubjects()
    return NextResponse.json(subjects)
  } catch (error) {
    console.error("Error fetching subjects:", error)
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
    const subject = await createSubject(body)
    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    console.error("Error creating subject:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
