"use client"

import { useState } from "react"
import { TbUpload, TbMenu, TbChevronDown, TbSearch, TbBell, TbX } from "react-icons/tb"
import { useGordonStore } from "@/store/useGordonStore"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface MainHeaderProps {
  onToggleMobileFilters?: () => void;
}

export default function MainHeader({ onToggleMobileFilters }: MainHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const {
    videos,
    sourceFilter,
    statusFilter,
    user,
    setShowUpload,
    searchQuery,
    setSearchQuery
  } = useGordonStore()

  // Dynamic title based on section + source filter
  let title = "All Recordings"
  if (pathname.startsWith("/dashboard/marketplace")) {
    title = "Marketplace"
  } else if (sourceFilter === "rayban") {
    title = "Ray-Ban Meta"
  } else if (sourceFilter === "uploaded") {
    title = "Uploaded Recordings"
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

  const mockNotifications = [
    { id: 1, text: "Video 'Seasonal Carrot Julienne' analyzed by Gordon Robot.", time: "10m ago" },
    { id: 2, text: "Kevin uploaded a new video: 'Red Wine Reduction & Deglazing'.", time: "2h ago" },
    { id: 3, text: "Robot status changed to 'Online'.", time: "1d ago" }
  ]

  const displayName = user?.name || "Chef Gordon"
  const displayAvatar = user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=gordon"

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border-custom px-6 py-3.5 flex items-center justify-between select-none h-[58px]">
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
      <div className="flex items-center gap-2.5 relative">
        
        {/* Search button / input */}
        <AnimatePresence mode="wait">
          {isSearchOpen ? (
            <motion.div
              initial={{ width: 40, opacity: 0 }}
              animate={{ width: 180, opacity: 1 }}
              exit={{ width: 40, opacity: 0 }}
              className="flex items-center gap-1.5 border border-slate-200 bg-slate-50 rounded-lg px-2 py-1 h-7"
            >
              <TbSearch className="text-slate-400 text-xs shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (pathname !== "/dashboard/gallery") {
                    router.push("/dashboard/gallery")
                  }
                }}
                className="bg-transparent border-0 outline-none text-xs text-slate-800 placeholder-slate-400 w-full focus:ring-0"
                autoFocus
              />
              <button 
                onClick={() => {
                  setIsSearchOpen(false)
                  setSearchQuery("")
                }}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <TbX className="text-[10px]" />
              </button>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsSearchOpen(true)
                if (pathname !== "/dashboard/gallery") {
                  router.push("/dashboard/gallery")
                }
              }}
              className="w-7 h-7 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
              title="Search Videos"
            >
              <TbSearch className="text-xs" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Notifications button with dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-7 h-7 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
            title="Notifications"
          >
            <TbBell className="text-xs" />
          </motion.button>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-400 ring-[1.5px] ring-white" />

          {/* Notifications List Popup */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <>
                {/* Backdrop overlay */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsNotificationsOpen(false)}
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-[280px] bg-white border border-slate-200 rounded-xl p-2.5 shadow-lg z-50 flex flex-col gap-1.5 text-left"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 px-1.5">
                    <span className="text-[11px] font-bold text-slate-800">Notifications</span>
                    <button 
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-[9px] text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                    >
                      Dismiss all
                    </button>
                  </div>
                  <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto">
                    {mockNotifications.map((notif) => (
                      <div 
                        key={notif.id}
                        className="p-1.5 rounded-lg hover:bg-slate-50 transition-colors text-[10px] text-slate-600 border border-transparent hover:border-slate-100"
                      >
                        <p className="font-semibold text-slate-800 leading-snug">{notif.text}</p>
                        <span className="text-[9px] text-slate-400 block mt-1">{notif.time}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

        {/* User profile card — flat, no shadow */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
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
        </motion.div>

        {/* CTA — Upload in Creator, hidden in Marketplace */}
        {!pathname.startsWith("/dashboard/marketplace") && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUploadClick}
            className="flex items-center gap-1 bg-slate-950 text-white font-semibold text-[11px] rounded-lg py-1.5 px-3 hover:bg-slate-800 cursor-pointer transition-all"
          >
            <TbUpload className="text-[11px] stroke-[2.5]" />
            <span>Upload</span>
          </motion.button>
        )}
      </div>
    </header>
  )
}
