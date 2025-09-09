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

    const { studentId, academicYear, month } = await request.json()

    // Get student data
    const student = await getStudentById(studentId)

    // Get attendance records for the month
    const startDate = `${academicYear}-${month.padStart(2, "0")}-01`
    const endDate = `${academicYear}-${month.padStart(2, "0")}-31`

    const { data: attendance } = await supabase
      .from("attendance")
      .select(`
        *,
        subject:subjects(*),
        teacher:teachers(*)
      `)
      .eq("student_id", studentId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date")

    if (!attendance) {
      return NextResponse.json({ error: "No attendance records found" }, { status: 404 })
    }

    const buffer = await DocxService.generateAttendanceReport(student, attendance, academicYear, month)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="kehadiran-${student.full_name}-${month}-${academicYear}.docx"`,
      },
    })
  } catch (error) {
    console.error("Error generating attendance report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
