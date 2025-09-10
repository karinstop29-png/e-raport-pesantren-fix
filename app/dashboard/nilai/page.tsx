"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExportImportButtons } from "@/components/export-import-buttons"
import type { GradeRecord } from "@/lib/types/database"
import { Badge } from "@/components/ui/badge"

const columns: ColumnDef<GradeRecord>[] = [
  {
    accessorKey: "student",
    header: "Nama Siswa",
    cell: ({ row }) => {
      const student = row.original.student
      return student ? student.full_name : "-"
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
    accessorKey: "assignment_score",
    header: "Tugas",
    cell: ({ row }) => {
      const score = row.getValue("assignment_score") as number
      return score.toFixed(1)
    },
  },
  {
    accessorKey: "midterm_score",
    header: "UTS",
    cell: ({ row }) => {
      const score = row.getValue("midterm_score") as number
      return score.toFixed(1)
    },
  },
  {
    accessorKey: "final_score",
    header: "UAS",
    cell: ({ row }) => {
      const score = row.getValue("final_score") as number
      return score.toFixed(1)
    },
  },
  {
    accessorKey: "total_score",
    header: "Total",
    cell: ({ row }) => {
      const score = row.getValue("total_score") as number
      return score.toFixed(1)
    },
  },
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => {
      const grade = row.getValue("grade") as string
      const getGradeColor = (grade: string) => {
        switch (grade) {
          case "A":
            return "bg-green-500"
          case "B":
            return "bg-blue-500"
          case "C":
            return "bg-yellow-500"
          case "D":
            return "bg-orange-500"
          case "E":
            return "bg-red-500"
          default:
            return "bg-gray-500"
        }
      }
      return <Badge className={getGradeColor(grade)}>{grade}</Badge>
    },
  },
]

export default function GradesPage() {
  const [grades, setGrades] = useState<GradeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2024/2025")
  const [selectedSemester, setSelectedSemester] = useState("GANJIL")

  useEffect(() => {
    fetchGrades()
  }, [selectedAcademicYear, selectedSemester])

  const fetchGrades = async () => {
    try {
      const response = await fetch(`/api/nilaiujians?academic_year=${selectedAcademicYear}&semester=${selectedSemester}`)
      if (response.ok) {
        const data = await response.json()
        setGrades(data)
      }
    } catch (error) {
      console.error("Error fetching grades:", error)
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
          <h1 className="text-3xl font-bold">Data Nilai</h1>
          <p className="text-muted-foreground">Kelola nilai siswa pesantren</p>
        </div>
        <div className="flex gap-2">
          <ExportImportButtons entityType="grades" onImportComplete={fetchGrades} />
          <Button>Input Nilai</Button>
        </div>
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
          <CardTitle>Daftar Nilai</CardTitle>
          <CardDescription>
            {selectedAcademicYear} - Semester {selectedSemester === "GANJIL" ? "Ganjil" : "Genap"} ({grades.length}{" "}
            nilai)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={grades} searchKey="student" searchPlaceholder="Cari nama siswa..." />
        </CardContent>
      </Card>
    </div>
  )
}
