"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  TbRobot,
  TbPlayerPlay,
  TbSettings,
  TbLogout,
  TbSelector,
  TbPlus,
  TbLayoutGrid,
  TbInbox,
  TbWand,
  TbShoppingBag
} from "react-icons/tb"
import { useGordonStore } from "@/store/useGordonStore"
import { motion, AnimatePresence } from "framer-motion"

const sidebarVariants = {
  open:   { width: "15rem" },
  closed: { width: "3.05rem" }
}

const contentVariants = {
  open:   { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 }
}

const labelVariants = {
  open:   { x: 0, opacity: 1, transition: { x: { stiffness: 1000, velocity: -100 } } },
  closed: { x: -16, opacity: 0, transition: { x: { stiffness: 100 } } }
}

const transitionProps = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
  staggerChildren: 0.1
} as const

const staggerVariants = {
  open: { transition: { staggerChildren: 0.03, delayChildren: 0.02 } }
}

interface NavItem {
  id: string
  icon: React.ElementType
  href: string
  label: string
  active?: boolean
  disabled?: boolean
}

interface NavSection {
  id: string
  sectionLabel: string
  SectionIcon: React.ElementType
  items: NavItem[]
}

export default function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const [isCollapsed, setIsCollapsed]           = useState(true)
  const [isOrgDropdownOpen, setIsOrgDropdownOpen]       = useState(false)
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false)

  const { setShowUpload, user, setUser, setAccessToken, addToast } = useGordonStore()

  const displayName   = user?.name   || "Chef Gordon"
  const displayEmail  = user?.email  || "chef.gordon@ramarm.ai"
  const displayAvatar = user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=gordon"

  const inCreator     = pathname.startsWith("/dashboard/gallery") || pathname.startsWith("/dashboard/upload")
  const inMarketplace = pathname.startsWith("/dashboard/marketplace")

  const navSections: NavSection[] = [
    {
      id: "creator",
      sectionLabel: "Creator",
      SectionIcon: TbWand,
      items: [
        {
          id: "data",
          icon: TbPlayerPlay,
          href: "/dashboard/gallery",
          label: "Data",
          active: inCreator
        },
        {
          id: "models",
          icon: TbRobot,
          href: "#",
          label: "My Models",
          disabled: true
        }
      ]
    },
    {
      id: "marketplace",
      sectionLabel: "Marketplace",
      SectionIcon: TbShoppingBag,
      items: [
        {
          id: "browse",
          icon: TbLayoutGrid,
          href: "/dashboard/marketplace",
          label: "Browse",
          active: inMarketplace
        },
        {
          id: "purchases",
          icon: TbInbox,
          href: "#",
          label: "My Purchases",
          disabled: true
        }
      ]
    }
  ]

  const handleNavClick = useCallback((id: string) => {
    setShowUpload(false)
    setIsAccountDropdownOpen(false)
    setIsOrgDropdownOpen(false)
  }, [setShowUpload])

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

            {/* Org dropdown */}
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

                <AnimatePresence>
                  {isOrgDropdownOpen && !isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 mt-2 w-[180px] bg-white border border-slate-200 rounded-lg p-1 shadow-lg z-50 flex flex-col gap-0.5"
                    >
                      <button
                        onClick={() => { setIsOrgDropdownOpen(false); router.push("/dashboard/settings") }}
                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left w-full"
                      >
                        <TbSettings className="h-4 w-4" />
                        <span>Manage Members</span>
                      </button>
                      <button
                        onClick={() => { setIsOrgDropdownOpen(false) }}
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

            {/* Navigation sections */}
            <div className="flex h-full w-full flex-col min-h-0 flex-1 py-3 px-2 gap-1 overflow-y-auto">
              {navSections.map((section, sectionIdx) => (
                <div key={section.id} className={sectionIdx > 0 ? "mt-3" : ""}>

                  {/* Section label (only when expanded) */}
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        variants={labelVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="flex items-center gap-1.5 px-2 mb-1"
                      >
                        <section.SectionIcon className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                          {section.sectionLabel}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Section items */}
                  <div className="flex flex-col gap-0.5">
                    {section.items.map(item => {
                      const Icon = item.icon

                      if (item.disabled) {
                        return (
                          <div
                            key={item.id}
                            title={`${item.label} (Coming soon)`}
                            className="flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 text-slate-400 opacity-35 cursor-not-allowed"
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            {!isCollapsed && (
                              <motion.span variants={labelVariants} className="ml-2 text-xs font-semibold whitespace-nowrap">
                                {item.label}
                              </motion.span>
                            )}
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
                              layoutId="activeNavIndicator"
                              className="absolute inset-0 bg-[#ebebeb] rounded-md -z-10"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                          )}
                          <Icon className="h-4 w-4 shrink-0" />
                          {!isCollapsed && (
                            <motion.span variants={labelVariants} className="ml-2 text-xs font-semibold whitespace-nowrap list-none">
                              {item.label}
                            </motion.span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Settings — bottom of nav list */}
              <div className="mt-auto pt-3 border-t border-[#eaeaea]">
                <Link
                  href="/dashboard/settings"
                  onClick={() => handleNavClick("settings")}
                  className={`flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition-colors relative ${
                    pathname === "/dashboard/settings"
                      ? "bg-[#ebebeb] text-slate-800 font-semibold"
                      : "text-slate-500 hover:bg-[#efefef]/80 hover:text-slate-800"
                  }`}
                >
                  {pathname === "/dashboard/settings" && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-[#ebebeb] rounded-md -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <TbSettings className="h-4 w-4 shrink-0" />
                  {!isCollapsed && (
                    <motion.span variants={labelVariants} className="ml-2 text-xs font-semibold whitespace-nowrap">
                      Settings
                    </motion.span>
                  )}
                </Link>
              </div>
            </div>

            {/* Account switcher */}
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
                  {!isCollapsed && (
                    <motion.div variants={labelVariants} className="min-w-0 text-left ml-2">
                      <span className="text-[11px] font-bold text-slate-800 block truncate">
                        {displayName}
                      </span>
                      <span className="text-[9px] text-slate-400 block truncate">
                        Chef Pilot
                      </span>
                    </motion.div>
                  )}
                </div>
                {!isCollapsed && <TbSelector className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
              </button>

              <AnimatePresence>
                {isAccountDropdownOpen && !isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-2 right-2 bottom-12 bg-white border border-slate-200 rounded-xl p-1 shadow-lg z-50 flex flex-col gap-0.5"
                  >
                    <button
                      onClick={() => { setIsAccountDropdownOpen(false); router.push("/dashboard/settings") }}
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
