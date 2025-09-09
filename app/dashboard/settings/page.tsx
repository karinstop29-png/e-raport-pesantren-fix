"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        setProfile({ ...profile, email: user.email })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
        })
        .eq("id", profile.id)

      if (error) throw error

      toast({
        title: "Profil Disimpan",
        description: "Profil berhasil diperbarui",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan profil",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola pengaturan akun dan sistem</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profil Pengguna</CardTitle>
            <CardDescription>Informasi dasar akun Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                value={profile?.full_name || ""}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profile?.email || ""} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Peran</Label>
              <Input id="role" value={profile?.role || ""} disabled />
            </div>
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Profil"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Sistem</CardTitle>
            <CardDescription>Konfigurasi sistem pesantren</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifikasi Email</Label>
                <p className="text-sm text-muted-foreground">Terima notifikasi melalui email</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Backup</Label>
                <p className="text-sm text-muted-foreground">Backup otomatis data harian</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mode Maintenance</Label>
                <p className="text-sm text-muted-foreground">Aktifkan mode pemeliharaan sistem</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Pesantren</CardTitle>
            <CardDescription>Data dasar pesantren</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="pesantrenName">Nama Pesantren</Label>
              <Input id="pesantrenName" placeholder="Pondok Pesantren Al-Hikmah" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Alamat</Label>
              <Textarea id="address" placeholder="Jl. Pendidikan No. 123, Jakarta" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input id="phone" placeholder="021-12345678" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Pesantren</Label>
              <Input id="email" placeholder="info@pesantren.com" />
            </div>
            <Button>Simpan Informasi</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keamanan</CardTitle>
            <CardDescription>Pengaturan keamanan akun</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">Ubah Password</Button>
            <Button variant="outline">Aktivitas Login</Button>
            <Button variant="destructive">Logout dari Semua Device</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
