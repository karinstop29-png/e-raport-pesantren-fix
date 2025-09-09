import ExcelJS from "exceljs"
import type { Student, Teacher, GradeRecord } from "@/lib/types/database"

export class ExcelService {
  // Export Students to Excel
  static async exportStudents(students: Student[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Data Siswa")

    // Define columns
    worksheet.columns = [
      { header: "ID Siswa", key: "student_id", width: 15 },
      { header: "Nama Lengkap", key: "full_name", width: 25 },
      { header: "Jenis Kelamin", key: "gender", width: 15 },
      { header: "Tanggal Lahir", key: "birth_date", width: 15 },
      { header: "Tempat Lahir", key: "birth_place", width: 20 },
      { header: "Alamat", key: "address", width: 30 },
      { header: "Telepon", key: "phone", width: 15 },
      { header: "Nama Orang Tua", key: "parent_name", width: 25 },
      { header: "Telepon Orang Tua", key: "parent_phone", width: 15 },
      { header: "Tanggal Masuk", key: "enrollment_date", width: 15 },
      { header: "Status", key: "is_active", width: 10 },
    ]

    // Style header
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE6F3FF" },
    }

    // Add data
    students.forEach((student) => {
      worksheet.addRow({
        student_id: student.student_id,
        full_name: student.full_name,
        gender: student.gender === "MALE" ? "Laki-laki" : "Perempuan",
        birth_date: new Date(student.birth_date).toLocaleDateString("id-ID"),
        birth_place: student.birth_place,
        address: student.address,
        phone: student.phone || "",
        parent_name: student.parent_name,
        parent_phone: student.parent_phone,
        enrollment_date: new Date(student.enrollment_date).toLocaleDateString("id-ID"),
        is_active: student.is_active ? "Aktif" : "Tidak Aktif",
      })
    })

    return Buffer.from(await workbook.xlsx.writeBuffer())
  }

  // Export Teachers to Excel
  static async exportTeachers(teachers: Teacher[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Data Guru")

    worksheet.columns = [
      { header: "ID Guru", key: "teacher_id", width: 15 },
      { header: "Nama Lengkap", key: "full_name", width: 25 },
      { header: "Jenis Kelamin", key: "gender", width: 15 },
      { header: "Tanggal Lahir", key: "birth_date", width: 15 },
      { header: "Tempat Lahir", key: "birth_place", width: 20 },
      { header: "Alamat", key: "address", width: 30 },
      { header: "Telepon", key: "phone", width: 15 },
      { header: "Email", key: "email", width: 25 },
      { header: "Tanggal Bergabung", key: "hire_date", width: 15 },
      { header: "Status", key: "is_active", width: 10 },
    ]

    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE6F3FF" },
    }

    teachers.forEach((teacher) => {
      worksheet.addRow({
        teacher_id: teacher.teacher_id,
        full_name: teacher.full_name,
        gender: teacher.gender === "MALE" ? "Laki-laki" : "Perempuan",
        birth_date: new Date(teacher.birth_date).toLocaleDateString("id-ID"),
        birth_place: teacher.birth_place,
        address: teacher.address,
        phone: teacher.phone,
        email: teacher.email,
        hire_date: new Date(teacher.hire_date).toLocaleDateString("id-ID"),
        is_active: teacher.is_active ? "Aktif" : "Tidak Aktif",
      })
    })

    return Buffer.from(await workbook.xlsx.writeBuffer())
  }

  // Export Grades to Excel
  static async exportGrades(grades: GradeRecord[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Data Nilai")

    worksheet.columns = [
      { header: "Nama Siswa", key: "student_name", width: 25 },
      { header: "Mata Pelajaran", key: "subject_name", width: 20 },
      { header: "Guru", key: "teacher_name", width: 25 },
      { header: "Tahun Ajaran", key: "academic_year", width: 15 },
      { header: "Semester", key: "semester", width: 10 },
      { header: "Nilai Tugas", key: "assignment_score", width: 12 },
      { header: "Nilai UTS", key: "midterm_score", width: 12 },
      { header: "Nilai UAS", key: "final_score", width: 12 },
      { header: "Nilai Total", key: "total_score", width: 12 },
      { header: "Grade", key: "grade", width: 8 },
    ]

    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE6F3FF" },
    }

    grades.forEach((grade) => {
      worksheet.addRow({
        student_name: grade.student?.full_name || "",
        subject_name: grade.subject?.name || "",
        teacher_name: grade.teacher?.full_name || "",
        academic_year: grade.academic_year,
        semester: grade.semester,
        assignment_score: grade.assignment_score,
        midterm_score: grade.midterm_score,
        final_score: grade.final_score,
        total_score: grade.total_score,
        grade: grade.grade || "",
      })
    })

    return Buffer.from(await workbook.xlsx.writeBuffer())
  }

