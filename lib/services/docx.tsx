import Docxtemplater from "docxtemplater"
import PizZip from "pizzip"
import type { Student, Teacher, Class, GradeRecord, Attendance } from "@/lib/types/database"

export class DocxService {
  // Generate Student Report Card
  static async generateStudentReportCard(
    student: Student,
    grades: GradeRecord[],
    academicYear: string,
    semester: string,
  ): Promise<Buffer> {
    const template = this.getStudentReportTemplate()
    const zip = new PizZip(template)
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    })

    // Calculate statistics
    const totalScore = grades.reduce((sum, grade) => sum + grade.total_score, 0)
    const averageScore = grades.length > 0 ? totalScore / grades.length : 0
    const gradeDistribution = this.calculateGradeDistribution(grades)

    const data = {
      student_name: student.full_name,
      student_id: student.student_id,
      academic_year: academicYear,
      semester: semester === "GANJIL" ? "Ganjil" : "Genap",
      birth_date: new Date(student.birth_date).toLocaleDateString("id-ID"),
      birth_place: student.birth_place,
      address: student.address,
      parent_name: student.parent_name,
      parent_phone: student.parent_phone,
      grades: grades.map((grade) => ({
        subject_name: grade.subject?.name || "",
        assignment_score: grade.assignment_score,
        midterm_score: grade.midterm_score,
        final_score: grade.final_score,
        total_score: grade.total_score,
        grade: grade.grade || "",
      })),
      total_subjects: grades.length,
      average_score: averageScore.toFixed(2),
      grade_a: gradeDistribution.A,
      grade_b: gradeDistribution.B,
      grade_c: gradeDistribution.C,
      grade_d: gradeDistribution.D,
      grade_e: gradeDistribution.E,
      report_date: new Date().toLocaleDateString("id-ID"),
    }

    doc.render(data)
    return Buffer.from(doc.getZip().generate({ type: "nodebuffer" }))
  }

  // Generate Class List Report
  static async generateClassListReport(classData: Class, students: Student[]): Promise<Buffer> {
    const template = this.getClassListTemplate()
    const zip = new PizZip(template)
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    })

    const data = {
      class_name: classData.name,
      level: this.getLevelName(classData.level),
      academic_year: classData.academic_year,
      homeroom_teacher: classData.homeroom_teacher?.full_name || "-",
      total_students: students.length,
      max_students: classData.max_students,
      students: students.map((student, index) => ({
        no: index + 1,
        student_id: student.student_id,
        full_name: student.full_name,
        gender: student.gender === "MALE" ? "L" : "P",
        birth_date: new Date(student.birth_date).toLocaleDateString("id-ID"),
        parent_name: student.parent_name,
        parent_phone: student.parent_phone,
      })),
      report_date: new Date().toLocaleDateString("id-ID"),
    }

    doc.render(data)
    return Buffer.from(doc.getZip().generate({ type: "nodebuffer" }))
  }

  // Generate Attendance Report
  static async generateAttendanceReport(
    student: Student,
    attendance: Attendance[],
    academicYear: string,
    month: string,
  ): Promise<Buffer> {
    const template = this.getAttendanceTemplate()
    const zip = new PizZip(template)
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    })

    const attendanceStats = this.calculateAttendanceStats(attendance)

    const data = {
      student_name: student.full_name,
      student_id: student.student_id,
      academic_year: academicYear,
      month: month,
      total_days: attendance.length,
      present_days: attendanceStats.present,
      absent_days: attendanceStats.absent,
      sick_days: attendanceStats.sick,
      permission_days: attendanceStats.permission,
      attendance_percentage: attendanceStats.percentage.toFixed(1),
      attendance_records: attendance.map((record) => ({
        date: new Date(record.date).toLocaleDateString("id-ID"),
        subject: record.subject?.name || "",
        status: this.getAttendanceStatusName(record.status),
        notes: record.notes || "-",
      })),
      report_date: new Date().toLocaleDateString("id-ID"),
    }

    doc.render(data)
    return Buffer.from(doc.getZip().generate({ type: "nodebuffer" }))
  }

  // Generate Teacher Schedule Report
  static async generateTeacherScheduleReport(teacher: Teacher, schedules: any[]): Promise<Buffer> {
    const template = this.getTeacherScheduleTemplate()
    const zip = new PizZip(template)
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    })

    const groupedSchedules = this.groupSchedulesByDay(schedules)

    const data = {
      teacher_name: teacher.full_name,
      teacher_id: teacher.teacher_id,
      email: teacher.email,
      phone: teacher.phone,
      total_classes: schedules.length,
      schedule_monday: groupedSchedules[1] || [],
      schedule_tuesday: groupedSchedules[2] || [],
      schedule_wednesday: groupedSchedules[3] || [],
      schedule_thursday: groupedSchedules[4] || [],
      schedule_friday: groupedSchedules[5] || [],
      schedule_saturday: groupedSchedules[6] || [],
      schedule_sunday: groupedSchedules[7] || [],
      report_date: new Date().toLocaleDateString("id-ID"),
    }

    doc.render(data)
    return Buffer.from(doc.getZip().generate({ type: "nodebuffer" }))
  }

  // Helper methods
  private static calculateGradeDistribution(grades: GradeRecord[]) {
    const distribution = { A: 0, B: 0, C: 0, D: 0, E: 0 }
    grades.forEach((grade) => {
      if (grade.grade && distribution.hasOwnProperty(grade.grade)) {
        distribution[grade.grade as keyof typeof distribution]++
      }
    })
    return distribution
  }

  private static calculateAttendanceStats(attendance: Attendance[]) {
    const stats = { present: 0, absent: 0, sick: 0, permission: 0 }
    attendance.forEach((record) => {
      switch (record.status) {
        case "PRESENT":
          stats.present++
          break
        case "ABSENT":
          stats.absent++
          break
        case "SICK":
          stats.sick++
          break
        case "PERMISSION":
          stats.permission++
          break
      }
    })
    const percentage = attendance.length > 0 ? (stats.present / attendance.length) * 100 : 0
    return { ...stats, percentage }
  }

  private static groupSchedulesByDay(schedules: any[]) {
    const grouped: { [key: number]: any[] } = {}
    schedules.forEach((schedule) => {
      const day = schedule.day_of_week
      if (!grouped[day]) grouped[day] = []
      grouped[day].push({
        subject_name: schedule.subject?.name || "",
        class_name: schedule.class?.name || "",
        start_time: schedule.start_time,
        end_time: schedule.end_time,
      })
    })
    return grouped
  }

  private static getLevelName(level: string): string {
    const levelMap = {
      IBTIDAIYAH: "Ibtidaiyah",
      TSANAWIYAH: "Tsanawiyah",
      ALIYAH: "Aliyah",
    }
    return levelMap[level as keyof typeof levelMap] || level
  }

  private static getAttendanceStatusName(status: string): string {
    const statusMap = {
      PRESENT: "Hadir",
      ABSENT: "Tidak Hadir",
      SICK: "Sakit",
      PERMISSION: "Izin",
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  // Template generators (simplified - in real implementation, these would be actual DOCX templates)
  private static getStudentReportTemplate(): Buffer {
    // This is a simplified template. In real implementation, you would load actual DOCX templates
    const templateContent = `
      <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:body>
          <w:p><w:r><w:t>RAPOR SISWA</w:t></w:r></w:p>
          <w:p><w:r><w:t>Nama: {student_name}</w:t></w:r></w:p>
          <w:p><w:r><w:t>NIS: {student_id}</w:t></w:r></w:p>
          <w:p><w:r><w:t>Tahun Ajaran: {academic_year}</w:t></w:r></w:p>
          <w:p><w:r><w:t>Semester: {semester}</w:t></w:r></w:p>
          <w:p><w:r><w:t>Nilai:</w:t></w:r></w:p>
          {#grades}
          <w:p><w:r><w:t>{subject_name}: {total_score} ({grade})</w:t></w:r></w:p>
          {/grades}
          <w:p><w:r><w:t>Rata-rata: {average_score}</w:t></w:r></w:p>
        </w:body>
      </w:document>
    `
    return Buffer.from(templateContent)
  }

  private static getClassListTemplate(): Buffer {
    const templateContent = `
      <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:body>
          <w:p><w:r><w:t>DAFTAR SISWA KELAS</w:t></w:r></w:p>
          <w:p><w:r><w:t>Kelas: {class_name}</w:t></w:r></w:p>
          <w:p><w:r><w:t>Tingkat: {level}</w:t></w:r></w:p>
          <w:p><w:r><w:t>Wali Kelas: {homeroom_teacher}</w:t></w:r></w:p>
          <w:p><w:r><w:t>Jumlah Siswa: {total_students}/{max_students}</w:t></w:r></w:p>
          {#students}
          <w:p><w:r><w:t>{no}. {full_name} ({student_id}) - {gender}</w:t></w:r></w:p>
          {/students}
        </w:body>
      </w:document>
    `
    return Buffer.from(templateContent)
  }

  private static getAttendanceTemplate(): Buffer {
    const templateContent = `
      <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:body>
          <w:p><w:r><w:t>LAPORAN KEHADIRAN</w:t></w:r></w:p>
          <w:p><w:r><w:t>Nama: {student_name}</w:t></w:r></w:p>
          <w:p><w:r><w:t>NIS: {student_id}</w:t></w:r></w:p>
          <w:p><w:r><w:t>Bulan: {month} {academic_year}</w:t></w:r></w:p>
          <w:p><w:r><w:t>Persentase Kehadiran: {attendance_percentage}%</w:t></w:r></w:p>
          <w:p><w:r><w:t>Hadir: {present_days} hari</w:t></w:r></w:p>
          <w:p><w:r><w:t>Tidak Hadir: {absent_days} hari</w:t></w:r></w:p>
          <w:p><w:r><w:t>Sakit: {sick_days} hari</w:t></w:r></w:p>
          <w:p><w:r><w:t>Izin: {permission_days} hari</w:t></w:r></w:p>
        </w:body>
      </w:document>
    `
    return Buffer.from(templateContent)
  }

  private static getTeacherScheduleTemplate(): Buffer {
    const templateContent = `
      <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:body>
          <w:p><w:r><w:t>JADWAL MENGAJAR</w:t></w:r></w:p>
          <w:p><w:r><w:t>Nama Guru: {teacher_name}</w:t></w:r></w:p>
          <w:p><w:r><w:t>NIP: {teacher_id}</w:t></w:r></w:p>
          <w:p><w:r><w:t>Email: {email}</w:t></w:r></w:p>
          <w:p><w:r><w:t>Total Kelas: {total_classes}</w:t></w:r></w:p>
          <w:p><w:r><w:t>SENIN:</w:t></w:r></w:p>
          {#schedule_monday}
          <w:p><w:r><w:t>{start_time}-{end_time}: {subject_name} ({class_name})</w:t></w:r></w:p>
          {/schedule_monday}
        </w:body>
      </w:document>
    `
    return Buffer.from(templateContent)
  }
}
