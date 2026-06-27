"use client"

import { useState } from "react"
import AppSidebar from "./AppSidebar"
import NavPanel from "./NavPanel"
import MainHeader from "./MainHeader"
import ToastContainer from "../ui/Toast"
import { TbX } from "react-icons/tb"

export default function DashboardLayoutClient({
  children
}: {
  children: React.ReactNode
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#07080a] text-white relative font-sans overflow-hidden">
      {/* Ethereal background shadow glows (purple & blue) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[650px] h-[650px] rounded-full bg-purple-600/10 blur-[130px] opacity-80" />
        <div className="absolute bottom-[-10%] left-[10%] w-[550px] h-[550px] rounded-full bg-blue-600/8 blur-[120px] opacity-60" />
        <div className="absolute top-[40%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-500/5 rounded-full blur-[150px] opacity-50 rotate-12" />
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
