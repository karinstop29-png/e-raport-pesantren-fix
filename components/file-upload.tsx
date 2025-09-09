"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, File, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  onUploadComplete?: (file: any) => void
  maxFiles?: number
  acceptedFileTypes?: string[]
}

export function FileUpload({ onUploadComplete, maxFiles = 5, acceptedFileTypes }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`)
        return
      }

      setUploading(true)
      setError(null)
      setUploadProgress(0)

      try {
        for (let i = 0; i < acceptedFiles.length; i++) {
          const file = acceptedFiles[i]
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Upload failed")
          }

          const result = await response.json()
          setUploadedFiles((prev) => [...prev, result.file])
          onUploadComplete?.(result.file)

          setUploadProgress(((i + 1) / acceptedFiles.length) * 100)
        }

        toast({
          title: "Upload Berhasil",
          description: `${acceptedFiles.length} file berhasil diupload`,
        })
      } catch (error) {
        setError(error instanceof Error ? error.message : "Upload failed")
        toast({
          title: "Upload Gagal",
          description: error instanceof Error ? error.message : "Upload failed",
          variant: "destructive",
        })
      } finally {
        setUploading(false)
        setUploadProgress(0)
      }
    },
    [uploadedFiles.length, maxFiles, onUploadComplete, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes
      ? acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {})
      : {
          "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
          "application/pdf": [".pdf"],
          "application/msword": [".doc"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
          "application/vnd.ms-excel": [".xls"],
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
          "text/plain": [".txt"],
          "text/csv": [".csv"],
        },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading,
  })

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            Drag and drop files here, or click to select files. Maximum {maxFiles} files, 10MB each.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : uploading
                  ? "border-muted-foreground/25 bg-muted/25 cursor-not-allowed"
                  : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg">Drop the files here...</p>
            ) : uploading ? (
              <div className="space-y-2">
                <p className="text-lg">Uploading...</p>
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
              </div>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
                <p className="text-sm text-muted-foreground">Supported: Images, PDF, Word, Excel, Text files</p>
              </div>
            )}
          </div>

          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>{uploadedFiles.length} files uploaded</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <File className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{file.originalName}</p>
                      <p className="text-sm text-muted-foreground">{(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
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
