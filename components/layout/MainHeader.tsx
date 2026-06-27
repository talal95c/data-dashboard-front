"use client"

import { TbUpload, TbMenu, TbChevronDown, TbSearch, TbBell } from "react-icons/tb"
import { useGordonStore } from "@/store/useGordonStore"
import { usePathname, useRouter } from "next/navigation"

interface MainHeaderProps {
  onToggleMobileFilters?: () => void;
}

export default function MainHeader({ onToggleMobileFilters }: MainHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const {
    sourceFilter,
    user,
    setShowUpload
  } = useGordonStore()

  // Dynamic titles based on active source filter
  let title = "All Videos"
  if (sourceFilter === "rayban") {
    title = "Ray-Ban Meta"
  } else if (sourceFilter === "uploaded") {
    title = "Uploaded Videos"
  }

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

  const displayName = user?.name || "Chef Gordon"
  const displayAvatar = user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=gordon"

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-border-custom px-6 py-3.5 flex items-center justify-between select-none h-[58px]">
      {/* Left side: Mobile menu toggle + dynamic title with chevron dropdown (mock) */}
      <div className="flex items-center gap-3">
        {onToggleMobileFilters && (
          <button
            onClick={onToggleMobileFilters}
            className="md:hidden w-8 h-8 flex items-center justify-center border border-border-custom rounded hover:bg-slate-50 cursor-pointer text-text-primary"
            title="Toggle Filters"
          >
            <TbMenu className="text-lg" />
          </button>
        )}

        <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-85">
          <h2 className="text-[14px] font-bold text-text-primary leading-tight">
            {title}
          </h2>
          <TbChevronDown className="text-xs text-text-muted mt-0.5" />
        </div>
      </div>

      {/* Right side: Circular controls + Profile switcher (Notion/Apple style) */}
      <div className="flex items-center gap-2.5">
        
        {/* Circular search button */}
        <button
          onClick={() => router.push("/dashboard/gallery")}
          className="w-7 h-7 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
          title="Search Videos"
        >
          <TbSearch className="text-xs" />
        </button>

        {/* Circular notifications button */}
        <div className="relative">
          <button
            className="w-7 h-7 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
            title="Notifications"
          >
            <TbBell className="text-xs" />
          </button>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-400 ring-[1.5px] ring-white" />
        </div>

        <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

        {/* User profile card — flat, no shadow */}
        <div
          onClick={() => router.push("/dashboard/settings")}
          className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg p-[4px_8px] cursor-pointer transition-colors"
        >
          <img
            src={displayAvatar}
            alt="Avatar"
            className="w-4 h-4 rounded-md object-cover border border-slate-200/50 bg-slate-100"
          />
          <span className="text-[11px] font-semibold text-slate-700 leading-none truncate max-w-[80px]">
            {displayName}
          </span>
          <TbChevronDown className="text-[9px] text-slate-400" />
        </div>

        {/* Upload — primary CTA */}
        <button
          onClick={handleUploadClick}
          className="flex items-center gap-1 bg-slate-950 text-white font-semibold text-[11px] rounded-lg py-1.5 px-3 hover:bg-slate-800 cursor-pointer active:scale-[0.98] transition-all"
        >
          <TbUpload className="text-[11px] stroke-[2.5]" />
          <span>Upload</span>
        </button>
      </div>
    </header>
  )
}
