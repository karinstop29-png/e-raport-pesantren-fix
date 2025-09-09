"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Dormitory } from "@/lib/types/database"
import { Badge } from "@/components/ui/badge"

const columns: ColumnDef<Dormitory>[] = [
  {
    accessorKey: "name",
    header: "Nama Asrama",
  },
  {
    accessorKey: "gender",
    header: "Jenis Kelamin",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string
      return (
        <Badge variant={gender === "MALE" ? "default" : "secondary"}>{gender === "MALE" ? "Putra" : "Putri"}</Badge>
      )
    },
  },
  {
    accessorKey: "capacity",
    header: "Kapasitas",
  },
  {
    accessorKey: "supervisor",
    header: "Pengawas",
    cell: ({ row }) => {
      const supervisor = row.original.supervisor
      return supervisor ? supervisor.full_name : "-"
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

export default function DormitoriesPage() {
  const [dormitories, setDormitories] = useState<Dormitory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDormitories()
  }, [])

  const fetchDormitories = async () => {
    try {
      const response = await fetch("/api/dormitories")
      if (response.ok) {
        const data = await response.json()
        setDormitories(data)
      }
    } catch (error) {
      console.error("Error fetching dormitories:", error)
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
          <h1 className="text-3xl font-bold">Data Asrama</h1>
          <p className="text-muted-foreground">Kelola data asrama pesantren</p>
        </div>
        <Button>Tambah Asrama</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Asrama</CardTitle>
          <CardDescription>Total {dormitories.length} asrama terdaftar</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={dormitories} searchKey="name" searchPlaceholder="Cari nama asrama..." />
        </CardContent>
      </Card>
    </div>
  )
}
