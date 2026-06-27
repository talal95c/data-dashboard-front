"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  TbRobot, 
  TbHome, 
  TbPlayerPlay, 
  TbUpload, 
  TbSettings, 
  TbLogout,
  TbChevronDown,
  TbSelector,
  TbPlus,
  TbLayoutGrid,
  TbInbox,
  TbCalendar
} from "react-icons/tb"
import { useGordonStore } from "@/store/useGordonStore"
import { motion, AnimatePresence } from "framer-motion"

const sidebarVariants = {
  open: {
    width: "15rem",
  },
  closed: {
    width: "3.05rem",
  },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: { stiffness: 100 },
    },
  },
};

const transitionProps = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
  staggerChildren: 0.1,
} as const;

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

export default function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false)
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false)
  
  const { 
    showUpload, 
    setShowUpload, 
    user,
    setUser, 
    setAccessToken, 
    addToast 
  } = useGordonStore()

  const displayName = user?.name || "Chef Gordon"
  const displayEmail = user?.email || "chef.gordon@ramarm.ai"
  const displayAvatar = user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=gordon"

  const navItems = [
    {
      id: "home",
      icon: TbHome,
      href: "/dashboard",
      label: "Home",
      active: pathname === "/dashboard"
    },
    {
      id: "gallery",
      icon: TbPlayerPlay,
      href: "/dashboard/gallery",
      label: "Gallery",
      active: pathname === "/dashboard/gallery" && !showUpload
    },
    {
      id: "upload",
      icon: TbUpload,
      href: "/dashboard/upload",
      label: "Upload",
      active: pathname === "/dashboard/upload" || (pathname === "/dashboard/gallery" && showUpload)
    },
    {
      id: "settings",
      icon: TbSettings,
      href: "/dashboard/settings",
      label: "Settings",
      active: pathname === "/dashboard/settings"
    },
    {
      id: "calendar",
      icon: TbCalendar,
      href: "#",
      label: "Calendar",
      disabled: true
    },
    {
      id: "inbox",
      icon: TbInbox,
      href: "#",
      label: "Inbox",
      disabled: true
    }
  ]

  const handleNavClick = useCallback((id: string) => {
    if (id === "upload") {
      setShowUpload(true)
      router.push("/dashboard/gallery")
    } else {
      setShowUpload(false)
    }
    setIsAccountDropdownOpen(false)
    setIsOrgDropdownOpen(false)
  }, [router, setShowUpload])

  const handleLogout = useCallback(() => {
    setUser(null)
    setAccessToken(null)
    addToast("Logged out successfully", "info")
    router.push("/login")
  }, [router, setUser, setAccessToken, addToast])

  return (
    <div className="relative z-40 h-full w-[3.05rem] shrink-0 select-none">
      <motion.div
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => {
          setIsCollapsed(true)
          setIsOrgDropdownOpen(false)
          setIsAccountDropdownOpen(false)
        }}
        animate={isCollapsed ? "closed" : "open"}
        variants={sidebarVariants}
        transition={transitionProps}
        className="sidebar fixed left-0 top-0 bottom-0 z-40 h-full shrink-0 border-r border-[#eaeaea] bg-[#f7f7f5] text-slate-700 select-none overflow-hidden flex flex-col"
      >
        <motion.div
          className="relative z-40 flex h-full shrink-0 flex-col bg-[#f7f7f5] transition-all flex-1"
          variants={contentVariants}
        >
          <motion.ul variants={staggerVariants} className="flex h-full flex-col p-0 m-0 list-none flex-1">
            
            {/* 1. Top Organization Dropdown Block */}
            <div className="p-3 border-b border-border-custom bg-white/20">
              <div className="relative w-full">
                <button
                  onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                  className="flex w-full items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-200/40 text-slate-800 transition-colors cursor-pointer focus:outline-none"
                >
                  {isCollapsed ? (
                    <div className="w-5 h-5 flex items-center justify-center mx-auto">
                      <div className="w-2.5 h-2.5 bg-slate-950 rounded-full" />
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between w-full min-w-0"
                    >
                      <span className="text-[11px] font-extrabold tracking-wider text-slate-900 uppercase font-sans truncate pr-1">
                        gordon-data
                      </span>
                      <TbSelector className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    </motion.div>
                  )}
                </button>

                {/* Custom Org Dropdown Menu */}
                <AnimatePresence>
                  {isOrgDropdownOpen && !isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 mt-2 w-[180px] bg-white border border-slate-200 rounded-lg p-1 shadow-lg z-50 flex flex-col gap-0.5"
                    >
                      <button
                        onClick={() => {
                          setIsOrgDropdownOpen(false)
                          router.push("/dashboard/settings")
                        }}
                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left w-full"
                      >
                        <TbSettings className="h-4 w-4" /> 
                        <span>Manage Members</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setIsOrgDropdownOpen(false)
                          router.push("/dashboard/settings")
                        }}
                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left w-full"
                      >
                        <TbPlus className="h-4 w-4" />
                        <span>Create Organization</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 2. Middle Navigation list (Scrollable area) */}
            <div className="flex h-full w-full flex-col min-h-0 flex-1">
              <div className="flex grow flex-col gap-4 min-h-0 flex-1 py-3">
                <div className="h-full grow px-2 overflow-y-auto">
                  <div className="flex w-full flex-col gap-1">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      if (item.disabled) {
                        return (
                          <div
                            key={item.id}
                            className="flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 text-slate-400 opacity-40 cursor-not-allowed"
                            title={`${item.label} (Disabled)`}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <motion.li variants={variants} className="list-none">
                              {!isCollapsed && (
                                <span className="ml-2 text-xs font-semibold whitespace-nowrap">
                                  {item.label}
                                </span>
                              )}
                            </motion.li>
                          </div>
                        )
                      }

                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => handleNavClick(item.id)}
                          className={`flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition-colors relative ${
                            item.active 
                              ? "bg-[#ebebeb] text-slate-800 font-semibold" 
                              : "text-slate-500 hover:bg-[#efefef]/80 hover:text-slate-800"
                          }`}
                        >
                          {item.active && (
                            <motion.div
                              layoutId="activeNavIndicator2"
                              className="absolute inset-0 bg-[#ebebeb] rounded-md -z-10"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                          )}
                          <Icon className="h-4 w-4 shrink-0" />
                          <motion.li variants={variants} className="list-none">
                            {!isCollapsed && (
                              <span className="ml-2 text-xs font-semibold whitespace-nowrap">
                                {item.label}
                              </span>
                            )}
                          </motion.li>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Bottom account switcher settings */}
            <div className="p-2 border-t border-[#eaeaea] bg-white/20 mt-auto relative">
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="flex h-10 w-full flex-row items-center justify-between rounded-lg px-1.5 py-1 hover:bg-slate-200/40 text-slate-700 transition-colors cursor-pointer focus:outline-none"
              >
                <div className="flex flex-row items-center min-w-0">
                  <img 
                    src={displayAvatar} 
                    alt="Avatar" 
                    className="w-6 h-6 rounded-md object-cover border border-slate-200/50 bg-slate-100 flex-shrink-0"
                  />
                  <motion.div variants={variants} className="min-w-0 text-left">
                    {!isCollapsed && (
                      <div className="ml-2">
                        <span className="text-[11px] font-bold text-slate-800 block truncate">
                          {displayName}
                        </span>
                        <span className="text-[9px] text-slate-400 block truncate">
                          Chef Pilot
                        </span>
                      </div>
                    )}
                  </motion.div>
                </div>
                {!isCollapsed && <TbSelector className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
              </button>

              {/* Account Dropdown Menu */}
              <AnimatePresence>
                {isAccountDropdownOpen && !isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-2 right-2 bottom-12 bg-white border border-slate-200 rounded-xl p-1 shadow-lg z-50 flex flex-col gap-0.5"
                  >
                    <button
                      onClick={() => {
                        setIsAccountDropdownOpen(false)
                        router.push("/dashboard/settings")
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left w-full"
                    >
                      <TbRobot className="h-4 w-4" /> 
                      <span>Manage Robot</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-left w-full font-semibold"
                    >
                      <TbLogout className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.ul>
        </motion.div>
      </motion.div>
    </div>
  )
}
