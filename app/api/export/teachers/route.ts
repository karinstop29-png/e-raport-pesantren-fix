import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getTeachers } from "@/lib/services/teachers"
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

    const teachers = await getTeachers()
    const buffer = await ExcelService.exportTeachers(teachers)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="data-guru-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    })
  } catch (error) {
    console.error("Error exporting teachers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
