"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useGordonStore } from "@/store/useGordonStore"
import { TbLoader2, TbRobot } from "react-icons/tb"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [statusText, setStatusText] = useState("Verifying credentials...")
  const { setUser, setAccessToken } = useGordonStore()

  useEffect(() => {
    const handleAuth = async () => {
      // Simulate token exchange delay for visual polish
      await new Promise((resolve) => setTimeout(resolve, 1200))
      
      const provider = searchParams.get("provider") || "facebook"
      const code = searchParams.get("code") || "mock_code"
      const customName = searchParams.get("name")
      const customEmail = searchParams.get("email")
      
      setStatusText("Exchanging tokens & synchronizing...")
      await new Promise((resolve) => setTimeout(resolve, 800))

      // 1. Store custom name/email in Zustand memory
      const name = customName || "Chef Gordon"
      const email = customEmail || "chef.gordon@ramarm.ai"
      const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`

      setUser({
        id: "usr_gordon_1",
        name,
        email,
        avatar
      })
      setAccessToken(`tok_${provider}_${code}_${Date.now()}`)

      // 2. Write standard session cookie so server components authorize access
      document.cookie = `gordon-session=${provider}_mock_token; path=/; max-age=86400;`

      setStatusText("Redirecting to dashboard...")
      await new Promise((resolve) => setTimeout(resolve, 400))

      router.push("/dashboard")
    }

    handleAuth()
  }, [router, searchParams, setUser, setAccessToken])

  return (
    <div className="flex flex-col items-center">
      {/* BrandMark Robot Circle */}
      <div className="w-16 h-16 bg-bg-danger rounded-full flex items-center justify-center shadow-lg shadow-red-900/30 mb-6 border border-red-500/20">
        <TbRobot className="text-3xl text-white animate-bounce" />
      </div>

      <h2 className="text-xl font-bold tracking-tight text-text-primary mb-2">
        Signing In
      </h2>
      <p className="text-xs text-text-muted mb-8 uppercase tracking-widest font-mono">
        Gordon RamArm
      </p>

      <div className="flex items-center gap-3 bg-surface-2 border border-border-custom px-4 py-3 rounded-lg w-full justify-center">
        <TbLoader2 className="text-lg text-border-accent animate-spin" />
        <span className="text-xs font-medium text-text-secondary">
          {statusText}
        </span>
      </div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-2 text-white p-6">
      <div className="bg-surface-1 border border-border-strong p-10 rounded-2xl max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-bg-danger rounded-full blur-3xl opacity-10 pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-border-accent rounded-full blur-3xl opacity-10 pointer-events-none"></div>

        <div className="relative z-10">
          <Suspense fallback={
            <div className="flex items-center gap-3 bg-surface-2 border border-border-custom px-4 py-3 rounded-lg w-full justify-center">
              <TbLoader2 className="text-lg text-border-accent animate-spin" />
              <span className="text-xs font-medium text-text-secondary">
                Initializing session...
              </span>
            </div>
          }>
            <CallbackContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
