"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  TbBrandFacebook,
  TbBrandGoogle,
  TbLoader2,
  TbChevronLeft
} from "react-icons/tb"
import { useGordonStore } from "@/store/useGordonStore"

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useGordonStore()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [customName, setCustomName] = useState("")
  const [customEmail, setCustomEmail] = useState("")

  const handleSignIn = async () => {
    setLoading(true)
    setErrorMessage(null)

    try {
      const result = await signIn("credentials", {
        username: "admin",
        password: "admin",
        redirect: false,
        callbackUrl: "/dashboard"
      })

      if (result?.error) {
        setErrorMessage("Authentication failed. Make sure the backend is running on port 3001.")
        setLoading(false)
        return
      }

      // Store custom display info in Zustand
      const name = customName.trim() || "Operator"
      const email = customEmail.trim() || "operator@ramarm.ai"
      const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
      setUser({ id: "session-user", name, email, avatar })

      router.push("/dashboard")
    } catch {
      setErrorMessage("Cannot connect to backend. Make sure it is running on port 3001.")
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: "google" | "facebook") => {
    setLoading(true)
    setErrorMessage(null)
    try {
      await signIn(provider, { callbackUrl: "/dashboard" })
    } catch {
      setErrorMessage(`${provider} OAuth is not configured on the backend.`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] text-slate-800 p-4 md:p-8 font-sans relative select-none">

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-6 left-1/2 transform bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 shadow-xl z-50 text-xs font-semibold"
          >
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="hover:text-red-900 font-bold ml-2 cursor-pointer focus:outline-none"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-10 relative z-10 border border-slate-100"
      >
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
        >
          <TbChevronLeft className="text-xs" />
          <span>Back</span>
        </button>

        <div className="flex flex-col items-center w-full mt-4">

          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-5">
            <div className="w-6 h-6 rounded-full border border-dashed border-slate-400 animate-[spin_25s_linear_infinite] flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full border border-slate-600" />
            </div>
          </div>

          <div className="space-y-1.5 mb-6 text-center">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
              Welcome to RamArm
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Industrial robot motion training platform
            </p>
          </div>

          <div className="w-full space-y-2.5 mb-4">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
              placeholder="Your name (optional)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none transition-all"
            />
            <input
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
              placeholder="Your email (optional)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none transition-all"
            />
          </div>

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl active:scale-[0.99] transition-all cursor-pointer shadow-sm select-none mb-3.5 disabled:opacity-50"
          >
            {loading ? (
              <TbLoader2 className="text-base text-white animate-spin mx-auto" />
            ) : (
              <span>Sign in</span>
            )}
          </button>

          <div className="relative w-full flex items-center justify-center my-5">
            <div className="absolute inset-x-0 h-[1px] bg-slate-100" />
            <span className="relative z-10 px-3 bg-white text-[9px] text-slate-400 font-bold uppercase tracking-widest">
              or
            </span>
          </div>

          <div className="w-full space-y-2 mb-6">
            <button
              onClick={() => handleOAuthLogin("google")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm hover:border-slate-300 active:scale-[0.99]"
            >
              <TbBrandGoogle className="text-xs text-slate-500" />
              <span>Sign in with Google</span>
            </button>

            <button
              onClick={() => handleOAuthLogin("facebook")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm hover:border-slate-300 active:scale-[0.99]"
            >
              <TbBrandFacebook className="text-xs text-slate-500" />
              <span>Sign in with Facebook</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-400 leading-relaxed text-center">
            You acknowledge that you read, and agree, to our{" "}
            <a href="#" className="text-slate-500 underline hover:text-slate-800 transition-colors">Terms of Service</a>{" "}
            and our{" "}
            <a href="#" className="text-slate-500 underline hover:text-slate-800 transition-colors">Privacy Policy</a>.
          </div>

        </div>
      </motion.div>
    </div>
  )
}
