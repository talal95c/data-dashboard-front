"use client"

import { useGordonStore } from "@/store/useGordonStore"
import { TbX, TbCheck, TbAlertTriangle, TbInfoCircle } from "react-icons/tb"
import { motion, AnimatePresence } from "framer-motion"

export default function ToastContainer() {
  const { toasts, removeToast } = useGordonStore()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success"
          const isError = toast.type === "error"
          
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, scale: 0.95, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-2xl ${
                isSuccess
                  ? "bg-[#102a18]/90 border-green-500/30 text-green-200"
                  : isError
                  ? "bg-[#3a1010]/90 border-red-500/30 text-red-200"
                  : "bg-[#101b2a]/90 border-blue-500/30 text-blue-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isSuccess && (
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <TbCheck className="text-xs stroke-[3]" />
                  </div>
                )}
                {isError && (
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                    <TbAlertTriangle className="text-xs stroke-[3]" />
                  </div>
                )}
                {!isSuccess && !isError && (
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <TbInfoCircle className="text-xs stroke-[3]" />
                  </div>
                )}
                <span className="text-[13px] font-medium leading-relaxed">
                  {toast.text}
                </span>
              </div>
              
              <button
                onClick={() => removeToast(toast.id)}
                className="text-text-muted hover:text-text-primary transition-colors cursor-pointer ml-2"
                title="Dismiss"
              >
                <TbX className="text-sm" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
