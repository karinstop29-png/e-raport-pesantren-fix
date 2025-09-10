"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Home,
  Building,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  FileText,
  FolderOpen,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

// PERBAIKAN: Semua nilai 'href' telah disesuaikan
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Siswa",
    href: "/dashboard/siswas", // Diperbarui
    icon: Users,
  },
  {
    name: "Guru",
    href: "/dashboard/gurus", // Diperbarui
    icon: GraduationCap,
  },
  {
    name: "Kelas",
    href: "/dashboard/kelas", // Diperbarui
    icon: BookOpen,
  },
  {
    name: "Mata Pelajaran",
    href: "/dashboard/matapelajarans", // Diperbarui
    icon: ClipboardList,
  },
  {
    name: "Asrama",
    href: "/dashboard/kamars", // Diperbarui
    icon: Building,
  },
  {
    name: "Jadwal",
    href: "/dashboard/jadwals", // Diperbarui (untuk masa depan)
    icon: Calendar,
  },
  {
    name: "Absensi",
    href: "/dashboard/attendance", // Tetap sama, sesuaikan jika Anda mengubah folder ini
    icon: Users,
  },
  {
    name: "Nilai",
    href: "/dashboard/grades", // Diperbarui
    icon: BarChart3,
  },
  {
    name: "File Manager",
    href: "/dashboard/files",
    icon: FolderOpen,
  },
  {
    name: "Laporan",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    name: "Pengaturan",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <nav className="flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Pesantren Management</h2>
      </div>

      <div className="flex-1 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href) // Menggunakan startsWith untuk sub-halaman
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </nav>
  )
}