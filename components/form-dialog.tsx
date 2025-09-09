"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface FormField {
  name: string
  label: string
  type: "text" | "email" | "tel" | "date" | "select" | "textarea"
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
}

interface FormDialogProps {
  title: string
  description: string
  fields: FormField[]
  onSubmit: (data: any) => Promise<void>
  triggerText: string
  submitText?: string
}

export function FormDialog({
  title,
  description,
  fields,
  onSubmit,
  triggerText,
  submitText = "Simpan",
}: FormDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit(formData)
      setOpen(false)
      setFormData({})
      toast({
        title: "Berhasil",
        description: "Data berhasil disimpan",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "select":
        return (
          <Select onValueChange={(value) => setFormData({ ...formData, [field.name]: value })}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || `Pilih ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={formData[field.name] || ""}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            required={field.required}
          />
        )
      default:
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name] || ""}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            required={field.required}
          />
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </Label>
              {renderField(field)}
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : submitText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
