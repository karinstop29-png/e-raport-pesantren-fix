import { createClient } from "@/lib/supabase/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export interface FileUploadResult {
  id: string
  filename: string
  originalName: string
  filePath: string
  fileSize: number
  mimeType: string
  uploadedBy: string
}

export class FileUploadService {
  private static readonly UPLOAD_DIR = join(process.cwd(), "public", "uploads")
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  private static readonly ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
  ]

  static async uploadFile(file: File, uploadedBy: string): Promise<FileUploadResult> {
    // Validate file
    this.validateFile(file)

    // Generate unique filename
    const fileExtension = file.name.split(".").pop()
    const uniqueFilename = `${uuidv4()}.${fileExtension}`
    const filePath = join("uploads", uniqueFilename)
    const fullPath = join(this.UPLOAD_DIR, uniqueFilename)

    // Ensure upload directory exists
    await mkdir(this.UPLOAD_DIR, { recursive: true })

    // Save file to disk
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(fullPath, buffer)

    // Save file info to database
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("file_uploads")
      .insert({
        filename: uniqueFilename,
        original_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: uploadedBy,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return {
      id: data.id,
      filename: data.filename,
      originalName: data.original_name,
      filePath: data.file_path,
      fileSize: data.file_size,
      mimeType: data.mime_type,
      uploadedBy: data.uploaded_by,
    }
  }

  static async getFiles(uploadedBy?: string): Promise<FileUploadResult[]> {
    const supabase = await createClient()
    let query = supabase.from("file_uploads").select("*").order("created_at", { ascending: false })

    if (uploadedBy) {
      query = query.eq("uploaded_by", uploadedBy)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return data.map((file) => ({
      id: file.id,
      filename: file.filename,
      originalName: file.original_name,
      filePath: file.file_path,
      fileSize: file.file_size,
      mimeType: file.mime_type,
      uploadedBy: file.uploaded_by,
    }))
  }

  static async deleteFile(fileId: string, userId: string): Promise<void> {
    const supabase = await createClient()

    // Get file info
    const { data: file, error: fetchError } = await supabase.from("file_uploads").select("*").eq("id", fileId).single()

    if (fetchError || !file) {
      throw new Error("File not found")
    }

    // Check if user owns the file or is admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single()

    if (file.uploaded_by !== userId && profile?.role !== "ADMIN") {
      throw new Error("Unauthorized to delete this file")
    }

    // Delete from database
    const { error: deleteError } = await supabase.from("file_uploads").delete().eq("id", fileId)

    if (deleteError) {
      throw new Error(`Database error: ${deleteError.message}`)
    }

    // TODO: Delete physical file from disk
    // In production, you might want to use a background job for this
  }

  private static validateFile(file: File): void {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum limit of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`)
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`)
    }

    // Additional security checks
    if (file.name.includes("..") || file.name.includes("/") || file.name.includes("\\")) {
      throw new Error("Invalid file name")
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  static getFileIcon(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "🖼️"
    if (mimeType === "application/pdf") return "📄"
    if (mimeType.includes("word")) return "📝"
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "📊"
    if (mimeType.startsWith("text/")) return "📄"
    return "📎"
  }
}
