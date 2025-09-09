"use client"

import { useEffect, useState } from "react"
import { ReportGenerator } from "@/components/report-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsPage() {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [studentsRes, classesRes, teachersRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/classes"),
        fetch("/api/teachers"),
      ])

      const [studentsData, classesData, teachersData] = await Promise.all([
        studentsRes.json(),
        classesRes.json(),
        teachersRes.json(),
      ])

      setStudents(studentsData)
      setClasses(classesData)
      setTeachers(teachersData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Generator Laporan</h1>
        <p className="text-muted-foreground">Buat berbagai jenis laporan dalam format DOCX</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Laporan Akademik</CardTitle>
            <CardDescription>Rapor siswa, daftar nilai, dan laporan akademik lainnya</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• Rapor siswa per semester</li>
              <li>• Daftar nilai kelas</li>
              <li>• Statistik akademik</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Laporan Kehadiran</CardTitle>
            <CardDescription>Laporan absensi siswa dan guru</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• Kehadiran siswa bulanan</li>
              <li>• Rekap absensi kelas</li>
              <li>• Statistik kehadiran</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Laporan Administratif</CardTitle>
            <CardDescription>Daftar siswa, jadwal, dan laporan administratif</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• Daftar siswa per kelas</li>
              <li>• Jadwal mengajar guru</li>
              <li>• Data demografis</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <ReportGenerator students={students} classes={classes} teachers={teachers} />
    </div>
  )
}
