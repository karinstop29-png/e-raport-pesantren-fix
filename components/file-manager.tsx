"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileUpload } from "./file-upload"
import { DataTable } from "./data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { File, Download, Trash2, Upload, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileRecord {
  id: string
  filename: string
  originalName: string
  filePath: string
  fileSize: number
  mimeType: string
  uploadedBy: string
  created_at: string
}

export function FileManager() {
  const [files, setFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const { toast } = useToast()

  const columns: ColumnDef<FileRecord>[] = [
    {
      accessorKey: "originalName",
      header: "File Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <File className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("originalName")}</span>
        </div>
      ),
    },
    {
      accessorKey: "mimeType",
      header: "Type",
      cell: ({ row }) => {
        const mimeType = row.getValue("mimeType") as string
        const typeLabel = mimeType.split("/")[1]?.toUpperCase() || "FILE"
        return <Badge variant="outline">{typeLabel}</Badge>
      },
    },
    {
      accessorKey: "fileSize",
      header: "Size",
      cell: ({ row }) => {
        const size = row.getValue("fileSize") as number
        return formatFileSize(size)
      },
    },
    {
      accessorKey: "created_at",
      header: "Uploaded",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return date.toLocaleDateString("id-ID")
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleDownload(row.original)}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/upload")
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files)
      }
    } catch (error) {
      console.error("Error fetching files:", error)
      toast({
        title: "Error",
        description: "Failed to fetch files",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (file: FileRecord) => {
    const link = document.createElement("a")
    link.href = `/${file.filePath}`
    link.download = file.originalName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    try {
      const response = await fetch(`/api/upload/${fileId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setFiles((prev) => prev.filter((file) => file.id !== fileId))
        toast({
          title: "File Deleted",
          description: "File has been deleted successfully",
        })
      } else {
        throw new Error("Failed to delete file")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      })
    }
  }

  const handleUploadComplete = (file: any) => {
    setFiles((prev) => [file, ...prev])
    setIsUploadDialogOpen(false)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const filteredFiles = files.filter((file) => file.originalName.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">File Manager</h2>
          <p className="text-muted-foreground">Manage your uploaded files</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Files</DialogTitle>
              <DialogDescription>Upload files to the system</DialogDescription>
            </DialogHeader>
            <FileUpload onUploadComplete={handleUploadComplete} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Files ({filteredFiles.length})</CardTitle>
          <CardDescription>All uploaded files in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <DataTable columns={columns} data={filteredFiles} />
        </CardContent>
      </Card>
    </div>
  )
}
