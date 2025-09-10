"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExportImportButtons } from "@/components/export-import-buttons"
import type { Student } from "@/lib/types/database"
import { Badge } from "@/components/ui/badge"

const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "student_id",
    header: "ID Siswa",
  },
  {
    accessorKey: "full_name",
    header: "Nama Lengkap",
  },
  {
    accessorKey: "gender",
    header: "Jenis Kelamin",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string
      return (
        <Badge variant={gender === "MALE" ? "default" : "secondary"}>
          {gender === "MALE" ? "Laki-laki" : "Perempuan"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "enrollment_date",
    header: "Tanggal Masuk",
    cell: ({ row }) => {
      const date = new Date(row.getValue("enrollment_date"))
      return date.toLocaleDateString("id-ID")
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

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/siswas")
      if (response.ok) {
        const data = await response.json()
        setStudents(data)
      }
    } catch (error) {
      console.error("Error fetching students:", error)
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
          <h1 className="text-3xl font-bold">Data Siswa</h1>
          <p className="text-muted-foreground">Kelola data siswa pesantren</p>
        </div>
        <div className="flex gap-2">
          <ExportImportButtons entityType="students" onImportComplete={fetchStudents} />
          <Button>Tambah Siswa</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Siswa</CardTitle>
          <CardDescription>Total {students.length} siswa terdaftar</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={students} searchKey="full_name" searchPlaceholder="Cari nama siswa..." />
        </CardContent>
      </Card>
    </div>
  )
}
