import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ExcelService } from "@/lib/services/excel"
import { createStudent } from "@/lib/services/students"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const students = await ExcelService.parseStudentImport(buffer)

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Process each student
    for (const [index, studentData] of students.entries()) {
      try {
        await createStudent(studentData as any)
        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(`Baris ${index + 2}: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    return NextResponse.json({
      message: `Import selesai. ${results.success} berhasil, ${results.failed} gagal.`,
      results,
    })
  } catch (error) {
    console.error("Error importing students:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
