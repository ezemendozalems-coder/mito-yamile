"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, X, CheckCircle2, AlertCircle, Loader2, ImageIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface QueuedFile {
  file: File
  preview: string
  status: "pending" | "uploading" | "done" | "error"
  error?: string
}

export function ImageUploader({ onUploaded }: { onUploaded?: () => void }) {
  const [queue, setQueue] = useState<QueuedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((fileList: FileList | File[]) => {
    const valid = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    const next: QueuedFile[] = Array.from(fileList)
      .filter((f) => valid.includes(f.type))
      .map((f) => ({ file: f, preview: URL.createObjectURL(f), status: "pending" as const }))
    setQueue((prev) => [...prev, ...next])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
  }, [addFiles])

  const remove = (idx: number) => {
    setQueue((prev) => {
      URL.revokeObjectURL(prev[idx].preview)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const clearAll = () => {
    queue.forEach((q) => URL.revokeObjectURL(q.preview))
    setQueue([])
  }

  const uploadAll = async () => {
    if (!queue.some((q) => q.status === "pending")) return
    setIsUploading(true)
    const supabase = createClient()

    for (let i = 0; i < queue.length; i++) {
      if (queue[i].status !== "pending") continue
      setQueue((prev) => prev.map((q, idx) => idx === i ? { ...q, status: "uploading" as const } : q))

      try {
        const f = queue[i].file
        const ext = f.name.split(".").pop()?.toLowerCase() || "jpg"
        const storagePath = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: upErr } = await supabase.storage
          .from("product-images")
          .upload(storagePath, f, { cacheControl: "3600", upsert: false })
        if (upErr) throw upErr

        const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(storagePath)

        const { error: insErr } = await supabase.from("product_images").insert({
          product_code: null,
          image_url: publicUrl,
          storage_path: storagePath,
          original_name: f.name,
          is_main: false,
          sort_order: 0,
        })
        if (insErr) throw insErr

        setQueue((prev) => prev.map((q, idx) => idx === i ? { ...q, status: "done" as const } : q))
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error desconocido"
        setQueue((prev) => prev.map((q, idx) => idx === i ? { ...q, status: "error" as const, error: msg } : q))
      }
    }

    setIsUploading(false)
    onUploaded?.()
  }

  const pendingCount = queue.filter((q) => q.status === "pending").length
  const doneCount    = queue.filter((q) => q.status === "done").length
  const errorCount   = queue.filter((q) => q.status === "error").length

  return (
    <div className="space-y-6">

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer select-none flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all ${
          isDragging ? "border-[#1EA7E1] bg-[#E6F6FD]" : "border-border hover:border-[#1EA7E1]/50 hover:bg-secondary/40"
        }`}
      >
        <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
          isDragging ? "bg-[#1EA7E1]/20" : "bg-secondary"
        }`}>
          <Upload className={`h-7 w-7 ${isDragging ? "text-[#1EA7E1]" : "text-muted-foreground"}`} />
        </div>
        <p className="mb-1 text-base font-semibold">
          {isDragging ? "Soltá las imagenes aqui" : "Arrastra imagenes aqui"}
        </p>
        <p className="mb-4 text-sm text-muted-foreground">o hace clic para seleccionar</p>
        <p className="rounded-lg bg-secondary px-4 py-2 text-xs text-muted-foreground">
          JPG, PNG, WEBP — cualquier nombre de archivo
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = "" }}
        />
      </div>

      {/* Note */}
      {queue.length > 0 && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Las imagenes se suben <strong>sin asignar</strong>. Despues podes asignarlas a productos desde la pestana <strong>Gestionar</strong>.
        </p>
      )}

      {/* Queue stats + actions */}
      {queue.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{queue.length}</span> archivos
              </span>
              {doneCount > 0 && <span className="font-medium text-[#22c55e]">{doneCount} subidos</span>}
              {errorCount > 0 && <span className="font-medium text-destructive">{errorCount} con error</span>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearAll} disabled={isUploading} className="bg-transparent text-xs">
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />Limpiar todo
              </Button>
              <Button
                size="sm"
                onClick={uploadAll}
                disabled={isUploading || pendingCount === 0}
                className="bg-[#1EA7E1] text-xs text-white hover:bg-[#1794c7]"
              >
                {isUploading
                  ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Subiendo...</>
                  : <><Upload className="mr-1.5 h-3.5 w-3.5" />Subir {pendingCount} imagen{pendingCount !== 1 ? "es" : ""}</>
                }
              </Button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {queue.map((q, idx) => (
              <div
                key={idx}
                className={`group relative overflow-hidden rounded-xl border transition-all ${
                  q.status === "done"      ? "border-[#22c55e]/50 bg-[#22c55e]/5"
                  : q.status === "error"    ? "border-destructive/50 bg-destructive/5"
                  : q.status === "uploading"? "border-[#1EA7E1]/50 bg-[#E6F6FD]"
                  : "border-border bg-card"
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <img src={q.preview} alt={q.file.name} className="h-full w-full object-cover" />
                  {q.status === "uploading" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                      <Loader2 className="h-8 w-8 animate-spin text-[#1EA7E1]" />
                    </div>
                  )}
                  {q.status === "done" && (
                    <div className="absolute bottom-1.5 right-1.5">
                      <CheckCircle2 className="h-5 w-5 text-[#22c55e] drop-shadow" />
                    </div>
                  )}
                  {q.status === "error" && (
                    <div className="absolute bottom-1.5 right-1.5">
                      <AlertCircle className="h-5 w-5 text-destructive drop-shadow" />
                    </div>
                  )}
                  {q.status !== "uploading" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(idx) }}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <div className="p-2">
                  <p className="truncate text-[11px] text-muted-foreground" title={q.file.name}>{q.file.name}</p>
                  {q.error && <p className="mt-0.5 truncate text-[10px] text-destructive" title={q.error}>{q.error}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {queue.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <ImageIcon className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">No hay imagenes en cola</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Arrasta o selecciona imagenes para empezar</p>
        </div>
      )}
    </div>
  )
}
