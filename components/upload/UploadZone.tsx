"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useGordonStore } from "@/store/useGordonStore"
import { TbUpload, TbX, TbLoader2 } from "react-icons/tb"
import { Video } from "@/types/video"
import { motion } from "framer-motion"

export default function UploadZone() {
  const { addVideo, setShowUpload, addToast } = useGordonStore()
  const [isDragActive, setIsDragActive] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number }[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Track generated object URLs in a ref to clean up on unmount
  const createdUrlsRef = useRef<string[]>([])

  // Clean up object URLs to prevent browser memory leaks
  useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url)
      })
    }
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }, [])

  const startMockUpload = useCallback((file: File) => {
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "")
    const newFileId = `upload_${Date.now()}_${Math.random().toString(36).substring(5)}`

    // Generate local Object URL for actual playback inside player
    const objectUrl = URL.createObjectURL(file)
    createdUrlsRef.current.push(objectUrl)

    const newVideo: Video = {
      id: newFileId,
      title: fileNameWithoutExt,
      source: "uploaded",
      duration: "0:00",
      status: "pending",
      date: "Today",
      category: null,
      thumbnailUrl: objectUrl, // real playable blob url
      metaId: null
    }

    addVideo(newVideo)
    addToast(`Starting upload for: ${file.name}`, "info")

    // Update upload status overlay list
    setUploadingFiles((prev) => [...prev, { name: file.name, progress: 0 }])

    // Simulate progress updates
    const uploadDuration = 2000 // 2 seconds
    const intervalTime = 200
    const steps = uploadDuration / intervalTime
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      const progressPercent = Math.round((currentStep / steps) * 100)
      
      setUploadingFiles((prev) =>
        prev.map((f) => (f.name === file.name ? { ...f, progress: progressPercent } : f))
      )

      if (currentStep >= steps) {
        clearInterval(interval)
        
        // Remove from active uploads list
        setUploadingFiles((prev) => prev.filter((f) => f.name !== file.name))
        
        // Success toast
        addToast(`Video uploaded: ${fileNameWithoutExt}`, "success")
        
        // Dismiss dropzone
        setShowUpload(false)
      }
    }, intervalTime)
  }, [addVideo, addToast, setShowUpload])

  const validateAndUpload = useCallback((files: FileList) => {
    const validFiles: File[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const isValidExtension = file.name.toLowerCase().endsWith(".mp4") || file.name.toLowerCase().endsWith(".mov")
      const isValidMimetype = file.type === "video/mp4" || file.type === "video/quicktime"
      const isValidSize = file.size <= 500 * 1024 * 1024 // 500 MB

      if ((isValidExtension || isValidMimetype) && isValidSize) {
        validFiles.push(file)
      } else {
        addToast(
          `Invalid file format/size for "${file.name}". Only MP4 or MOV files under 500 MB are allowed.`,
          "error"
        )
      }
    }

    if (validFiles.length > 0) {
      validFiles.forEach((file) => startMockUpload(file))
    }
  }, [addToast, startMockUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files)
    }
  }, [validateAndUpload])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files)
    }
  }, [validateAndUpload])

  const onButtonClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0, y: -15, filter: "blur(2px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      id="upload-dropzone" 
      className="p-[18px_18px_0_18px] select-none relative"
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".mp4,.mov,video/mp4,video/quicktime"
        className="hidden"
        onChange={handleFileChange}
      />

      <motion.div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        animate={{ scale: isDragActive ? 1.01 : 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className={`relative flex flex-col items-center justify-center rounded-xl p-[28px_20px] text-center border-1.5 transition-all duration-150 cursor-pointer ${
          isDragActive
            ? "border-border-accent bg-bg-accent/40"
            : "border-dashed border-border-strong bg-surface-1 hover:border-text-secondary"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowUpload(false)
          }}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg border border-border-custom bg-surface-2 hover:bg-surface-0 hover:text-white text-text-secondary transition-colors cursor-pointer"
          title="Dismiss"
        >
          <TbX className="text-sm" />
        </button>

        {uploadingFiles.length > 0 ? (
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <TbLoader2 className="text-[30px] text-border-accent animate-spin" />
            <div className="w-full text-center">
              <span className="text-[14px] font-medium text-text-primary block">
                Uploading...
              </span>
              <div className="w-full bg-surface-2 h-1.5 rounded-full mt-2 overflow-hidden border border-border-custom">
                <div 
                  className="bg-border-accent h-full rounded-full transition-all duration-200" 
                  style={{ width: `${uploadingFiles[0]?.progress || 0}%` }}
                />
              </div>
              <span className="text-[11px] text-text-muted mt-1 block">
                {uploadingFiles[0]?.name} ({uploadingFiles[0]?.progress}%)
              </span>
            </div>
          </div>
        ) : (
          <>
            <TbUpload className="text-[30px] text-text-muted mb-2.5 block" />
            <span className="text-[14px] font-medium text-text-primary">
              Drag &amp; drop your videos here
            </span>
            <span className="text-[12px] text-text-muted mt-1">
              MP4, MOV — up to 500 MB per file
            </span>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
