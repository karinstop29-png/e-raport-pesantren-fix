import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, Building } from "lucide-react"

// Helper function to determine status from a Kehadiran record
const getStatusFromKehadiran = (record: { sakit: number; izin: number; absen: number; }) => {
  if (record.sakit > 0) return "🤒 Sakit"
  if (record.izin > 0) return "📝 Izin"
  if (record.absen > 0) return "❌ Tidak Hadir"
  return "Catatan Kehadiran" // Default netral jika data tidak valid
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile (assuming 'profiles' table with 'full_name' still exists from old schema/triggers)
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Mengambil data dari tabel yang benar sesuai schema.prisma
  const [studentsCount, teachersCount, classesCount, subjectsCount] = await Promise.all([
    supabase.from("siswas").select("id", { count: "exact" }),
    supabase.from("gurus").select("id", { count: "exact" }),
    supabase.from("kelas").select("id", { count: "exact" }),
    supabase.from("matapelajarans").select("id", { count: "exact" }),
  ])

  // Query ke 'kehadirans' dan relasi yang benar
  const { data: recentAttendance } = await supabase
    .from("kehadirans")
    .select(`
      *,
      siswa:siswas(nama),
      mapel:matapelajarans(nama_mapel)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  // Menghitung total absensi semester, karena schema tidak mendukung harian
  const { data: semesterAttendance } = await supabase.from("kehadirans").select("sakit, izin, absen")

  // PERBAIKAN: Menghapus logika 'hadir'
  const attendanceStats =
    semesterAttendance?.reduce(
      (acc, record) => {
        acc.sakit += record.sakit || 0
        acc.izin += record.izin || 0
        acc.absen += record.absen || 0
        return acc
      },
      { sakit: 0, izin: 0, absen: 0 }, // 'hadir' telah dihapus
    ) || { sakit: 0, izin: 0, absen: 0 }


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
          {/* Menggunakan profile.full_name, asumsi tabel ini tidak dikelola Prisma */}
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
              <p><strong>Nama:</strong> {profile?.full_name}</p>
              <p><strong>Email:</strong> {data.user.email}</p>
              <p><strong>Peran:</strong> {profile?.role}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Ketidakhadiran Semester Ini</CardTitle>
            <CardDescription>Ringkasan total absensi siswa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* PERBAIKAN: Baris 'Hadir' telah dihapus */}
              <p className="text-sm"><span className="text-red-600">❌ Tidak Hadir:</span> {attendanceStats.absen}</p>
              <p className="text-sm"><span className="text-yellow-600">🤒 Sakit:</span> {attendanceStats.sakit}</p>
              <p className="text-sm"><span className="text-blue-600">📝 Izin:</span> {attendanceStats.izin}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {recentAttendance && recentAttendance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Kehadiran Terbaru</CardTitle>
            <CardDescription>Catatan kehadiran yang baru saja ditambahkan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAttendance.map((record: any) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{record.siswa?.nama}</p>
                    <p className="text-sm text-muted-foreground">{record.mapel?.nama_mapel}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{getStatusFromKehadiran(record)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(record.created_at).toLocaleDateString("id-ID")}</p>
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

