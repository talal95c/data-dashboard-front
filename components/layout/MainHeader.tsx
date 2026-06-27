"use client"

import { TbUpload, TbMenu } from "react-icons/tb"
import { useGordonStore } from "@/store/useGordonStore"
import { usePathname, useRouter } from "next/navigation"

interface MainHeaderProps {
  onToggleMobileFilters?: () => void;
}

export default function MainHeader({ onToggleMobileFilters }: MainHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const {
    videos,
    sourceFilter,
    statusFilter,
    gordonStatus,
    setShowUpload
  } = useGordonStore()

  // Dynamic titles based on active source filter
  let title = "All Videos"
  if (sourceFilter === "rayban") {
    title = "Ray-Ban Meta"
  } else if (sourceFilter === "uploaded") {
    title = "Uploaded Videos"
  }

  // Count active videos after filters are applied
  const filteredVideosCount = videos.filter((v) => {
    const matchesSource = sourceFilter === "all" || v.source === sourceFilter
    const matchesStatus = statusFilter === "all" || v.status === statusFilter
    return matchesSource && matchesStatus
  }).length

  const handleUploadClick = () => {
    setShowUpload(true)
    if (pathname !== "/dashboard/gallery" && pathname !== "/dashboard/upload") {
      router.push("/dashboard/gallery")
    } else if (pathname === "/dashboard/gallery") {
      const dropzone = document.getElementById("upload-dropzone")
      if (dropzone) {
        dropzone.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  // Gordon Robot online/offline state
  const isOnline = gordonStatus === "online"
  const gordonStatusText = isOnline ? "Online" : gordonStatus === "busy" ? "Busy" : "Offline"

  return (
    <header className="sticky top-0 z-10 bg-surface-2 border-b border-border-custom px-[18px] py-[14px] flex items-center justify-between select-none h-14">
      {/* Left side: Mobile menu toggle + dynamic titles */}
      <div className="flex items-center gap-3">
        {onToggleMobileFilters && (
          <button
            onClick={onToggleMobileFilters}
            className="md:hidden w-8 h-8 flex items-center justify-center border border-border-custom rounded hover:bg-surface-1 cursor-pointer text-text-primary"
            title="Toggle Filters"
          >
            <TbMenu className="text-lg" />
          </button>
        )}

        <div className="flex flex-col justify-center">
          <h2 className="text-[15px] font-medium text-text-primary leading-tight">
            {title}
          </h2>
          <span className="text-[12px] text-text-muted mt-0.5 font-normal">
            {filteredVideosCount} video{filteredVideosCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Right side: Robot status indicator + CTA Upload */}
      <div className="flex items-center gap-4">
        {/* Gordon Status Indicator */}
        <div className="flex items-center gap-2" title={`Gordon RamArm: ${gordonStatusText}`}>
          <span className={`w-[7px] h-[7px] rounded-full transition-colors duration-300 ${
            gordonStatus === "online" 
              ? "bg-green-500 shadow-sm shadow-green-500/50" 
              : gordonStatus === "busy"
              ? "bg-amber-500 animate-pulse"
              : "bg-gray-500"
          }`} />
          <span className="text-[12px] text-text-secondary font-medium hidden sm:inline">
            Gordon RamArm
          </span>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUploadClick}
          className="flex items-center gap-1.5 bg-fill-primary text-on-primary font-semibold text-[13px] rounded-lg py-[6px] px-[13px] hover:opacity-90 transition-all cursor-pointer shadow-sm select-none"
        >
          <TbUpload className="text-[13px] stroke-[2.5]" />
          <span>Upload</span>
        </button>
      </div>
    </header>
  )
}
