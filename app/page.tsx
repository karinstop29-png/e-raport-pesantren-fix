import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sistem Manajemen Pesantren</h1>
          <p className="text-xl text-gray-600 mb-8">
            Solusi lengkap untuk mengelola administrasi dan akademik pesantren modern
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/login">Masuk</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/register">Daftar</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Siswa</CardTitle>
              <CardDescription>Kelola data siswa, kelas, dan asrama dengan mudah</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Pendaftaran siswa baru</li>
                <li>• Pengelompokan kelas</li>
                <li>• Penempatan asrama</li>
                <li>• Riwayat akademik</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sistem Akademik</CardTitle>
              <CardDescription>Jadwal, nilai, dan absensi terintegrasi</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Penjadwalan otomatis</li>
                <li>• Input nilai digital</li>
                <li>• Absensi real-time</li>
                <li>• Laporan akademik</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Laporan & Export</CardTitle>
              <CardDescription>Generate laporan dalam berbagai format</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Export Excel</li>
                <li>• Laporan DOCX</li>
                <li>• Import data massal</li>
                <li>• Backup otomatis</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
