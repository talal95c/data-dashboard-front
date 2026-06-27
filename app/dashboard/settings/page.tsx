"use client"

import { useGordonStore } from "@/store/useGordonStore"
import { useRouter } from "next/navigation"
import { TbRobot, TbChevronRight, TbLogout, TbSettings } from "react-icons/tb"
import { motion } from "framer-motion"

export default function SettingsPage() {
  const router = useRouter()
  const { user, setUser, setAccessToken, addToast } = useGordonStore()

  const handleLogout = async () => {
    // Clear cookie
    document.cookie = "gordon-session=; path=/; max-age=0;"
    
    // Clear Zustand
    setUser(null)
    setAccessToken(null)
    
    addToast("Logged out successfully.", "info")
    
    // Redirect to login
    router.push("/login")
  }

  // Fallback profile if Zustand is cleared on page refresh
  const displayName = user?.name || "Chef Gordon"
  const displayEmail = user?.email || "chef.gordon@ramarm.ai"
  const displayAvatar = user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=gordon"

  // Stagger variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(2px)" },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 260, damping: 25 } as const
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 max-w-2xl mx-auto space-y-6 select-none"
    >
      {/* Title block */}
      <motion.div variants={cardVariants} className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-surface-1 border border-border-custom flex items-center justify-center text-text-primary">
          <TbSettings className="text-xl" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Settings</h1>
          <p className="text-xs text-text-muted">Manage your preferences and connections</p>
        </div>
      </motion.div>

      {/* Profile Section */}
      <motion.div variants={cardVariants} className="bg-surface-1 border border-border-custom rounded-xl p-5 space-y-4">
        <h2 className="text-xs uppercase font-bold tracking-wider text-text-muted">
          User Profile
        </h2>
        <div className="flex items-center gap-4 bg-surface-2 p-4 rounded-xl border border-border-custom">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={displayAvatar} 
            alt="Avatar" 
            className="w-12 h-12 rounded-full bg-surface-0 border border-border-strong p-1"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text-primary truncate">
              {displayName}
            </h3>
            <p className="text-xs text-text-muted truncate mt-0.5">
              {displayEmail}
            </p>
          </div>
          <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-[20px] font-medium uppercase">
            Connected
          </span>
        </div>
      </motion.div>

      {/* Device Connection Section */}
      <motion.div variants={cardVariants} className="bg-surface-1 border border-border-custom rounded-xl p-5 space-y-4">
        <h2 className="text-xs uppercase font-bold tracking-wider text-text-muted">
          Hardware & Integrations
        </h2>
        <div className="space-y-2">
          {/* Glasses */}
          <div className="flex items-center justify-between p-3.5 bg-surface-2/40 hover:bg-surface-2 rounded-xl transition-all border border-border-custom cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-0 border border-border-custom flex items-center justify-center text-text-secondary">
                🕶️
              </div>
              <div>
                <span className="text-sm font-semibold text-text-primary block">
                  Ray-Ban Meta Glasses
                </span>
                <span className="text-xs text-text-muted">
                  Automatically synchronized
                </span>
              </div>
            </div>
            <TbChevronRight className="text-text-muted" />
          </div>

          {/* Robot Chef */}
          <div className="flex items-center justify-between p-3.5 bg-surface-2/40 hover:bg-surface-2 rounded-xl transition-all border border-border-custom cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-0 border border-border-custom flex items-center justify-center text-text-secondary">
                <TbRobot className="text-lg text-bg-danger" />
              </div>
              <div>
                <span className="text-sm font-semibold text-text-primary block">
                  Robot Open ARM - Gordon
                </span>
                <span className="text-xs text-text-muted">
                  AI Pipeline connected
                </span>
              </div>
            </div>
            <TbChevronRight className="text-text-muted" />
          </div>
        </div>
      </motion.div>

      {/* Disconnect Button */}
      <motion.div variants={cardVariants} className="pt-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-300 font-semibold text-[13px] rounded-lg py-3 cursor-pointer transition-all active:scale-[0.99]"
        >
          <TbLogout className="text-base" />
          <span>Logout</span>
        </button>
      </motion.div>
    </motion.div>
  )
}
