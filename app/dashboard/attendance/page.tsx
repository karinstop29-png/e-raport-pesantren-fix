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

interface Student {
  id: string
  full_name: string
  student_id: string
}

interface Class {
  id: string
  name: string
  level: string
}

interface Subject {
  id: string
  name: string
}

interface AttendanceRecord {
  id?: string
  student_id: string
  class_id: string
  subject_id: string
  teacher_id: string
  date: string
  status: "PRESENT" | "ABSENT" | "SICK" | "PERMISSION"
  notes?: string
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({})
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

  useEffect(() => {
    if (selectedClass && selectedSubject && selectedDate) {
      fetchAttendance()
    }
  }, [selectedClass, selectedSubject, selectedDate])

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/classes")
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error("Error fetching classes:", error)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/subjects")
      const data = await response.json()
      setSubjects(data)
    } catch (error) {
      console.error("Error fetching subjects:", error)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch(`/api/students?class_id=${selectedClass}`)
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const fetchAttendance = async () => {
    try {
      const response = await fetch(
        `/api/attendance?date=${selectedDate}&class_id=${selectedClass}&subject_id=${selectedSubject}`,
      )
      const data = await response.json()

      const attendanceMap: Record<string, AttendanceRecord> = {}
      data.forEach((record: any) => {
        attendanceMap[record.student_id] = record
      })
      setAttendance(attendanceMap)
    } catch (error) {
      console.error("Error fetching attendance:", error)
    }
  }

  const updateAttendance = (studentId: string, status: AttendanceRecord["status"], notes?: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        student_id: studentId,
        class_id: selectedClass,
        subject_id: selectedSubject,
        teacher_id: "", // Will be set from user session
        date: selectedDate,
        status,
        notes,
      },
    }))
  }

  const saveAttendance = async () => {
    setLoading(true)
    try {
      const attendanceRecords = Object.values(attendance).filter((record) => record.status)

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendanceRecords }),
      })

      if (response.ok) {
        alert("Absensi berhasil disimpan!")
        fetchAttendance()
      }
    } catch (error) {
      console.error("Error saving attendance:", error)
      alert("Gagal menyimpan absensi")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: AttendanceRecord["status"]) => {
    const variants = {
      PRESENT: { variant: "default" as const, icon: CheckCircle, text: "Hadir" },
      ABSENT: { variant: "destructive" as const, icon: XCircle, text: "Tidak Hadir" },
      SICK: { variant: "secondary" as const, icon: AlertCircle, text: "Sakit" },
      PERMISSION: { variant: "outline" as const, icon: Clock, text: "Izin" },
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
      present: records.filter((r) => r.status === "PRESENT").length,
      absent: records.filter((r) => r.status === "ABSENT").length,
      sick: records.filter((r) => r.status === "SICK").length,
      permission: records.filter((r) => r.status === "PERMISSION").length,
      total: students.length,
    }
  }

  const stats = getAttendanceStats()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Absensi Siswa</h1>
          <p className="text-muted-foreground">Kelola kehadiran siswa harian</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filter Absensi
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
                    {cls.name} - {cls.level}
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
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {selectedClass && selectedSubject && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Hadir</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Tidak Hadir</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Sakit</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{stats.sick}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Izin</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.permission}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attendance List */}
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
                return (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{student.full_name}</p>
                      <p className="text-sm text-muted-foreground">NIS: {student.student_id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {record?.status && getStatusBadge(record.status)}
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant={record?.status === "PRESENT" ? "default" : "outline"}
                          onClick={() => updateAttendance(student.id, "PRESENT")}
                        >
                          Hadir
                        </Button>
                        <Button
                          size="sm"
                          variant={record?.status === "ABSENT" ? "destructive" : "outline"}
                          onClick={() => updateAttendance(student.id, "ABSENT")}
                        >
                          Tidak Hadir
                        </Button>
                        <Button
                          size="sm"
                          variant={record?.status === "SICK" ? "secondary" : "outline"}
                          onClick={() => updateAttendance(student.id, "SICK")}
                        >
                          Sakit
                        </Button>
                        <Button
                          size="sm"
                          variant={record?.status === "PERMISSION" ? "outline" : "outline"}
                          onClick={() => updateAttendance(student.id, "PERMISSION")}
                        >
                          Izin
                        </Button>
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
