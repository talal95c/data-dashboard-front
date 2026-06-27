"use client"

import { useState } from "react"
import AppSidebar from "./AppSidebar"
import NavPanel from "./NavPanel"
import MainHeader from "./MainHeader"
import ToastContainer from "../ui/Toast"
import { TbX } from "react-icons/tb"
import { motion } from "framer-motion"

export default function DashboardLayoutClient({
  children
}: {
  children: React.ReactNode
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#07090f] text-white relative font-sans overflow-hidden">
      {/* Ethereal background shadow glows & grain (inspired by dither/grain mockup) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Grain Noise Overlay using vector fractal noise */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg_viewBox=%220_0_200_200%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22noise%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.75%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23noise)%22_opacity=%220.02%22/%3E%3C/svg%3E')] opacity-40 mix-blend-overlay" />

        {/* Top Spotlight (soft blue light shining down) */}
        <motion.div 
          animate={{
            opacity: [0.7, 0.85, 0.7],
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(147,197,253,0.14)_0%,transparent_70%)]"
        />

        {/* Right Floating Light */}
        <motion.div 
          animate={{
            x: [0, 25, -15, 0],
            y: [0, -15, 10, 0],
            opacity: [0.55, 0.7, 0.55],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[20%] right-[-10%] w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.09)_0%,transparent_60%)]"
        />

        {/* Left Bottom Light */}
        <motion.div 
          animate={{
            x: [0, -20, 20, 0],
            y: [0, 10, -10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-15%] left-[5%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.06)_0%,transparent_60%)]"
        />
      </div>

      {/* Toast Notification Mount */}
      <ToastContainer />

      {/* 1. AppSidebar (leftmost) */}
      <AppSidebar />

      {/* 2. NavPanel (middle column - desktop only) */}
      <div className="hidden md:block">
        <NavPanel />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileFiltersOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setMobileFiltersOpen(false)}
        />
      )}

      {/* Mobile NavPanel Drawer (slides in from left) */}
      <div className={`md:hidden fixed top-0 bottom-0 left-0 w-[240px] bg-surface-1 z-40 transition-transform duration-300 transform border-r border-border-custom ${
        mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex justify-end p-2 border-b border-border-custom bg-surface-0">
          <button 
            onClick={() => setMobileFiltersOpen(false)}
            className="w-8 h-8 flex items-center justify-center border border-border-custom rounded hover:bg-surface-1 text-text-primary cursor-pointer"
            title="Fermer"
          >
            <TbX className="text-lg" />
          </button>
        </div>
        <div className="h-[calc(100%-48px)]">
          <NavPanel isMobileDrawer={true} onCloseMobile={() => setMobileFiltersOpen(false)} />
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative pb-16 md:pb-0">
        {/* Main Header */}
        <MainHeader onToggleMobileFilters={() => setMobileFiltersOpen(!mobileFiltersOpen)} />

        {/* Dynamic sub-page container with isolated vertical scroll */}
        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </div>
  )
}
