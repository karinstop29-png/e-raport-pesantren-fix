import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getStudents } from "@/lib/services/students"
import { ExcelService } from "@/lib/services/excel"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const students = await getStudents()
    const buffer = await ExcelService.exportStudents(students)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="data-siswa-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    })
  } catch (error) {
    console.error("Error exporting students:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
