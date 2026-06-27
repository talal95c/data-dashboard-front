"use client"

import { useRouter, usePathname } from "next/navigation"
import { TbMenu2, TbEye, TbUpload, TbPlus, TbFlame, TbScissors, TbStar, TbLeaf, TbDroplet, TbArrowUp } from "react-icons/tb"
import { useGordonStore } from "@/store/useGordonStore"
import { VideoSource, VideoStatus } from "@/types/video"

interface NavPanelProps {
  isMobileDrawer?: boolean
  onCloseMobile?: () => void
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

  const isMarketplace = pathname.startsWith("/dashboard/marketplace")

  const totalCount    = videos.length
  const raybanCount   = videos.filter(v => v.source === "rayban").length
  const uploadedCount = videos.filter(v => v.source === "uploaded").length

  const getStatusCount = (status: VideoStatus) => videos.filter(v => v.status === status).length

  const handleUploadClick = () => {
    setShowUpload(true)
    if (pathname !== "/dashboard/gallery" && pathname !== "/dashboard/upload") {
      router.push("/dashboard/gallery")
    }
    if (onCloseMobile) onCloseMobile()
  }

  const selectSource = (source: "all" | VideoSource) => {
    setSourceFilter(source)
    if (onCloseMobile) onCloseMobile()
  }

  const selectStatus = (status: "all" | VideoStatus) => {
    setStatusFilter(status)
    if (onCloseMobile) onCloseMobile()
  }

  const sourceItems = [
    { id: "all",      label: "All",          icon: TbMenu2,  count: totalCount    },
    { id: "rayban",   label: "Ray-Ban Meta",  icon: TbEye,    count: raybanCount   },
    { id: "uploaded", label: "Uploaded",      icon: TbUpload, count: uploadedCount }
  ]

  const statusItems = [
    { id: "all",        label: "All",        color: null             },
    { id: "analyzed",   label: "Analyzed",   color: "bg-green-400/70" },
    { id: "pending",    label: "Pending",    color: "bg-amber-400/70" },
    { id: "processing", label: "Processing", color: "bg-blue-400/70"  }
  ]

  const marketplaceCategories = [
    { label: "All Techniques",    icon: TbMenu2    },
    { label: "Cooking / Searing", icon: TbFlame    },
    { label: "Cutting",           icon: TbScissors },
    { label: "Plating / Dressing",icon: TbStar     },
    { label: "Herbs / Greens",    icon: TbLeaf     },
    { label: "Liquids / Deglazing",icon: TbDroplet }
  ]

  return (
    <div className={`flex flex-col h-full bg-white border-r border-border-custom py-4 px-2.5 w-[220px] flex-shrink-0 select-none overflow-y-auto ${
      isMobileDrawer ? "w-full border-r-0" : ""
    }`}>

      {isMarketplace ? (
        /* ── Marketplace panel ── */
        <>
          <div className="mb-6">
            <div className="px-2 mb-3">
              <h3 className="text-sm font-semibold text-text-primary">Categories</h3>
            </div>
            <nav className="flex flex-col gap-0.5">
              {marketplaceCategories.map((cat, i) => {
                const Icon = cat.icon
                const isActive = i === 0
                return (
                  <button
                    key={cat.label}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-all duration-100 cursor-pointer ${
                      isActive
                        ? "bg-[#efefef] text-text-primary font-semibold"
                        : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
                    }`}
                  >
                    <Icon className="text-xs text-text-secondary shrink-0" />
                    <span className="truncate">{cat.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <hr className="border-t border-border-custom mb-6 mx-2" />

          <div className="mt-auto pt-4">
            <button
              className="w-full flex items-center justify-center gap-1.5 border border-border-strong text-text-primary rounded-lg py-2 px-3 text-[12px] font-semibold transition-all duration-100 hover:border-text-secondary hover:bg-slate-50 cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <TbArrowUp className="text-sm" />
              <span>Publish a Model</span>
            </button>
          </div>
        </>
      ) : (
        /* ── Creator panel ── */
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between px-2 mb-3">
              <h3 className="text-sm font-semibold text-text-primary">Videos</h3>
              <button
                onClick={handleUploadClick}
                className="hover:text-text-primary p-0.5 text-text-muted cursor-pointer focus:outline-none"
                title="Add Video"
              >
                <TbPlus className="text-sm" />
              </button>
            </div>

            <nav className="flex flex-col gap-0.5">
              {sourceItems.map(item => {
                const Icon = item.icon
                const isActive = sourceFilter === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => selectSource(item.id as "all" | VideoSource)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-all duration-100 cursor-pointer ${
                      isActive
                        ? "bg-[#efefef] text-text-primary font-semibold"
                        : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="text-xs text-text-secondary" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] text-text-muted font-mono bg-slate-100 px-1.5 py-0.5 rounded-md">
                      {item.count}
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>

          <hr className="border-t border-border-custom mb-6 mx-2" />

          <div className="mb-6">
            <div className="text-[10px] font-medium text-text-muted tracking-wider px-2 mb-3 uppercase">
              Status
            </div>
            <nav className="flex flex-col gap-0.5">
              {statusItems.map(item => {
                const isActive = statusFilter === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => selectStatus(item.id as "all" | VideoStatus)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-all duration-100 cursor-pointer ${
                      isActive
                        ? "bg-[#efefef] text-text-primary font-semibold"
                        : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.color ? (
                        <span className={`w-1.5 h-1.5 rounded-full ${item.color} opacity-80`} />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent border border-text-muted/40" />
                      )}
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] text-text-muted font-mono bg-slate-100 px-1.5 py-0.5 rounded-md">
                      {item.id === "all" ? totalCount : getStatusCount(item.id as VideoStatus)}
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="mt-auto pt-4">
            <button
              onClick={handleUploadClick}
              className="w-full flex items-center justify-center gap-1.5 border border-border-strong text-text-primary rounded-lg py-2 px-3 text-[12px] font-semibold transition-all duration-100 hover:border-text-secondary hover:bg-slate-50 cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <TbPlus className="text-sm" />
              <span>Upload Video</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
