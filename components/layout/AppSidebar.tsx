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
  TbChevronDown
} from "react-icons/tb"
import { useGordonStore } from "@/store/useGordonStore"
import { motion, AnimatePresence } from "framer-motion"

export default function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
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

  // Framer Motion variants
  const sidebarVariants = {
    open: { width: "200px" },
    closed: { width: "60px" }
  }

  const textVariants = {
    open: { opacity: 1, x: 0, display: "block" },
    closed: { opacity: 0, x: -10, transitionEnd: { display: "none" } }
  }

  return (
    <>
      {/* Desktop Collapsible Hover Sidebar (hidden on mobile) */}
      <motion.aside 
        initial="closed"
        animate={isCollapsed ? "closed" : "open"}
        variants={sidebarVariants}
        transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => {
          setIsCollapsed(true)
          setIsProfileOpen(false)
        }}
        className="hidden md:flex flex-col items-center bg-surface-0 border-r border-border-custom py-4 flex-shrink-0 h-screen sticky top-0 left-0 z-20 overflow-hidden"
      >
        {/* BrandMark logo */}
        <div className="flex items-center gap-3 w-full px-3.5 mb-6">
          <div className="w-[30px] h-[30px] bg-bg-danger rounded-lg flex items-center justify-center flex-shrink-0 shadow-md shadow-red-950/20">
            <TbRobot className="text-[15px] text-white" />
          </div>
          <motion.span 
            variants={textVariants}
            className="font-mono text-xs font-semibold tracking-tight text-text-primary whitespace-nowrap"
          >
            GORDON
          </motion.span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            if (item.disabled) {
              return (
                <div
                  key={item.id}
                  className="h-10 flex items-center gap-3 px-2.5 rounded-lg text-text-secondary opacity-40 cursor-not-allowed w-full"
                  title={`${item.label} (Disabled)`}
                >
                  <Icon className="text-[17px] flex-shrink-0" />
                  <motion.span variants={textVariants} className="text-xs font-medium whitespace-nowrap">
                    {item.label}
                  </motion.span>
                </div>
              )
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => handleNavClick(item.id)}
                className={`h-10 flex items-center gap-3 px-2.5 rounded-lg text-text-secondary hover:text-text-primary relative transition-colors duration-150 w-full group ${
                  item.active ? "text-text-primary" : ""
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {item.active && (
                  <motion.div
                    layoutId="activeNavDesktop"
                    className="absolute inset-0 bg-surface-2 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="text-[17px] flex-shrink-0 relative z-10" />
                <motion.span 
                  variants={textVariants}
                  className="text-xs font-medium whitespace-nowrap relative z-10"
                >
                  {item.label}
                </motion.span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section: Profile Dropdown menu */}
        <div className="mt-auto px-2 w-full relative">
          <AnimatePresence>
            {isProfileOpen && !isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-12 left-2 right-2 bg-surface-1 border border-border-strong rounded-xl p-1.5 shadow-2xl flex flex-col gap-1 z-30"
              >
                {/* Profile info block */}
                <div className="px-2.5 py-1.5 border-b border-border-custom">
                  <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wider">Account</span>
                  <span className="text-[11px] font-semibold text-text-primary truncate block mt-0.5">{displayName}</span>
                </div>
                {/* Settings link */}
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-2 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 rounded-lg transition-colors"
                >
                  <TbSettings className="text-sm" />
                  <span>Settings</span>
                </Link>
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-2 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer w-full text-left"
                >
                  <TbLogout className="text-sm" />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trigger button */}
          <button
            onClick={() => {
              if (isCollapsed) {
                setIsCollapsed(false)
                setIsProfileOpen(true)
              } else {
                setIsProfileOpen(!isProfileOpen)
              }
            }}
            className={`w-full flex items-center justify-between p-1.5 rounded-xl border transition-all duration-150 cursor-pointer ${
              isProfileOpen 
                ? "bg-surface-2 border-border-strong text-text-primary" 
                : "border-transparent text-text-secondary hover:bg-surface-2 hover:text-text-primary"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={displayAvatar}
                alt="Profile"
                className="w-6 h-6 rounded bg-surface-1 border border-border-custom p-0.5 flex-shrink-0"
              />
              <motion.div variants={textVariants} className="text-left min-w-0">
                <span className="text-[11px] font-semibold text-text-primary block truncate leading-none">
                  {displayName}
                </span>
                <span className="text-[9px] text-text-muted block truncate mt-0.5 leading-none">
                  {displayEmail}
                </span>
              </motion.div>
            </div>
            {!isCollapsed && (
              <motion.div variants={textVariants}>
                <TbChevronDown className={`text-xs transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
              </motion.div>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation Bar (< 768px - stays fixed) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-0 border-t border-border-custom flex items-center justify-around px-4 z-40 shadow-lg">
        {/* Logo indicator */}
        <div className="w-[30px] h-[30px] bg-bg-danger rounded-lg flex items-center justify-center">
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
              <span className={`text-[9px] mt-0.5 font-medium relative z-10 ${item.active ? "text-text-primary font-semibold" : ""}`}>
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
          <span className={`text-[9px] mt-0.5 font-medium relative z-10 ${pathname === "/dashboard/settings" ? "text-text-primary font-semibold" : ""}`}>
            Settings
          </span>
        </Link>
      </nav>
    </>
  )
}
