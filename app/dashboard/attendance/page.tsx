"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

// Interface sudah sesuai schema.prisma
interface Siswa {
  id: string
  nama: string
  nis: string
}

interface Kelas {
  id: string
  nama: string
  tingkat: number
}

interface MataPelajaran {
  id: string
  nama_mapel: string // Sesuai schema.prisma
}

interface KehadiranRecord {
  id?: string
  siswaId: string
  indikatorId: string
  izin: number
  sakit: number
  absen: number
  semester: "GANJIL" | "GENAP"
  tahunAjaran: string
}

// Tipe untuk status yang digunakan di UI
type StatusAbsensi = "HADIR" | "SAKIT" | "IZIN" | "ABSEN"

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [students, setStudents] = useState<Siswa[]>([])
  const [classes, setClasses] = useState<Kelas[]>([])
  const [subjects, setSubjects] = useState<MataPelajaran[]>([])
  const [attendance, setAttendance] = useState<Record<string, KehadiranRecord>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClasses()
    fetchSubjects()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchStudents()
    }
  }, [selectedClass])

  // Reset attendance when filters change
  useEffect(() => {
    setAttendance({})
    if (selectedClass && selectedSubject && selectedDate) {
      fetchAttendance()
    }
  }, [selectedClass, selectedSubject, selectedDate])

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/kelas")
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error("Error fetching classes:", error)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/matapelajarans")
      const data = await response.json()
      setSubjects(data)
    } catch (error) {
      console.error("Error fetching subjects:", error)
    }
  }

  const fetchStudents = async () => {
    try {
      // Logic to fetch students based on class selection
      // This might need adjustment in your API to filter students by class history
      const response = await fetch(`/api/siswas?riwayat_kelas_id=${selectedClass}`)
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const fetchAttendance = async () => {
    // Logic to fetch attendance based on new schema might need adjustment
    // The current schema is per-semester, not per-day.
    // For now, this function is a placeholder.
  }

  const updateAttendance = (siswaId: string, status: StatusAbsensi) => {
    setAttendance((prev) => ({
      ...prev,
      [siswaId]: {
        ...prev[siswaId],
        siswaId: siswaId,
        indikatorId: "default-indicator-id", // Placeholder
        izin: status === "IZIN" ? 1 : 0,
        sakit: status === "SAKIT" ? 1 : 0,
        absen: status === "ABSEN" ? 1 : 0,
        semester: "GANJIL", // Placeholder
        tahunAjaran: "2024/2025", // Placeholder
      },
    }))
  }

  const saveAttendance = async () => {
    setLoading(true)
    try {
      const attendanceRecords = Object.values(attendance)
      const response = await fetch("/api/kehadirans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendanceRecords }),
      })

      if (response.ok) {
        alert("Absensi berhasil disimpan!")
      } else {
        throw new Error("Gagal menyimpan absensi")
      }
    } catch (error) {
      console.error("Error saving attendance:", error)
      alert("Gagal menyimpan absensi")
    } finally {
      setLoading(false)
    }
  }
  
  // Fungsi ini menerjemahkan dari record ke status UI
  const getStatusFromRecord = (record?: KehadiranRecord): StatusAbsensi => {
    if (!record) return "HADIR"
    if (record.sakit > 0) return "SAKIT"
    if (record.izin > 0) return "IZIN"
    if (record.absen > 0) return "ABSEN"
    return "HADIR"
  }

  const getStatusBadge = (status: StatusAbsensi) => {
    const variants = {
      HADIR: { variant: "default" as const, icon: CheckCircle, text: "Hadir" },
      ABSEN: { variant: "destructive" as const, icon: XCircle, text: "Tidak Hadir" },
      SAKIT: { variant: "secondary" as const, icon: AlertCircle, text: "Sakit" },
      IZIN: { variant: "outline" as const, icon: Clock, text: "Izin" },
    }
    const config = variants[status]
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    )
  }

  const getAttendanceStats = () => {
    const records = Object.values(attendance)
    return {
      sakit: records.reduce((sum, r) => sum + (r.sakit || 0), 0),
      izin: records.reduce((sum, r) => sum + (r.izin || 0), 0),
      absen: records.reduce((sum, r) => sum + (r.absen || 0), 0),
      total: students.length,
    }
  }

  const stats = getAttendanceStats()
  stats.present = stats.total - (stats.sakit + stats.izin + stats.absen)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Absensi Siswa</h1>
          <p className="text-muted-foreground">Kelola kehadiran siswa harian</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Filter Absensi
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="date">Tanggal</Label>
            <Input id="date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="class">Kelas</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kelas" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.nama} - {cls.tingkat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Mata Pelajaran</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih mata pelajaran" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.nama_mapel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedClass && selectedSubject && (
        <div className="grid gap-4 md:grid-cols-5">
            <Card><CardContent className="p-4"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-medium">Total</span></div><div className="text-2xl font-bold">{stats.total}</div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" /><span className="text-sm font-medium">Hadir</span></div><div className="text-2xl font-bold text-green-600">{stats.present}</div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-2"><XCircle className="h-4 w-4 text-red-600" /><span className="text-sm font-medium">Tidak Hadir</span></div><div className="text-2xl font-bold text-red-600">{stats.absen}</div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-2"><AlertCircle className="h-4 w-4 text-yellow-600" /><span className="text-sm font-medium">Sakit</span></div><div className="text-2xl font-bold text-yellow-600">{stats.sakit}</div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-2"><Clock className="h-4 w-4 text-blue-600" /><span className="text-sm font-medium">Izin</span></div><div className="text-2xl font-bold text-blue-600">{stats.izin}</div></CardContent></Card>
        </div>
      )}

      {selectedClass && selectedSubject && students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Kehadiran</CardTitle>
            <CardDescription>{format(new Date(selectedDate), "dd MMMM yyyy", { locale: id })}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.map((student) => {
                const record = attendance[student.id]
                const currentStatus = getStatusFromRecord(record)
                return (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{student.nama}</p>
                      <p className="text-sm text-muted-foreground">NIS: {student.nis}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(currentStatus)}
                      <div className="flex gap-1">
                        <Button size="sm" variant={currentStatus === "HADIR" ? "default" : "outline"} onClick={() => updateAttendance(student.id, "HADIR")}>Hadir</Button>
                        <Button size="sm" variant={currentStatus === "ABSEN" ? "destructive" : "outline"} onClick={() => updateAttendance(student.id, "ABSEN")}>Tidak Hadir</Button>
                        <Button size="sm" variant={currentStatus === "SAKIT" ? "secondary" : "outline"} onClick={() => updateAttendance(student.id, "SAKIT")}>Sakit</Button>
                        <Button size="sm" variant={currentStatus === "IZIN" ? "outline" : "outline"} onClick={() => updateAttendance(student.id, "IZIN")}>Izin</Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={saveAttendance} disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Absensi"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
