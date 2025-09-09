import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, Building } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get basic statistics
  const [studentsCount, teachersCount, classesCount, subjectsCount] = await Promise.all([
    supabase.from("students").select("id", { count: "exact" }),
    supabase.from("teachers").select("id", { count: "exact" }),
    supabase.from("classes").select("id", { count: "exact" }),
    supabase.from("subjects").select("id", { count: "exact" }),
  ])

  const { data: recentAttendance } = await supabase
    .from("attendance")
    .select(`
      *,
      student:students(full_name),
      subject:subjects(name)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  const today = new Date().toISOString().split("T")[0]
  const { data: todayAttendance } = await supabase.from("attendance").select("status").eq("date", today)

  const attendanceStats =
    todayAttendance?.reduce(
      (acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ) || {}

  const stats = [
    {
      title: "Total Siswa",
      value: studentsCount.count || 0,
      icon: Users,
      description: "Siswa terdaftar",
    },
    {
      title: "Total Guru",
      value: teachersCount.count || 0,
      icon: GraduationCap,
      description: "Guru aktif",
    },
    {
      title: "Total Kelas",
      value: classesCount.count || 0,
      icon: BookOpen,
      description: "Kelas tersedia",
    },
    {
      title: "Mata Pelajaran",
      value: subjectsCount.count || 0,
      icon: Building,
      description: "Mata pelajaran",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Selamat datang, {profile?.full_name || data.user.email}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profil Pengguna</CardTitle>
            <CardDescription>Informasi akun Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Nama:</strong> {profile?.full_name}
              </p>
              <p>
                <strong>Email:</strong> {data.user.email}
              </p>
              <p>
                <strong>Peran:</strong> {profile?.role}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Absensi Hari Ini</CardTitle>
            <CardDescription>Ringkasan kehadiran siswa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-green-600">✅ Hadir:</span> {attendanceStats.PRESENT || 0}
              </p>
              <p className="text-sm">
                <span className="text-red-600">❌ Tidak Hadir:</span> {attendanceStats.ABSENT || 0}
              </p>
              <p className="text-sm">
                <span className="text-yellow-600">🤒 Sakit:</span> {attendanceStats.SICK || 0}
              </p>
              <p className="text-sm">
                <span className="text-blue-600">📝 Izin:</span> {attendanceStats.PERMISSION || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {recentAttendance && recentAttendance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Absensi yang baru saja dicatat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAttendance.map((record: any) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{record.student?.full_name}</p>
                    <p className="text-sm text-muted-foreground">{record.subject?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {record.status === "PRESENT"
                        ? "✅ Hadir"
                        : record.status === "ABSENT"
                          ? "❌ Tidak Hadir"
                          : record.status === "SICK"
                            ? "🤒 Sakit"
                            : "📝 Izin"}
                    </p>
                    <p className="text-xs text-muted-foreground">{record.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
