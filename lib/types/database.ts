export type UserRole = "ADMIN" | "TEACHER" | "STUDENT"
export type Gender = "MALE" | "FEMALE"
export type ClassLevel = "IBTIDAIYAH" | "TSANAWIYAH" | "ALIYAH"
export type Semester = "GANJIL" | "GENAP"
export type Grade = "A" | "B" | "C" | "D" | "E"
export type AttendanceStatus = "PRESENT" | "ABSENT" | "SICK" | "PERMISSION"

export interface Profile {
  id: string
  full_name: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  user_id?: string
  student_id: string
  full_name: string
  gender: Gender
  birth_date: string
  birth_place: string
  address: string
  phone?: string
  parent_name: string
  parent_phone: string
  enrollment_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Teacher {
  id: string
  user_id?: string
  teacher_id: string
  full_name: string
  gender: Gender
  birth_date: string
  birth_place: string
  address: string
  phone: string
  email: string
  hire_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  code: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  name: string
  level: ClassLevel
  academic_year: string
  homeroom_teacher_id?: string
  max_students: number
  is_active: boolean
  created_at: string
  updated_at: string
  homeroom_teacher?: Teacher
}

export interface ClassStudent {
  id: string
  class_id: string
  student_id: string
  academic_year: string
  created_at: string
  student?: Student
  class?: Class
}

export interface Dormitory {
  id: string
  name: string
  gender: Gender
  capacity: number
  supervisor_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
  supervisor?: Teacher
}

export interface DormitoryStudent {
  id: string
  dormitory_id: string
  student_id: string
  academic_year: string
  room_number?: string
  created_at: string
  student?: Student
  dormitory?: Dormitory
}

export interface Schedule {
  id: string
  class_id: string
  subject_id: string
  teacher_id: string
  day_of_week: number
  start_time: string
  end_time: string
  academic_year: string
  semester: Semester
  is_active: boolean
  created_at: string
  updated_at: string
  class?: Class
  subject?: Subject
  teacher?: Teacher
}

export interface GradeRecord {
  id: string
  student_id: string
  subject_id: string
  teacher_id: string
  academic_year: string
  semester: Semester
  assignment_score: number
  midterm_score: number
  final_score: number
  total_score: number
  grade?: Grade
  created_at: string
  updated_at: string
  student?: Student
  subject?: Subject
  teacher?: Teacher
}

export interface Attendance {
  id: string
  student_id: string
  subject_id: string
  teacher_id: string
  date: string
  status: AttendanceStatus
  notes?: string
  created_at: string
  updated_at: string
  student?: Student
  subject?: Subject
  teacher?: Teacher
}

export interface AcademicYear {
  id: string
  year: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  author_id: string
  target_audience: string[]
  is_published: boolean
  published_at?: string
  created_at: string
  updated_at: string
  author?: Profile
}
