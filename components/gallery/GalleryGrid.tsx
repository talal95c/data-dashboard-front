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
    user,
    addToast,
    searchQuery,
    setShowUpload
  } = useGordonStore()
  
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  // Filter video listing based on active source/status/category/search selectors
  const filteredVideos = videos.filter((video) => {
    const matchesSource = sourceFilter === "all" || video.source === sourceFilter
    const matchesStatus = statusFilter === "all" || video.status === statusFilter
    const matchesCategory = categoryFilter === "all" || video.category === categoryFilter
    const matchesSearch = searchQuery.trim() === "" || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.category && video.category.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSource && matchesStatus && matchesCategory && matchesSearch
  })

  const getCategoryCount = (category: GestureCategory) => {
    return videos.filter((v) => v.category === category).length
  }

  const handleGordonClick = (e: React.MouseEvent, video: Video) => {
    e.stopPropagation() // Prevent row click details modal trigger

    updateVideoStatus(video.id, "processing")
    setGordonStatus("busy")
    addToast(`Gordon RamArm: Executing action path for ${video.title}`, "info")

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
    { name: "Cutting", icon: TbScissors, color: "#e05b35" },
    { name: "Cooking / Searing", icon: TbFlame, color: "#10b981" },
    { name: "Plating / Dressing", icon: TbStar, color: "#6366f1" },
    { name: "Liquids / Deglazing", icon: TbDroplet, color: "#0ea5e9" },
    { name: "Herbs / Greens", icon: TbLeaf, color: "#22c55e" }
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
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.25 } as const }
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col p-6 space-y-8 select-none bg-transparent">
      
      {/* 1. Folders Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-bold tracking-wide text-text-primary">
            Folders
          </h3>
          {categoryFilter !== "all" && (
            <button 
              onClick={() => setCategoryFilter("all")}
              className="text-xs text-slate-500 hover:text-slate-900 hover:underline cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
        >
          {categoriesList.map((cat) => {
            const count = getCategoryCount(cat.name)
            const isActive = categoryFilter === cat.name
            const CatIcon = cat.icon

            return (
              <motion.button
                key={cat.name}
                variants={slideUp}
                whileHover={{ y: -3, scale: 1.015, boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
                onClick={() => setCategoryFilter(isActive ? "all" : cat.name)}
                className={`flex flex-col items-center justify-between p-5 rounded-[20px] bg-[#fafafb] border h-[145px] text-center cursor-pointer w-full group relative overflow-hidden transition-colors duration-150 ${
                  isActive
                    ? "border-slate-400 shadow-sm bg-white"
                    : "border-slate-200/50 hover:border-slate-350"
                }`}
              >
                {/* Apple-style shiny blue 3D folder graphic - Centered */}
                <div className="relative w-16 h-12 select-none flex justify-center items-center mx-auto mt-1">
                  {/* Rear tab background */}
                  <div className="absolute top-1.5 left-2 w-12 h-9 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg shadow-sm border-t border-blue-300 z-10" />
                  
                  {/* Dynamic Sheets peaking out when files exist (count > 0) */}
                  {count > 0 && (
                    <>
                      {/* Sheet 1 */}
                      <motion.div 
                        key={`sheet1-${count}`}
                        initial={{ y: -16, opacity: 0, rotate: -8 }}
                        animate={{ y: -3, opacity: 1, rotate: -8 }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        className="absolute left-2.5 w-7 h-8.5 bg-white border border-slate-200 rounded shadow-xs text-[5px] font-bold text-slate-400 p-0.5 flex flex-col justify-between z-20"
                      >
                        <span className="font-mono text-slate-300 scale-90">MOV</span>
                        <div className="w-full h-0.5 bg-slate-100 rounded-xs" />
                      </motion.div>
                      
                      {/* Sheet 2 */}
                      <motion.div 
                        key={`sheet2-${count}`}
                        initial={{ y: -20, opacity: 0, rotate: 6 }}
                        animate={{ y: -5, opacity: 1, rotate: 6 }}
                        transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.04 }}
                        className="absolute left-6 w-7 h-8.5 bg-white border border-slate-200 rounded shadow-xs text-[5px] font-bold text-slate-500 p-0.5 flex flex-col justify-between z-20"
                      >
                        <span className="font-mono text-slate-400 scale-90">MP4</span>
                        <div className="w-full h-0.5 bg-slate-100 rounded-xs" />
                      </motion.div>
                    </>
                  )}

                  {/* Front tab face overlay */}
                  <div className="absolute bottom-0 left-1 w-[52px] h-[31px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg border-t border-blue-400 shadow-md flex items-end px-1.5 pb-1 z-35">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300/40" />
                  </div>
                  
                  {/* Folder Tab back */}
                  <div className="absolute top-0.5 left-2.5 w-5 h-1.5 bg-blue-400 rounded-t-sm z-0" />
                </div>

                <div className="text-center w-full mt-2">
                  <h4 className="text-[11px] font-bold text-slate-800 leading-tight truncate w-full" title={cat.name}>
                    {cat.name}
                  </h4>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {count} File{count !== 1 ? "s" : ""}
                  </span>
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </div>

      {/* 2. Files Section (List View) */}
      <div className="space-y-3 flex-1 flex flex-col min-h-0">
        <h3 className="text-[13px] font-bold tracking-wide text-text-primary">
          Files
        </h3>

        {filteredVideos.length === 0 ? (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={() => setShowUpload(true)}
            className="w-full h-[200px] rounded-2xl border border-dashed border-slate-200 bg-white hover:bg-slate-50/60 hover:border-slate-300 transition-all duration-200 cursor-pointer group flex flex-col items-center justify-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            <motion.div
              className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-slate-100 group-hover:border-slate-300 transition-all duration-200"
              whileHover={{ rotate: -4, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <TbUpload className="text-[18px] text-slate-400 group-hover:text-slate-600 transition-colors duration-200" />
            </motion.div>
            <div className="space-y-1 text-center">
              <p className="text-[12px] font-semibold text-slate-600 group-hover:text-slate-800 transition-colors duration-200">
                Déposer vos vidéos ici
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                MP4 · MOV · 500 MB max
              </p>
            </div>
          </motion.button>
        ) : (
          /* Files Table View */
          <div className="bg-white border border-border-custom rounded-xl overflow-hidden flex-1 flex flex-col min-h-0 shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-5 py-3 border-b border-border-custom bg-slate-50/50 text-[10px] font-bold text-text-muted tracking-wider uppercase">
              <div className="col-span-5">Name</div>
              <div className="col-span-3">Added By</div>
              <div className="col-span-1 text-center">Source</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* Table Rows (scrollable container) */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              <AnimatePresence>
                {filteredVideos.map((video, idx) => {
                  // Mix contributors to match mockup screenshot
                  let contributorEmail = user?.email || "chef.gordon@ramarm.ai"
                  let contributorName = user?.name || "Chef Gordon"
                  let contributorAvatar = user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=gordon"

                  if (idx % 3 === 0) {
                    contributorEmail = "kevin@mail.com"
                    contributorName = "Kevin"
                    contributorAvatar = "https://api.dicebear.com/7.x/adventurer/svg?seed=kevin"
                  } else if (idx % 3 === 1) {
                    contributorEmail = "antonwe@gmail.com"
                    contributorName = "Anton"
                    contributorAvatar = "https://api.dicebear.com/7.x/adventurer/svg?seed=anton"
                  }

                  return (
                    <motion.div
                      layout
                      key={video.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ x: 2, backgroundColor: "#fafafb" }}
                      transition={{ type: "spring", stiffness: 350, damping: 26 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSelectedVideo(video)}
                      className="grid grid-cols-12 items-center px-5 py-3.5 border-b border-slate-100/50 cursor-pointer text-[13px] group transition-colors duration-100"
                    >
                      {/* Name */}
                      <div className="col-span-5 flex items-center gap-3 pr-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-slate-800 transition-colors flex-shrink-0">
                          <TbMovie className="text-base" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-800 block truncate group-hover:text-[#0066cc] transition-colors" title={video.title}>
                            {video.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                            {video.duration}
                          </span>
                        </div>
                      </div>

                      {/* Added By */}
                      <div className="col-span-3 flex items-center gap-2 pr-2 min-w-0">
                        <img 
                          src={contributorAvatar} 
                          alt={contributorName} 
                          className="w-5 h-5 rounded-full border border-slate-200 bg-slate-50 flex-shrink-0"
                        />
                        <span className="text-[11px] text-slate-600 truncate font-semibold">
                          {contributorEmail}
                        </span>
                      </div>

                      {/* Source */}
                      <div className="col-span-1 flex justify-center">
                        <span className="text-slate-500" title={video.source === "rayban" ? "Ray-Ban Meta" : "Uploaded"}>
                          {video.source === "rayban" ? (
                            <TbEye className="text-base text-blue-500" />
                          ) : (
                            <TbUpload className="text-base text-purple-500" />
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
                            className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-7 h-7 bg-slate-900 text-white rounded-lg transition-all cursor-pointer active:scale-95 hover:bg-slate-800"
                            title="Send to Gordon Robot"
                          >
                            <TbRobot className="text-xs" />
                          </button>
                        ) : (
                          <span className="text-slate-400 group-hover:hidden font-mono">—</span>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
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
              className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30"
              onClick={() => setSelectedVideo(null)}
            />

            {/* Sliding Panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="fixed top-0 bottom-0 right-0 w-full sm:w-[420px] bg-white border-l border-border-custom z-40 flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-border-custom flex items-center justify-between bg-[#f7f7f5]">
                <h3 className="text-sm font-semibold text-text-primary truncate max-w-[80%]">
                  Video Details
                </h3>
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="w-8 h-8 flex items-center justify-center border border-border-custom rounded hover:bg-white text-text-primary cursor-pointer transition-colors"
                  title="Close"
                >
                  <TbX className="text-lg" />
                </button>
              </div>

              {/* Content Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* HTML5 Video Player or Preview Area */}
                <div className="aspect-video w-full rounded-xl bg-[#f7f7f5] border border-border-strong flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
                  {selectedVideo.thumbnailUrl ? (
                    <video 
                      src={selectedVideo.thumbnailUrl} 
                      controls 
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : (
                    <>
                      {selectedVideo.category && (
                        <div className="absolute bottom-0 inset-x-0 px-4 py-3 bg-[#f7f7f5]/80 border-t border-border-custom z-10">
                          <span className="text-[10px] font-medium text-text-muted uppercase tracking-wide block">
                            Detected Category
                          </span>
                          <span className="text-[13px] font-semibold text-text-primary mt-0.5 block">
                            {selectedVideo.category}
                          </span>
                        </div>
                      )}

                      <div className="w-10 h-10 bg-white/8 hover:bg-white/15 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors border border-white/10 relative z-20">
                        <TbPlayerPlay className="text-lg ml-0.5" />
                      </div>
                      <span className="text-[11px] text-text-muted mt-3 relative z-20 font-medium">
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
                  </div>
                </div>

                {/* Meta details list */}
                <div className="bg-[#fafafb] border border-border-custom rounded-xl p-4 space-y-3 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-text-secondary font-medium">Source</span>
                    <span className="font-semibold text-text-primary capitalize">{selectedVideo.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary font-medium">Date Created</span>
                    <span className="font-semibold text-text-primary">{selectedVideo.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary font-medium">Video Duration</span>
                    <span className="font-semibold text-text-primary">{selectedVideo.duration}</span>
                  </div>
                  {selectedVideo.category && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary font-medium">Gesture Category</span>
                      <span className="font-semibold text-text-primary">{selectedVideo.category}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
