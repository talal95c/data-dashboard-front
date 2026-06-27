"use client"

import { useRouter, usePathname } from "next/navigation"
import { TbMenu2, TbEye, TbUpload, TbPlus } from "react-icons/tb"
import { useGordonStore } from "@/store/useGordonStore"
import { VideoSource, VideoStatus } from "@/types/video"

interface NavPanelProps {
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export default function NavPanel({ isMobileDrawer = false, onCloseMobile }: NavPanelProps) {
  const router = useRouter()
  const pathname = usePathname()
  const {
    videos,
    sourceFilter,
    setSourceFilter,
    statusFilter,
    setStatusFilter,
    setShowUpload
  } = useGordonStore()

  // Dynamic counter logic
  const totalCount = videos.length
  const raybanCount = videos.filter((v) => v.source === "rayban").length
  const uploadedCount = videos.filter((v) => v.source === "uploaded").length

  const getStatusCount = (status: VideoStatus) => {
    return videos.filter((v) => v.status === status).length
  }

  const handleUploadClick = () => {
    setShowUpload(true)
    if (pathname !== "/dashboard/gallery" && pathname !== "/dashboard/upload") {
      router.push("/dashboard/gallery")
    } else if (pathname === "/dashboard/gallery") {
      // Scroll to dropzone
      const dropzone = document.getElementById("upload-dropzone")
      if (dropzone) {
        dropzone.scrollIntoView({ behavior: "smooth" })
      }
    }
    if (onCloseMobile) onCloseMobile()
  }

  const selectSource = (source: 'all' | VideoSource) => {
    setSourceFilter(source)
    if (onCloseMobile) onCloseMobile()
  }

  const selectStatus = (status: 'all' | VideoStatus) => {
    setStatusFilter(status)
    if (onCloseMobile) onCloseMobile()
  }

  const sourceItems = [
    { id: "all", label: "All", icon: TbMenu2, count: totalCount },
    { id: "rayban", label: "Ray-Ban Meta", icon: TbEye, count: raybanCount },
    { id: "uploaded", label: "Uploaded", icon: TbUpload, count: uploadedCount }
  ]

  const statusItems = [
    { id: "all", label: "All", color: null, count: totalCount },
    { id: "analyzed", label: "Analyzed", color: "bg-green-500", count: getStatusCount("analyzed") },
    { id: "pending", label: "Pending", color: "bg-amber-500", count: getStatusCount("pending") },
    { id: "processing", label: "Processing", color: "bg-blue-500", count: getStatusCount("processing") }
  ]

  return (
    <div className={`flex flex-col h-full bg-surface-1/75 backdrop-blur-md border-r border-border-custom p-[14px_10px] w-[220px] flex-shrink-0 select-none overflow-y-auto ${
      isMobileDrawer ? "w-full border-r-0" : ""
    }`}>
      {/* Section 4.2: Source Filters */}
      <div className="mb-6">
        <h3 className="text-[15px] font-medium text-text-primary px-2 mb-3">
          Videos
        </h3>
        <nav className="flex flex-col gap-1">
          {sourceItems.map((item) => {
            const Icon = item.icon
            const isActive = sourceFilter === item.id

            return (
              <button
                key={item.id}
                onClick={() => selectSource(item.id as 'all' | VideoSource)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-100 cursor-pointer ${
                  isActive
                    ? "bg-surface-2 text-text-primary"
                    : "text-text-secondary hover:bg-surface-2/40 hover:text-text-primary"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="text-sm" />
                  <span>{item.label}</span>
                </div>
                <span className="text-[11px] text-text-muted font-mono bg-surface-0/40 px-1.5 py-0.5 rounded">
                  {item.count}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Horizontal Separator */}
      <hr className="border-t border-border-custom mb-6 mx-2" />

      {/* Section 4.3: Status Filters */}
      <div className="mb-6">
        <div className="text-[10px] font-semibold text-text-muted tracking-wider px-2 mb-3 uppercase">
          Status
        </div>
        <nav className="flex flex-col gap-1">
          {statusItems.map((item) => {
            const isActive = statusFilter === item.id

            return (
              <button
                key={item.id}
                onClick={() => selectStatus(item.id as 'all' | VideoStatus)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-100 cursor-pointer ${
                  isActive
                    ? "bg-surface-2 text-text-primary"
                    : "text-text-secondary hover:bg-surface-2/40 hover:text-text-primary"
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.color ? (
                    <span className={`w-2 h-2 rounded-full ${item.color}`} />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-transparent border border-text-muted/30" />
                  )}
                  <span>{item.label}</span>
                </div>
                <span className="text-[11px] text-text-muted font-mono bg-surface-0/40 px-1.5 py-0.5 rounded">
                  {item.count}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Section 4.4: Upload Button */}
      <div className="mt-auto pt-4">
        <button
          onClick={handleUploadClick}
          className="w-full flex items-center justify-center gap-2 border border-border-strong text-text-primary rounded-lg py-2 px-3 text-[13px] font-medium transition-all duration-100 hover:border-text-secondary hover:bg-surface-2 cursor-pointer"
        >
          <TbPlus className="text-sm" />
          <span>Upload a Video</span>
        </button>
      </div>
    </div>
  )
}
