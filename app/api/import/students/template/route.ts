import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
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

    const buffer = await ExcelService.generateStudentTemplate()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="template-import-siswa.xlsx"',
      },
    })
  } catch (error) {
    console.error("Error generating template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
