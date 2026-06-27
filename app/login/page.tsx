"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  TbBrandFacebook, 
  TbBrandGoogle, 
  TbLoader2,
  TbChevronLeft
} from "react-icons/tb"

export default function LoginPage() {
  const router = useRouter()
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'facebook' | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Custom mock profile states
  const [customName, setCustomName] = useState("")
  const [customEmail, setCustomEmail] = useState("")

  const handleLogin = async (provider: 'google' | 'facebook') => {
    setLoadingProvider(provider)
    setErrorMessage(null)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 900))

    try {
      const name = customName.trim() || (provider === 'google' ? "Chef Gordon (Google)" : "Chef Gordon (Facebook)")
      const email = customEmail.trim() || (provider === 'google' ? "gordon.google@ramarm.ai" : "gordon.fb@ramarm.ai")
      
      const randomCode = Math.random().toString(36).substring(7)
      
      // Navigate to callback route
      router.push(
        `/callback?code=${randomCode}&provider=${provider}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
      )
    } catch {
      setErrorMessage("Authentication failed. Please try again.")
      setLoadingProvider(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07080a] text-white p-4 md:p-8 font-sans relative overflow-hidden select-none">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/5 blur-[130px] opacity-75" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px] opacity-60" />
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-6 left-1/2 transform bg-red-950 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl flex items-center gap-3 shadow-xl z-50 text-xs font-semibold"
          >
            <span>{errorMessage}</span>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="hover:text-white font-bold ml-2 cursor-pointer focus:outline-none"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Single-Pane Container (Inspired by target mockup) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-2xl bg-[#0c0d12] rounded-3xl shadow-2xl p-8 md:p-14 relative z-10 border border-white/[0.02]"
      >
        {/* Back Button (top left) */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 flex items-center gap-1 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <TbChevronLeft className="text-xs" />
          <span>Back</span>
        </button>

        {/* Form Inner Layout */}
        <div className="max-w-md mx-auto flex flex-col items-center text-center">
          
          {/* Logo container: concentric spinning circles */}
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6">
            <div className="w-7 h-7 rounded-full border-2 border-dashed border-white/40 animate-[spin_30s_linear_infinite] flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full border border-white/60" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1.5 mb-8">
            <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
              Yooo, welcome back!
            </h2>
            <p className="text-xs text-slate-400 font-light">
              First time here? <span className="text-white font-bold hover:underline cursor-pointer">Sign up for free</span>
            </p>
          </div>

          {/* Inputs section */}
          <div className="w-full space-y-2.5 mb-4">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 bg-[#13141c] border border-white/5 focus:border-white/15 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:outline-none transition-all"
            />

            <input
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder="Your email"
              className="w-full px-4 py-3 bg-[#13141c] border border-white/5 focus:border-white/15 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:outline-none transition-all"
            />
          </div>

          {/* Submit Sign In button */}
          <button
            onClick={() => handleLogin("google")}
            disabled={loadingProvider !== null}
            className="w-full bg-white text-slate-950 font-bold text-xs py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer shadow-md select-none mb-3.5 disabled:opacity-50"
          >
            {loadingProvider !== null ? (
              <TbLoader2 className="text-base text-slate-950 animate-spin" />
            ) : (
              <span>Sign in</span>
            )}
          </button>

          {/* Magic link link */}
          <button
            onClick={() => handleLogin("google")}
            className="text-[11px] text-slate-400 hover:text-white font-medium transition-colors cursor-pointer bg-transparent border-none"
          >
            Sign in using magic link
          </button>

          {/* Divider */}
          <div className="relative w-full flex items-center justify-center my-6">
            <div className="absolute inset-x-0 h-[1px] bg-white/5" />
            <span className="relative z-10 px-3 bg-[#0c0d12] text-[9px] text-slate-500 font-bold uppercase tracking-widest">
              or
            </span>
          </div>

          {/* Side-by-side SSO custom styled buttons */}
          <div className="w-full grid grid-cols-2 gap-3 mb-8">
            <button
              onClick={() => handleLogin("google")}
              disabled={loadingProvider !== null}
              className="flex items-center justify-center gap-2 border border-white/5 hover:border-white/15 bg-white/[0.02] text-white py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer hover:bg-white/[0.04] active:scale-[0.99]"
            >
              {loadingProvider === "google" ? (
                <TbLoader2 className="text-xs text-blue-400 animate-spin" />
              ) : (
                <TbBrandGoogle className="text-xs text-white/80" />
              )}
              <span>Sign in with Google</span>
            </button>

            <button
              onClick={() => handleLogin("facebook")}
              disabled={loadingProvider !== null}
              className="flex items-center justify-center gap-2 border border-white/5 hover:border-white/15 bg-white/[0.02] text-white py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer hover:bg-white/[0.04] active:scale-[0.99]"
            >
              {loadingProvider === "facebook" ? (
                <TbLoader2 className="text-xs text-blue-400 animate-spin" />
              ) : (
                <TbBrandFacebook className="text-xs text-white/80" />
              )}
              <span>Sign in with Facebook</span>
            </button>
          </div>

          {/* Legal notes */}
          <div className="text-[10px] text-slate-500 leading-relaxed max-w-xs">
            You acknowledge that you read, and agree, to our{" "}
            <a href="#" className="text-slate-400 underline hover:text-white transition-colors">Terms of Service</a>{" "}
            and our{" "}
            <a href="#" className="text-slate-400 underline hover:text-white transition-colors">Privacy Policy</a>.
          </div>

        </div>
      </motion.div>
    </div>
  )
}
