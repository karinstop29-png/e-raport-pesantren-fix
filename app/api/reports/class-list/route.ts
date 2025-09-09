import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getClassById } from "@/lib/services/classes"
import { getStudentsByClass } from "@/lib/services/students"
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

    const { classId, academicYear } = await request.json()

    // Get class data
    const classData = await getClassById(classId)

    // Get students in class
    const classStudents = await getStudentsByClass(classId, academicYear)
    const students = classStudents.map((cs: any) => cs.student)

    const buffer = await DocxService.generateClassListReport(classData, students)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="daftar-siswa-${classData.name}-${academicYear}.docx"`,
      },
    })
  } catch (error) {
    console.error("Error generating class list report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
