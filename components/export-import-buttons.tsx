"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, FileSpreadsheet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExportImportButtonsProps {
  entityType: "students" | "teachers" | "grades"
  onImportComplete?: () => void
}

export function ExportImportButtons({ entityType, onImportComplete }: ExportImportButtonsProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/export/${entityType}`)
      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `data-${entityType}-${new Date().toISOString().split("T")[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Export Berhasil",
        description: "Data berhasil diekspor ke Excel",
      })
    } catch (error) {
      toast({
        title: "Export Gagal",
        description: "Terjadi kesalahan saat mengekspor data",
        variant: "destructive",
      })
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch(`/api/import/${entityType}/template`)
      if (!response.ok) throw new Error("Template download failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `template-import-${entityType}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Template Downloaded",
        description: "Template import berhasil diunduh",
      })
    } catch (error) {
      toast({
        title: "Download Gagal",
        description: "Terjadi kesalahan saat mengunduh template",
        variant: "destructive",
      })
    }
  }

  const handleImport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsImporting(true)
    setImportResult(null)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch(`/api/import/${entityType}`, {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      setImportResult(result)

      if (response.ok) {
        toast({
          title: "Import Selesai",
          description: result.message,
        })
        onImportComplete?.()
      } else {
        toast({
          title: "Import Gagal",
          description: result.error || "Terjadi kesalahan",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Import Gagal",
        description: "Terjadi kesalahan saat mengimpor data",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const entityLabels = {
    students: "Siswa",
    teachers: "Guru",
    grades: "Nilai",
  }

  return (
    <div className="flex gap-2">
      <Button onClick={handleExport} variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Export Excel
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Excel
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Data {entityLabels[entityType]}</DialogTitle>
            <DialogDescription>
              Upload file Excel untuk mengimpor data {entityLabels[entityType].toLowerCase()} secara massal
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button onClick={handleDownloadTemplate} variant="outline" size="sm" className="w-full bg-transparent">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>

            <form onSubmit={handleImport} className="space-y-4">
              <div>
                <Label htmlFor="file">Pilih File Excel</Label>
                <Input id="file" name="file" type="file" accept=".xlsx,.xls" required className="mt-1" />
              </div>

              <Button type="submit" disabled={isImporting} className="w-full">
                {isImporting ? "Mengimpor..." : "Import Data"}
              </Button>
            </form>

            {importResult && (
              <Alert>
                <AlertDescription>
                  {importResult.message}
                  {importResult.results?.errors?.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Error:</p>
                      <ul className="text-sm list-disc list-inside">
                        {importResult.results.errors.slice(0, 5).map((error: string, index: number) => (
                          <li key={index}>{error}</li>
                        ))}
                        {importResult.results.errors.length > 5 && (
                          <li>... dan {importResult.results.errors.length - 5} error lainnya</li>
                        )}
                      </ul>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