  // Generate Student Import Template
  static async generateStudentTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Template Import Siswa")

    worksheet.columns = [
      { header: "ID Siswa*", key: "student_id", width: 15 },
      { header: "Nama Lengkap*", key: "full_name", width: 25 },
      { header: "Jenis Kelamin*", key: "gender", width: 15 },
      { header: "Tanggal Lahir*", key: "birth_date", width: 15 },
      { header: "Tempat Lahir*", key: "birth_place", width: 20 },
      { header: "Alamat*", key: "address", width: 30 },
      { header: "Telepon", key: "phone", width: 15 },
      { header: "Nama Orang Tua*", key: "parent_name", width: 25 },
      { header: "Telepon Orang Tua*", key: "parent_phone", width: 15 },
      { header: "Tanggal Masuk*", key: "enrollment_date", width: 15 },
    ]

    // Style header
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE6F3FF" },
    }

    // Add sample data
    worksheet.addRow({
      student_id: "S001",
      full_name: "Ahmad Fauzi",
      gender: "Laki-laki",
      birth_date: "01/01/2005",
      birth_place: "Jakarta",
      address: "Jl. Contoh No. 123",
      phone: "081234567890",
      parent_name: "Budi Santoso",
      parent_phone: "081234567891",
      enrollment_date: "01/07/2024",
    })

    // Add instructions
    const instructionSheet = workbook.addWorksheet("Petunjuk")
    instructionSheet.addRow(["PETUNJUK IMPORT DATA SISWA"])
    instructionSheet.addRow([])
    instructionSheet.addRow(["1. Kolom dengan tanda (*) wajib diisi"])
    instructionSheet.addRow(["2. Format tanggal: DD/MM/YYYY"])
    instructionSheet.addRow(["3. Jenis Kelamin: Laki-laki atau Perempuan"])
    instructionSheet.addRow(["4. ID Siswa harus unik"])
    instructionSheet.addRow(["5. Hapus baris contoh sebelum import"])

    instructionSheet.getRow(1).font = { bold: true, size: 14 }

    return Buffer.from(await workbook.xlsx.writeBuffer())
  }

  // Parse imported student data
  static async parseStudentImport(buffer: Buffer): Promise<Partial<Student>[]> {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)

    const worksheet = workbook.getWorksheet(1)
    if (!worksheet) throw new Error("Worksheet tidak ditemukan")

    const students: Partial<Student>[] = []
    const headerRow = worksheet.getRow(1)

    // Skip header row, start from row 2
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return // Skip header

      const student: Partial<Student> = {
        student_id: row.getCell(1).text,
        full_name: row.getCell(2).text,
        gender: row.getCell(3).text === "Laki-laki" ? "MALE" : "FEMALE",
        birth_date: this.parseDate(row.getCell(4).text),
        birth_place: row.getCell(5).text,
        address: row.getCell(6).text,
        phone: row.getCell(7).text || undefined,
        parent_name: row.getCell(8).text,
        parent_phone: row.getCell(9).text,
        enrollment_date: this.parseDate(row.getCell(10).text),
        is_active: true,
      }

      // Validate required fields
      if (
        student.student_id &&
        student.full_name &&
        student.gender &&
        student.birth_date &&
        student.birth_place &&
        student.address &&
        student.parent_name &&
        student.parent_phone &&
        student.enrollment_date
      ) {
        students.push(student)
      }
    })

    return students
  }

  private static parseDate(dateString: string): string {
    try {
      // Handle DD/MM/YYYY format
      const parts = dateString.split("/")
      if (parts.length === 3) {
        const day = parts[0].padStart(2, "0")
        const month = parts[1].padStart(2, "0")
        const year = parts[2]
        return `${year}-${month}-${day}`
      }
      return dateString
    } catch {
      return dateString
    }
  }
}
