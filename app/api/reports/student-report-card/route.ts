import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getStudentById } from "@/lib/services/students"
import { DocxService } from "@/lib/services/docx"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentId, academicYear, semester } = await request.json()

    // Get student data
    const student = await getStudentById(studentId)

    // Get grades
    const { data: grades } = await supabase
      .from("grades")
      .select(`
        *,
        subject:subjects(*),
        teacher:teachers(*)
      `)
      .eq("student_id", studentId)
      .eq("academic_year", academicYear)
      .eq("semester", semester)

    if (!grades) {
      return NextResponse.json({ error: "No grades found" }, { status: 404 })
    }

    const buffer = await DocxService.generateStudentReportCard(student, grades, academicYear, semester)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="rapor-${student.full_name}-${academicYear}-${semester}.docx"`,
      },
    })
  } catch (error) {
    console.error("Error generating student report card:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
