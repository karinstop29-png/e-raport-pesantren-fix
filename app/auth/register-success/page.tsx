import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Pendaftaran Berhasil!</CardTitle>
              <CardDescription>Periksa email untuk konfirmasi</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Anda telah berhasil mendaftar. Silakan periksa email Anda untuk mengkonfirmasi akun sebelum masuk ke
                sistem.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
