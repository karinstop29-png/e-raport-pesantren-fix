"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Class } from "@/lib/types/database"
import { Badge } from "@/components/ui/badge"

const columns: ColumnDef<Class>[] = [
  {
    accessorKey: "name",
    header: "Nama Kelas",
  },
  {
    accessorKey: "level",
    header: "Tingkat",
    cell: ({ row }) => {
      const level = row.getValue("level") as string
      const levelMap = {
        IBTIDAIYAH: "Ibtidaiyah",
        TSANAWIYAH: "Tsanawiyah",
        ALIYAH: "Aliyah",
      }
      return <Badge variant="outline">{levelMap[level as keyof typeof levelMap]}</Badge>
    },
  },
  {
    accessorKey: "academic_year",
    header: "Tahun Ajaran",
  },
  {
    accessorKey: "homeroom_teacher",
    header: "Wali Kelas",
    cell: ({ row }) => {
      const teacher = row.original.homeroom_teacher
      return teacher ? teacher.full_name : "-"
    },
  },
  {
    accessorKey: "max_students",
    header: "Kapasitas",
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

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/kelas")
      if (response.ok) {
        const data = await response.json()
        setClasses(data)
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
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
          <h1 className="text-3xl font-bold">Data Kelas</h1>
          <p className="text-muted-foreground">Kelola data kelas pesantren</p>
        </div>
        <Button>Tambah Kelas</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kelas</CardTitle>
          <CardDescription>Total {classes.length} kelas terdaftar</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={classes} searchKey="name" searchPlaceholder="Cari nama kelas..." />
        </CardContent>
      </Card>
    </div>
  )
}
