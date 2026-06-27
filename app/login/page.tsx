"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  TbRobot, 
  TbBrandFacebook, 
  TbBrandGoogle, 
  TbLoader2, 
  TbUser, 
  TbMail 
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
      
      // Navigate to callback route with parameters
      router.push(
        `/callback?code=${randomCode}&provider=${provider}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
      )
    } catch {
      setErrorMessage("Authentication failed. Please try again.")
      setLoadingProvider(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] text-slate-800 p-4 md:p-8 font-sans">
      <AnimatePresence>
        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-6 left-1/2 transform bg-red-600 border border-red-500 text-white px-4 py-3 rounded-xl flex items-center gap-3 shadow-xl z-50 text-xs font-semibold"
          >
            <span>{errorMessage}</span>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="hover:text-gray-200 font-bold ml-2 cursor-pointer focus:outline-none"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dual-Pane Container Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px] border border-slate-200"
      >
        {/* Left Pane - Dark Futuristic Gradient Background */}
        <div className="w-full md:w-1/2 bg-[#0c0d0f] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden text-white">
          {/* Blue Mesh Glow Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.18),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(239,68,68,0.06),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

          {/* Top Row: App Logo */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-7 h-7 bg-bg-danger rounded-lg flex items-center justify-center shadow-lg shadow-red-950/20">
              <TbRobot className="text-sm text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight font-mono uppercase">
              Gordon RamArm
            </span>
          </div>

          {/* Bottom Content: Headline & Stats */}
          <div className="relative z-10 mt-12 md:mt-0 space-y-6">
            {/* Avatar badge stack */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
              <div className="flex -space-x-2">
                <img className="w-5 h-5 rounded-full border border-[#0c0d0f] bg-slate-700" src="https://api.dicebear.com/7.x/avataaars/svg?seed=chef1" alt="Avatar" />
                <img className="w-5 h-5 rounded-full border border-[#0c0d0f] bg-slate-700" src="https://api.dicebear.com/7.x/avataaars/svg?seed=chef2" alt="Avatar" />
                <img className="w-5 h-5 rounded-full border border-[#0c0d0f] bg-slate-700" src="https://api.dicebear.com/7.x/avataaars/svg?seed=chef3" alt="Avatar" />
              </div>
              <span className="text-[10px] text-slate-300 font-medium tracking-wide">
                Trusted by 500+ kitchen chefs
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight max-w-sm">
              Your robot chef&apos;s brain, always learning.
            </h2>
            <p className="text-xs text-slate-400 font-light leading-relaxed max-w-xs">
              Gordon RamArm processes your Ray-Ban Meta video recordings to automatically train your robot chef. Seamless sync, zero friction.
            </p>
          </div>
        </div>

        {/* Right Pane - Clean Minimalist Input Form (Light) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-white">
          {/* Form Header */}
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 border border-slate-200">
              <TbRobot className="text-base" />
            </div>
            <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
              Demo Portal
            </span>
          </div>

          {/* Form Fields */}
          <div className="my-8 md:my-0 space-y-6">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-950">
                Get Beta Access
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Customize your mock profile and connect your account.
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wider">
                  Your Name
                </label>
                <div className="relative">
                  <TbUser className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter name (e.g. Chef Pierre)"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wider">
                  Your Email
                </label>
                <div className="relative">
                  <TbMail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="Enter email (e.g. pierre@cooking.ai)"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Buttons stack */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => handleLogin("google")}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-xs transition-all duration-200 cursor-pointer shadow-sm bg-white text-slate-800 hover:bg-slate-50 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
              >
                {loadingProvider === "google" ? (
                  <TbLoader2 className="text-base text-blue-500 animate-spin" />
                ) : (
                  <TbBrandGoogle className="text-base text-[#EA4335]" />
                )}
                <span>Continue with Google</span>
              </button>

              <button
                onClick={() => handleLogin("facebook")}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-xs transition-all duration-200 cursor-pointer shadow-sm bg-white text-slate-800 hover:bg-slate-50 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
              >
                {loadingProvider === "facebook" ? (
                  <TbLoader2 className="text-base text-blue-500 animate-spin" />
                ) : (
                  <TbBrandFacebook className="text-base text-[#1877F2]" />
                )}
                <span>Continue with Facebook</span>
              </button>
            </div>
          </div>

          {/* Legal Note */}
          <div className="text-[10px] text-slate-400 leading-normal max-w-xs border-t border-slate-100 pt-4">
            Read-only access. Data trains Gordon RamArm only. By signing in, you agree to our Terms.
          </div>
        </div>
      </motion.div>
    </div>
  )
}
