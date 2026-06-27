"use client"

import { useState } from "react"
import { useGordonStore } from "@/store/useGordonStore"
import StatusBadge from "./StatusBadge"
import { Video, GestureCategory } from "@/types/video"
import { motion, AnimatePresence } from "framer-motion"
import { 
  TbVideoOff, 
  TbX, 
  TbPlayerPlay, 
  TbRobot, 
  TbCalendar, 
  TbClock, 
  TbEye, 
  TbCpu,
  TbScissors,
  TbFlame,
  TbStar,
  TbDroplet,
  TbLeaf,
  TbUpload,
  TbMovie
} from "react-icons/tb"

export default function GalleryGrid() {
  const { 
    videos, 
    sourceFilter, 
    statusFilter, 
    categoryFilter, 
    setCategoryFilter,
    updateVideoStatus, 
    setGordonStatus, 
    addToast 
  } = useGordonStore()
  
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  // Filter video listing based on active source/status/category selectors
  const filteredVideos = videos.filter((video) => {
    const matchesSource = sourceFilter === "all" || video.source === sourceFilter
    const matchesStatus = statusFilter === "all" || video.status === statusFilter
    const matchesCategory = categoryFilter === "all" || video.category === categoryFilter
    return matchesSource && matchesStatus && matchesCategory
  })

  const getCategoryCount = (category: GestureCategory) => {
    return videos.filter((v) => v.category === category).length
  }

  const handleGordonClick = (e: React.MouseEvent, video: Video) => {
    e.stopPropagation() // Prevent row click details modal trigger

    updateVideoStatus(video.id, "processing")
    setGordonStatus("busy")
    addToast(`Sent to Gordon RamArm: ${video.title}`, "success")
    if (selectedVideo?.id === video.id) {
      setSelectedVideo({ ...video, status: "processing" })
    }

    setTimeout(() => {
      // Pick a random category on completion if it was generic
      const categories: GestureCategory[] = [
        "Cutting", 
        "Cooking / Searing", 
        "Plating / Dressing", 
        "Liquids / Deglazing", 
        "Herbs / Greens"
      ]
      const randomCat = categories[Math.floor(Math.random() * categories.length)]
      
      updateVideoStatus(video.id, "analyzed")
      video.category = video.category || randomCat
      video.duration = video.duration === "0:00" ? "1:15" : video.duration

      setGordonStatus("online")
      addToast(`Gordon RamArm: Analysis complete for ${video.title}`, "info")
      
      if (selectedVideo?.id === video.id) {
        setSelectedVideo((prev) => prev ? { ...prev, status: "analyzed", category: video.category } : null)
      }
    }, 7000)
  }

  // Folder categories list configurations
  const categoriesList: { name: GestureCategory; icon: any; color: string }[] = [
    { name: "Cutting", icon: TbScissors, color: "#f5c4b3" },
    { name: "Cooking / Searing", icon: TbFlame, color: "#9fe1cb" },
    { name: "Plating / Dressing", icon: TbStar, color: "#cecbf6" },
    { name: "Liquids / Deglazing", icon: TbDroplet, color: "#b5d4f4" },
    { name: "Herbs / Greens", icon: TbLeaf, color: "#c0dd97" },
    { name: "Generic Upload", icon: TbUpload, color: "#f4c0d1" }
  ]

  // Animations
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  }

  const slideUp = {
    hidden: { opacity: 0, y: 12, filter: "blur(2px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 300, damping: 25 } as const }
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col p-6 space-y-8 select-none">
      
      {/* 1. Folders Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide text-text-primary">
            Folders
          </h3>
          {categoryFilter !== "all" && (
            <button 
              onClick={() => setCategoryFilter("all")}
              className="text-xs text-border-accent hover:underline cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
        >
          {categoriesList.map((cat) => {
            const count = getCategoryCount(cat.name)
            const isActive = categoryFilter === cat.name
            const CatIcon = cat.icon

            return (
              <motion.button
                key={cat.name}
                variants={slideUp}
                onClick={() => setCategoryFilter(isActive ? "all" : cat.name)}
                className={`flex flex-col justify-between p-4 rounded-2xl bg-surface-1 border transition-all duration-200 h-[135px] text-left cursor-pointer w-full group relative overflow-hidden ${
                  isActive 
                    ? "border-border-accent bg-border-accent/5 shadow-lg shadow-blue-500/5" 
                    : "border-border-custom hover:border-border-strong"
                }`}
              >
                {/* Folder graphic with sheets popping out */}
                <div className="relative w-12 h-8 mt-1 select-none">
                  {/* Sheets behind folder */}
                  <div className="absolute top-0.5 left-2.5 w-6 h-6 bg-slate-700 rounded border border-slate-600 shadow-sm flex items-center justify-center text-[7px] text-slate-300 font-semibold font-mono transform -rotate-12 group-hover:-translate-y-1 transition-transform">
                    MOV
                  </div>
                  <div className="absolute top-0 left-2 w-7 h-7 bg-slate-200 rounded border border-slate-300 shadow-md flex items-center justify-center text-[8px] text-[#333] font-extrabold font-mono transform rotate-6 group-hover:-translate-y-1.5 transition-transform">
                    MP4
                  </div>
                  {/* Folder body */}
                  <div className="absolute bottom-0 inset-x-0 h-6 bg-slate-800 border-t border-x border-slate-700 rounded-t flex items-center px-1.5 shadow-md">
                    {/* Small category indicator */}
                    <div style={{ color: cat.color }} className="opacity-80">
                      <CatIcon className="text-xs" />
                    </div>
                  </div>
                  {/* Folder Tab back */}
                  <div className="absolute bottom-5 left-1 w-5 h-1.5 bg-slate-800 border-t border-x border-slate-700 rounded-t" />
                </div>

                <div>
                  <h4 className="text-[12px] font-medium text-text-primary leading-tight truncate w-full" title={cat.name}>
                    {cat.name}
                  </h4>
                  <span className="text-[10px] text-text-muted mt-1 block">
                    {count} Video{count !== 1 ? "s" : ""}
                  </span>
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </div>

      {/* 2. Files Section (List View) */}
      <div className="space-y-3 flex-1 flex flex-col min-h-0">
        <h3 className="text-sm font-semibold tracking-wide text-text-primary">
          Files
        </h3>

        {filteredVideos.length === 0 ? (
          /* Empty state */
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 bg-surface-1 border border-border-custom rounded-2xl h-[200px]"
          >
            <TbVideoOff className="text-2xl text-text-muted mb-2" />
            <p className="text-xs text-text-secondary font-medium">
              No files found matching criteria.
            </p>
          </motion.div>
        ) : (
          /* Files Table View */
          <div className="bg-surface-1 border border-border-custom rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col min-h-0">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-5 py-3 border-b border-border-custom bg-surface-0/60 text-[10px] font-bold text-text-muted tracking-wider uppercase">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1 text-center">Source</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* Table Rows (scrollable container) */}
            <div className="flex-1 overflow-y-auto divide-y divide-border-custom/40">
              <AnimatePresence>
                {filteredVideos.map((video) => (
                  <motion.div
                    layout
                    key={video.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedVideo(video)}
                    className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-surface-2/40 cursor-pointer transition-colors text-[13px] group"
                  >
                    {/* Name */}
                    <div className="col-span-6 flex items-center gap-3 pr-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border-custom flex items-center justify-center text-text-secondary group-hover:text-text-primary transition-colors flex-shrink-0">
                        <TbMovie className="text-base" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-text-primary block truncate group-hover:text-border-accent transition-colors" title={video.title}>
                          {video.title}
                        </span>
                        <span className="text-[10px] text-text-muted font-mono block mt-0.5">
                          {video.date} • {video.duration}
                        </span>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="col-span-2 text-text-secondary truncate pr-2">
                      {video.category ? (
                        <span className="bg-surface-2 border border-border-custom text-text-secondary text-[10px] font-bold px-2 py-0.5 rounded-[20px] uppercase">
                          {video.category}
                        </span>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </div>

                    {/* Source */}
                    <div className="col-span-1 flex justify-center">
                      <span className="text-text-secondary" title={video.source === "rayban" ? "Ray-Ban Meta" : "Uploaded"}>
                        {video.source === "rayban" ? (
                          <TbEye className="text-base text-blue-400" />
                        ) : (
                          <TbUpload className="text-base text-purple-400" />
                        )}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex justify-center">
                      <StatusBadge status={video.status} />
                    </div>

                    {/* Action button on hover */}
                    <div className="col-span-1 flex justify-end">
                      {video.status === "analyzed" ? (
                        <button
                          onClick={(e) => handleGordonClick(e, video)}
                          className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-8 h-8 bg-fill-primary text-on-primary rounded-lg transition-all shadow-md cursor-pointer active:scale-95"
                          title="Send to Gordon Robot"
                        >
                          <TbRobot className="text-base" />
                        </button>
                      ) : (
                        <span className="text-text-muted group-hover:hidden">—</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Side Details Drawer Overlay */}
      <AnimatePresence>
        {selectedVideo && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
              onClick={() => setSelectedVideo(null)}
            />

            {/* Sliding Panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="fixed top-0 bottom-0 right-0 w-full sm:w-[420px] bg-surface-1 border-l border-border-custom z-40 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-border-custom flex items-center justify-between bg-surface-0">
                <h3 className="text-sm font-semibold text-text-primary truncate max-w-[80%]">
                  Video Details
                </h3>
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="w-8 h-8 flex items-center justify-center border border-border-custom rounded hover:bg-surface-2 text-text-primary cursor-pointer transition-colors"
                  title="Close"
                >
                  <TbX className="text-lg" />
                </button>
              </div>

              {/* Content Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* HTML5 Video Player or Preview Area */}
                <div className="aspect-video w-full rounded-xl bg-surface-0 border border-border-strong flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
                  {selectedVideo.thumbnailUrl ? (
                    <video 
                      src={selectedVideo.thumbnailUrl} 
                      controls 
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : (
                    <>
                      {selectedVideo.category ? (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 z-10">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-border-accent mb-1">
                            Detected Category
                          </span>
                          <span className="text-[14px] font-bold text-white">
                            {selectedVideo.category}
                          </span>
                        </div>
                      ) : null}

                      {/* Pulse wave animation in player */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                        <div className="w-24 h-24 bg-border-accent rounded-full animate-ping"></div>
                      </div>

                      <div className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center cursor-pointer transition-all border border-white/10 shadow-lg relative z-20">
                        <TbPlayerPlay className="text-xl ml-0.5" />
                      </div>
                      <span className="text-[11px] text-text-secondary mt-3 relative z-20 font-medium bg-black/40 px-2 py-0.5 rounded">
                        Ray-Ban Meta Stream Preview
                      </span>
                    </>
                  )}
                </div>

                {/* Video Title & Badge */}
                <div className="space-y-2">
                  <h2 className="text-[16px] font-semibold text-text-primary leading-snug">
                    {selectedVideo.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={selectedVideo.status} />
                    {selectedVideo.category && (
                      <span className="bg-surface-2 border border-border-custom text-text-secondary text-[10px] font-bold px-2 py-0.5 rounded-[20px] uppercase tracking-wide">
                        {selectedVideo.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Data Meta Grid */}
                <div className="bg-surface-2 border border-border-custom rounded-xl p-4 space-y-3 text-[13px]">
                  <div className="flex items-center justify-between text-text-secondary">
                    <div className="flex items-center gap-2">
                      <TbEye className="text-sm text-text-muted" />
                      <span>Source</span>
                    </div>
                    <span className="font-semibold text-text-primary capitalize">
                      {selectedVideo.source === "rayban" ? "Ray-Ban Meta Glasses" : "Manual Upload"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-text-secondary">
                    <div className="flex items-center gap-2">
                      <TbClock className="text-sm text-text-muted" />
                      <span>Duration</span>
                    </div>
                    <span className="font-mono font-semibold text-text-primary">
                      {selectedVideo.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-text-secondary">
                    <div className="flex items-center gap-2">
                      <TbCalendar className="text-sm text-text-muted" />
                      <span>Recorded Date</span>
                    </div>
                    <span className="font-semibold text-text-primary">
                      {selectedVideo.date}
                    </span>
                  </div>

                  {selectedVideo.metaId && (
                    <div className="flex items-center justify-between text-text-secondary">
                      <div className="flex items-center gap-2">
                        <TbCpu className="text-sm text-text-muted" />
                        <span>Meta API ID</span>
                      </div>
                      <span className="font-mono text-[11px] text-text-muted bg-surface-0 px-2 py-0.5 rounded">
                        {selectedVideo.metaId}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action: Send to Gordon robot */}
                {selectedVideo.status === "analyzed" && (
                  <button
                    onClick={(e) => handleGordonClick(e, selectedVideo)}
                    className="w-full flex items-center justify-center gap-2 bg-fill-primary text-on-primary font-bold text-[13px] py-3 rounded-lg hover:opacity-90 transition-all cursor-pointer shadow-md select-none"
                  >
                    <TbRobot className="text-base" />
                    <span>Send to Gordon RamArm</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
