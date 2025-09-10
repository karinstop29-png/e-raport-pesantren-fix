"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExportImportButtons } from "@/components/export-import-buttons"
import type { Teacher } from "@/lib/types/database"
import { Badge } from "@/components/ui/badge"

const columns: ColumnDef<Teacher>[] = [
  {
    accessorKey: "teacher_id",
    header: "ID Guru",
  },
  {
    accessorKey: "full_name",
    header: "Nama Lengkap",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Telepon",
  },
  {
    accessorKey: "hire_date",
    header: "Tanggal Bergabung",
    cell: ({ row }) => {
      const date = new Date(row.getValue("hire_date"))
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

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await fetch("/api/gurus")
      if (response.ok) {
        const data = await response.json()
        setTeachers(data)
      }
    } catch (error) {
      console.error("Error fetching teachers:", error)
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
          <h1 className="text-3xl font-bold">Data Guru</h1>
          <p className="text-muted-foreground">Kelola data guru pesantren</p>
        </div>
        <div className="flex gap-2">
          <ExportImportButtons entityType="teachers" onImportComplete={fetchTeachers} />
          <Button>Tambah Guru</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Guru</CardTitle>
          <CardDescription>Total {teachers.length} guru terdaftar</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={teachers} searchKey="full_name" searchPlaceholder="Cari nama guru..." />
        </CardContent>
      </Card>
    </div>
  )
}
