"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReportGeneratorProps {
  students?: any[]
  classes?: any[]
  teachers?: any[]
}

export function ReportGenerator({ students = [], classes = [], teachers = [] }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportType, setReportType] = useState("")
  const [formData, setFormData] = useState<any>({})
  const { toast } = useToast()

  const reportTypes = [
    {
      id: "student-report-card",
      name: "Rapor Siswa",
      description: "Generate rapor siswa per semester",
      fields: ["studentId", "academicYear", "semester"],
    },
    {
      id: "class-list",
      name: "Daftar Siswa Kelas",
      description: "Daftar siswa dalam satu kelas",
      fields: ["classId", "academicYear"],
    },
    {
      id: "attendance",
      name: "Laporan Kehadiran",
      description: "Laporan kehadiran siswa per bulan",
      fields: ["studentId", "academicYear", "month"],
    },
    {
      id: "teacher-schedule",
      name: "Jadwal Guru",
      description: "Jadwal mengajar guru",
      fields: ["teacherId", "academicYear", "semester"],
    },
  ]

  const handleGenerateReport = async () => {
    if (!reportType) {
      toast({
        title: "Error",
        description: "Pilih jenis laporan terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch(`/api/reports/${reportType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate report")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `laporan-${reportType}-${new Date().toISOString().split("T")[0]}.docx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Laporan Berhasil Dibuat",
        description: "Laporan DOCX berhasil diunduh",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat laporan",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const renderFormFields = () => {
    const selectedReport = reportTypes.find((r) => r.id === reportType)
    if (!selectedReport) return null

    return (
      <div className="space-y-4">
        {selectedReport.fields.includes("studentId") && (
          <div>
            <Label htmlFor="studentId">Pilih Siswa</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, studentId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih siswa" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.full_name} ({student.student_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedReport.fields.includes("classId") && (
          <div>
            <Label htmlFor="classId">Pilih Kelas</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, classId: value })}>
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
        )}

        {selectedReport.fields.includes("teacherId") && (
          <div>
            <Label htmlFor="teacherId">Pilih Guru</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, teacherId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih guru" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.full_name} ({teacher.teacher_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedReport.fields.includes("academicYear") && (
          <div>
            <Label htmlFor="academicYear">Tahun Ajaran</Label>
            <Input
              id="academicYear"
              placeholder="2024/2025"
              value={formData.academicYear || ""}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
            />
          </div>
        )}

        {selectedReport.fields.includes("semester") && (
          <div>
            <Label htmlFor="semester">Semester</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, semester: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GANJIL">Ganjil</SelectItem>
                <SelectItem value="GENAP">Genap</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedReport.fields.includes("month") && (
          <div>
            <Label htmlFor="month">Bulan</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, month: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih bulan" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {new Date(2024, i).toLocaleDateString("id-ID", { month: "long" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((report) => (
          <Card
            key={report.id}
            className={`cursor-pointer transition-colors ${
              reportType === report.id ? "ring-2 ring-primary" : "hover:bg-accent"
            }`}
            onClick={() => setReportType(report.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <CardTitle className="text-sm">{report.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs">{report.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {reportType && (
        <Card>
          <CardHeader>
            <CardTitle>Parameter Laporan</CardTitle>
            <CardDescription>Isi parameter yang diperlukan untuk membuat laporan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderFormFields()}
            <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? "Membuat Laporan..." : "Generate Laporan DOCX"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
