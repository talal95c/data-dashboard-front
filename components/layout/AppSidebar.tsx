"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  TbRobot, 
  TbHome, 
  TbPlayerPlay, 
  TbUpload, 
  TbChartBar, 
  TbSettings, 
  TbLogout,
  TbUser,
  TbChevronDown,
  TbSelector,
  TbHistory,
  TbLayoutGrid,
  TbSchool,
  TbMessageCircle,
  TbPlus,
  TbPlug
} from "react-icons/tb"
import { useGordonStore } from "@/store/useGordonStore"
import { motion, AnimatePresence } from "framer-motion"

// Framer Motion configuration matching user code exactly
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
      id: "analytics",
      icon: TbChartBar,
      href: "#",
      label: "Analytics",
      disabled: true,
      active: false
    }
  ]

  const handleNavClick = useCallback((itemId: string) => {
    if (itemId === "upload") {
      setShowUpload(true)
    } else if (itemId === "gallery") {
      setShowUpload(false)
    }
  }, [setShowUpload])

  const handleLogout = useCallback(() => {
    document.cookie = "gordon-session=; path=/; max-age=0;"
    setUser(null)
    setAccessToken(null)
    addToast("Logged out successfully.", "info")
    router.push("/login")
  }, [setUser, setAccessToken, addToast, router])

  return (
    <>
      {/* Desktop sidebar placeholder (reserves correct flow space so main layout does not flicker/shift on hover expansion) */}
      <div className="w-[3.05rem] flex-shrink-0 hidden md:block bg-surface-0 border-r border-border-custom" />

      {/* Actual Animated Collapsible Hover Sidebar */}
      <motion.div
        initial="closed"
        animate={isCollapsed ? "closed" : "open"}
        variants={sidebarVariants}
        transition={transitionProps}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => {
          setIsCollapsed(true)
          setIsOrgDropdownOpen(false)
          setIsAccountDropdownOpen(false)
        }}
        className="sidebar fixed left-0 top-0 bottom-0 z-40 h-full shrink-0 border-r border-border-custom bg-surface-0 text-text-secondary select-none overflow-hidden flex flex-col"
      >
        <motion.div
          className="relative z-40 flex h-full shrink-0 flex-col bg-surface-0 transition-all flex-1"
          variants={contentVariants}
        >
          <motion.ul variants={staggerVariants} className="flex h-full flex-col p-0 m-0 list-none flex-1">
            <div className="flex grow flex-col items-center h-full flex-1">
              
              {/* 1. Organization Dropdown (Top Row) */}
              <div className="flex h-[54px] w-full shrink-0 border-b border-border-custom p-2 relative z-50">
                <div className="mt-[1.5px] flex w-full">
                  <div className="relative w-full">
                    <button
                      onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                      className="flex w-full items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-2 text-text-primary transition-colors cursor-pointer text-left focus:outline-none"
                    >
                      <div className="w-5 h-5 rounded-md bg-[#111111] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                        G
                      </div>
                      
                      <motion.li
                        variants={variants}
                        className="flex items-center justify-between gap-1 w-full list-none"
                      >
                        {!isCollapsed && (
                          <>
                            <span className="text-[12px] font-semibold tracking-tight truncate max-w-[100px]">
                              Gordon AI
                            </span>
                            <TbSelector className="h-3.5 w-3.5 text-text-muted shrink-0" />
                          </>
                        )}
                      </motion.li>
                    </button>

                    {/* Custom Org Dropdown Menu */}
                    <AnimatePresence>
                      {isOrgDropdownOpen && !isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute left-0 mt-2 w-[180px] bg-surface-1 border border-border-strong rounded-lg p-1 shadow-lg z-50 flex flex-col gap-0.5"
                        >
                          <button
                            onClick={() => {
                              setIsOrgDropdownOpen(false)
                              router.push("/dashboard/settings")
                            }}
                            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 rounded-lg transition-colors cursor-pointer text-left w-full"
                          >
                            <TbSettings className="h-4 w-4" /> 
                            <span>Manage Members</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setIsOrgDropdownOpen(false)
                              router.push("/dashboard/settings")
                            }}
                            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 rounded-lg transition-colors cursor-pointer text-left w-full"
                          >
                            <TbPlug className="h-4 w-4" /> 
                            <span>Integrations</span>
                          </button>
                          
                          <div className="h-[1px] bg-border-custom my-1" />
                          
                          <button
                            onClick={() => setIsOrgDropdownOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 rounded-lg transition-colors cursor-pointer text-left w-full"
                          >
                            <TbPlus className="h-4 w-4" />
                            <span>Create Organization</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
                              className="flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 text-text-secondary opacity-40 cursor-not-allowed"
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
                                ? "bg-[#ebebeb] text-text-primary font-semibold" 
                                : "text-text-secondary hover:bg-[#efefef]/80 hover:text-text-primary"
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

                {/* 3. Bottom Actions (Settings & Profile dropdown) */}
                <div className="flex flex-col p-2 border-t border-border-custom relative z-40 bg-surface-0">
                  {/* Quick Settings Link */}
                  <Link
                    href="/dashboard/settings"
                    className={`flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition-colors ${
                      pathname === "/dashboard/settings"
                        ? "bg-[#ebebeb] text-text-primary font-semibold"
                        : "text-text-secondary hover:bg-[#efefef]/80 hover:text-text-primary"
                    }`}
                  >
                    <TbSettings className="h-4 w-4 shrink-0" />
                    <motion.li variants={variants} className="list-none">
                      {!isCollapsed && (
                        <span className="ml-2 text-xs font-semibold whitespace-nowrap">Settings</span>
                      )}
                    </motion.li>
                  </Link>

                  {/* Account Selector Menu block */}
                  <div className="relative mt-1">
                    <button
                      onClick={() => {
                        if (isCollapsed) {
                          setIsCollapsed(false)
                          setIsAccountDropdownOpen(true)
                        } else {
                          setIsAccountDropdownOpen(!isAccountDropdownOpen)
                        }
                      }}
                      className="flex h-8 w-full flex-row items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-surface-2 text-text-secondary hover:text-text-primary cursor-pointer w-full text-left focus:outline-none"
                    >
                      <img 
                        src={displayAvatar} 
                        alt="A" 
                        className="w-4 h-4 rounded bg-surface-1 border border-border-custom p-0.5 shrink-0"
                      />
                      <motion.li
                        variants={variants}
                        className="flex w-full items-center gap-2 list-none"
                      >
                        {!isCollapsed && (
                          <>
                            <span className="text-[12px] font-semibold truncate max-w-[80px]">Account</span>
                            <TbSelector className="ml-auto h-3.5 w-3.5 text-text-muted shrink-0" />
                          </>
                        )}
                      </motion.li>
                    </button>

                    {/* Custom Account Dropdown menu options */}
                    <AnimatePresence>
                      {isAccountDropdownOpen && !isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute bottom-9 left-0 w-[180px] bg-surface-1 border border-border-strong rounded-lg p-1 shadow-lg z-50 flex flex-col gap-0.5"
                        >
                          <div className="flex flex-row items-center gap-2 p-2 border-b border-border-custom">
                            <img 
                              src={displayAvatar} 
                              alt="AL" 
                              className="w-6 h-6 rounded bg-surface-2 border border-border-strong p-0.5 shrink-0"
                            />
                            <div className="flex flex-col text-left min-w-0">
                              <span className="text-xs font-semibold text-text-primary truncate">
                                {displayName}
                              </span>
                              <span className="text-[10px] text-text-muted truncate">
                                {displayEmail}
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => {
                              setIsAccountDropdownOpen(false)
                              router.push("/dashboard/settings")
                            }}
                            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 rounded-lg transition-colors cursor-pointer text-left w-full"
                          >
                            <TbUser className="h-4 w-4" /> 
                            <span>Profile</span>
                          </button>
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer text-left w-full"
                          >
                            <TbLogout className="h-4 w-4" /> 
                            <span>Sign out</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

              </div>

            </div>
          </motion.ul>
        </motion.div>
      </motion.div>

      {/* Mobile Bottom Navigation Bar (< 768px - unaffected by hover states) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-0 border-t border-border-custom flex items-center justify-around px-4 z-40 shadow-lg">
        {/* Logo indicator */}
        <div className="w-[30px] h-[30px] bg-[#111111] rounded-lg flex items-center justify-center">
          <TbRobot className="text-[15px] text-white" />
        </div>

        {navItems.filter(item => !item.disabled).map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => handleNavClick(item.id)}
              className="w-12 h-12 flex flex-col items-center justify-center rounded-lg transition-colors duration-200 text-text-secondary relative"
            >
              {item.active && (
                <motion.div
                  layoutId="activeNavMobile"
                  className="absolute inset-0 bg-surface-2/60 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={`text-[17px] relative z-10 ${item.active ? "text-text-primary" : ""}`} />
              <span className={`text-[10px] mt-0.5 font-medium relative z-10 ${item.active ? "text-text-primary font-semibold" : ""}`}>
                {item.label}
              </span>
            </Link>
          )
        })}

        <Link
          href="/dashboard/settings"
          className="w-12 h-12 flex flex-col items-center justify-center rounded-lg transition-colors duration-200 text-text-secondary relative"
        >
          {pathname === "/dashboard/settings" && (
            <motion.div
              layoutId="activeNavMobile"
              className="absolute inset-0 bg-surface-2/60 rounded-lg -z-10"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <TbSettings className={`text-[17px] relative z-10 ${pathname === "/dashboard/settings" ? "text-text-primary" : ""}`} />
          <span className={`text-[10px] mt-0.5 font-medium relative z-10 ${pathname === "/dashboard/settings" ? "text-text-primary font-semibold" : ""}`}>
            Settings
          </span>
        </Link>
      </nav>
    </>
  )
}
