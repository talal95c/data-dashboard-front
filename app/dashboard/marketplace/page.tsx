"use client"

import { useState } from "react"
import { useGordonStore } from "@/store/useGordonStore"
import { TbPlus, TbCheck } from "react-icons/tb"
import { motion, AnimatePresence } from "framer-motion"

const tasks = [
  {
    id: "pick-place",
    name: "Pick & Place",
    company: "AutoLine GmbH",
    industry: "Automotive, Stuttgart",
    specialty: "3-axis linear arm path",
    level: 97,
    cost: 0,
    avatar: "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=600&q=80",
    specs: { trajectories: "340", gear: "Ray-Ban Meta v2", size: "8.2 GB", accuracy: "98.5%" }
  },
  {
    id: "packaging",
    name: "Box Packaging",
    company: "PackTech Industries",
    industry: "Food & Beverage, Lyon",
    specialty: "Fold & seal sequence",
    level: 91,
    cost: 120,
    avatar: "https://images.unsplash.com/photo-1601598851547-4302969d0614?auto=format&fit=crop&w=600&q=80",
    specs: { trajectories: "210", gear: "Ray-Ban Meta v2", size: "6.4 GB", accuracy: "97.1%" }
  },
  {
    id: "welding",
    name: "Arc Welding",
    company: "WeldBot Corp",
    industry: "Aerospace, Toulouse",
    specialty: "Continuous bead pattern",
    level: 98,
    cost: 180,
    avatar: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80",
    specs: { trajectories: "185", gear: "Ray-Ban Meta Pro", size: "11.3 GB", accuracy: "99.1%" }
  },
  {
    id: "inspection",
    name: "Visual Inspection",
    company: "QualScan Labs",
    industry: "Electronics, Shenzhen",
    specialty: "Multi-point scan path",
    level: 94,
    cost: 150,
    avatar: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80",
    specs: { trajectories: "290", gear: "Ray-Ban Meta v2", size: "9.7 GB", accuracy: "96.8%" }
  },
  {
    id: "assembly",
    name: "Screw Assembly",
    company: "AssemBot SA",
    industry: "Medical Devices, Basel",
    specialty: "Torque-controlled rotation",
    level: 88,
    cost: 90,
    avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    specs: { trajectories: "155", gear: "Ray-Ban Meta v1", size: "7.1 GB", accuracy: "95.3%" }
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 24 } as const
  }
}

