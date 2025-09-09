"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Schedule } from "@/lib/types/database"
import { Badge } from "@/components/ui/badge"

const columns: ColumnDef<Schedule>[] = [
  {
    accessorKey: "day_of_week",
    header: "Hari",
    cell: ({ row }) => {
      const day = row.getValue("day_of_week") as number
      const days = ["", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
      return days[day] || "-"
    },
  },
  {
    accessorKey: "start_time",
    header: "Waktu",
    cell: ({ row }) => {
      const startTime = row.getValue("start_time") as string
      const endTime = row.original.end_time
      return `${startTime} - ${endTime}`
    },
  },
  {
    accessorKey: "subject",
    header: "Mata Pelajaran",
    cell: ({ row }) => {
      const subject = row.original.subject
      return subject ? subject.name : "-"
    },
  },
  {
    accessorKey: "class",
    header: "Kelas",
    cell: ({ row }) => {
      const classData = row.original.class
      return classData ? classData.name : "-"
    },
  },
  {
    accessorKey: "teacher",
    header: "Guru",
    cell: ({ row }) => {
      const teacher = row.original.teacher
      return teacher ? teacher.full_name : "-"
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean
      return <Badge variant={isActive ? "default" : "destructive"}>{isActive ? "Aktif" : "Tidak Aktif"}</Badge>
    },
  },
]

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2024/2025")
  const [selectedSemester, setSelectedSemester] = useState("GANJIL")

  useEffect(() => {
    fetchSchedules()
  }, [selectedAcademicYear, selectedSemester])

  const fetchSchedules = async () => {
    try {
      const response = await fetch(`/api/schedules?academic_year=${selectedAcademicYear}&semester=${selectedSemester}`)
      if (response.ok) {
        const data = await response.json()
        setSchedules(data)
      }
    } catch (error) {
      console.error("Error fetching schedules:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Jadwal Pelajaran</h1>
          <p className="text-muted-foreground">Kelola jadwal pelajaran pesantren</p>
        </div>
        <Button>Tambah Jadwal</Button>
      </div>

      <div className="flex gap-4">
        <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Pilih tahun ajaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024/2025">2024/2025</SelectItem>
            <SelectItem value="2023/2024">2023/2024</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Pilih semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GANJIL">Semester Ganjil</SelectItem>
            <SelectItem value="GENAP">Semester Genap</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Jadwal</CardTitle>
          <CardDescription>
            {selectedAcademicYear} - Semester {selectedSemester === "GANJIL" ? "Ganjil" : "Genap"} ({schedules.length}{" "}
            jadwal)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={schedules}
            searchKey="subject"
            searchPlaceholder="Cari mata pelajaran..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
