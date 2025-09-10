"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Subject } from "@/lib/types/database"

const columns: ColumnDef<Subject>[] = [
  {
    accessorKey: "code",
    header: "Kode",
  },
  {
    accessorKey: "name",
    header: "Nama Mata Pelajaran",
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return description || "-"
    },
  },
]

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/mataplejarans")
      if (response.ok) {
        const data = await response.json()
        setSubjects(data)
      }
    } catch (error) {
      console.error("Error fetching subjects:", error)
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
          <h1 className="text-3xl font-bold">Mata Pelajaran</h1>
          <p className="text-muted-foreground">Kelola mata pelajaran pesantren</p>
        </div>
        <Button>Tambah Mata Pelajaran</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Mata Pelajaran</CardTitle>
          <CardDescription>Total {subjects.length} mata pelajaran terdaftar</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={subjects} searchKey="name" searchPlaceholder="Cari mata pelajaran..." />
        </CardContent>
      </Card>
    </div>
  )
}