export default function MarketplacePage() {
  const [isInstalling, setIsInstalling]       = useState<string | null>(null)
  const [installProgress, setInstallProgress] = useState(0)

  const {
    activeChef, purchasedChefs, robotCredits,
    setActiveChef, purchaseChef, addCredits, addToast
  } = useGordonStore()

  const handlePurchase = (taskId: string, cost: number, taskName: string) => {
    if (robotCredits < cost) {
      addToast("Insufficient credits. Please add more credits.", "error")
      return
    }
    setIsInstalling(taskName)
    setInstallProgress(0)
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setInstallProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        addCredits(-cost)
        purchaseChef(taskName)
        setActiveChef(taskName)
        setIsInstalling(null)
        addToast(`Model installed: "${taskName}" ready to deploy on robot`, "success")
      }
    }, 250)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 select-none">

      {/* Credits header */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-xs"
      >
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Credits Balance</span>
          <span className="text-base font-bold text-slate-900 mt-0.5 block">{robotCredits} Credits</span>
        </div>
        <button
          onClick={() => { addCredits(100); addToast("Added 100 Credits to balance", "success") }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-all active:scale-[0.98]"
        >
          <TbPlus className="text-xs stroke-[2.5]" />
          <span>Get +100 Credits</span>
        </button>
      </motion.div>

      {/* Task cards grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {tasks.map((task) => {
          const isPurchased = purchasedChefs.includes(task.name)
          const isActive    = activeChef === task.name

          return (
            <motion.div
              key={task.id}
              variants={cardVariants}
              whileHover={{ y: -3, scale: 1.01, boxShadow: "0 10px 20px -5px rgba(0,0,0,0.04)" }}
              whileTap={{ scale: 0.995 }}
              transition={{ type: "spring", stiffness: 420, damping: 25 }}
              className={`bg-white border rounded-[22px] p-4 flex flex-col justify-between space-y-4 shadow-xs relative text-left transition-colors duration-150 ${
                isActive ? "border-slate-400" : "border-slate-200/80"
              }`}
            >
              {/* Photo panel */}
              <div className="relative w-full h-[135px] rounded-xl overflow-hidden flex flex-col justify-between p-3">
                <img
                  src={task.avatar}
                  alt={task.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

                {/* Level badge */}
                <div className="w-full flex items-center justify-between relative z-10">
                  <span className="text-[8px] bg-white/15 backdrop-blur-sm text-white rounded-full px-2 py-0.5 font-bold tracking-wider border border-white/20 uppercase">
                    v{(task.level / 10).toFixed(1)}
                  </span>
                </div>

                {/* Name + action */}
                <div className="w-full flex items-end justify-between relative z-10">
                  <div className="min-w-0 pr-2">
                    <h4 className="text-[11px] font-extrabold text-white leading-tight truncate drop-shadow">
                      {task.name}
                    </h4>
                    <span className="text-[8px] text-white/70 font-semibold truncate block mt-0.5">
                      {task.industry}
                    </span>
                  </div>

                  {isPurchased ? (
                    isActive ? (
                      <div className="bg-white/15 backdrop-blur-sm text-white rounded-lg px-2.5 py-1 text-[8px] font-extrabold border border-white/20 uppercase tracking-wider flex items-center gap-1">
                        <TbCheck className="text-[9px] text-emerald-400 stroke-[3]" />
                        <span>Deployed</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setActiveChef(task.name); addToast(`Loaded motion model: ${task.name}`, "info") }}
                        className="bg-white text-slate-900 rounded-lg px-2.5 py-1 text-[8px] font-extrabold shadow-xs cursor-pointer uppercase tracking-wider hover:bg-white/90 transition-colors"
                      >
                        Deploy
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handlePurchase(task.id, task.cost, task.name)}
                      className="bg-white text-slate-900 rounded-lg px-2.5 py-1 text-[8px] font-extrabold shadow-xs cursor-pointer uppercase tracking-wider hover:bg-white/90 transition-colors"
                    >
                      Install
                    </button>
                  )}
                </div>
              </div>

              {/* Task info */}
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Motion Path</span>
                <span className="text-[10px] font-bold text-slate-800 truncate block mt-0.5">{task.specialty}</span>
                <span className="text-[8px] text-slate-400 font-semibold block truncate mt-0.5">
                  Recorded via {task.specs.gear} · {task.company}
                </span>
              </div>

              {/* Stats capsule */}
              <div className="bg-slate-50 border border-slate-100 rounded-full py-1.5 px-3 flex items-center justify-around text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                <span className="flex flex-col items-center">
                  <span className="text-slate-800 font-bold text-[9px]">{task.specs.trajectories}</span>
                  <span className="text-[7px] text-slate-400 font-bold scale-90">Paths</span>
                </span>
                <span className="w-[1px] h-3 bg-slate-200" />
                <span className="flex flex-col items-center">
                  <span className="text-slate-800 font-bold text-[9px]">{task.specs.accuracy}</span>
                  <span className="text-[7px] text-slate-400 font-bold scale-90">Accuracy</span>
                </span>
                <span className="w-[1px] h-3 bg-slate-200" />
                <span className="flex flex-col items-center">
                  <span className="text-slate-800 font-bold text-[9px]">{task.specs.size}</span>
                  <span className="text-[7px] text-slate-400 font-bold scale-90">Weight</span>
                </span>
              </div>

              {/* Price footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span>Model Price</span>
                <span className="text-[11px] font-bold text-slate-900">
                  {task.cost === 0 ? "Free" : `${task.cost} Credits`}
                </span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Installation overlay */}
      <AnimatePresence>
        {isInstalling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xl w-full max-w-[330px] text-center space-y-4"
            >
              <div className="w-9 h-9 rounded-full border-2 border-slate-100 border-t-slate-900 animate-spin mx-auto flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 tracking-tight">Installing Motion Model</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  Compiling trajectory vectors for "{isInstalling}"
                </p>
              </div>
              <div className="w-full h-1 bg-slate-100/80 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-slate-900 rounded-full"
                  animate={{ width: `${installProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">
                {installProgress}% compiled
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
