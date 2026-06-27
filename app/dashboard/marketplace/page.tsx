"use client"

import { useState } from "react"
import { useGordonStore } from "@/store/useGordonStore"
import {
  TbPlus,
  TbCheck,
  TbFlame,
  TbScissors,
  TbStar,
  TbDroplet,
  TbVector,
  TbEye,
  TbSparkles
} from "react-icons/tb"
import { motion, AnimatePresence } from "framer-motion"

const chefMarketplace = [
  {
    id: "ramsay",
    name: "Gordon Ramsay",
    restaurant: "Restaurant Gordon Ramsay, London",
    title: "Master Chef Trajectory Pack",
    specialty: "High-Intensity Searing & Wok Cooking",
    level: 99,
    cost: 0,
    icon: TbFlame,
    avatar: "/gordon ramsey.jpg",
    specs: {
      trajectories: "184 Paths",
      gear: "Ray-Ban Meta v2",
      size: "12.4 GB",
      accuracy: "99.2%"
    },
    skills: [
      { name: "Steak Searing (Aggressive)", value: 99 },
      { name: "Pan Deglazing (High Heat)",  value: 95 },
      { name: "Chopping Pace",              value: 85 }
    ]
  },
  {
    id: "bocuse",
    name: "Paul Bocuse",
    restaurant: "L'Auberge du Pont de Collonges, Lyon",
    title: "French Classical Trajectory Pack",
    specialty: "Precision Sauces & Sauce Plating",
    level: 98,
    cost: 150,
    icon: TbStar,
    avatar: "/paul-bocuse.jpg",
    specs: {
      trajectories: "248 Paths",
      gear: "Ray-Ban Meta Pro",
      size: "18.1 GB",
      accuracy: "98.7%"
    },
    skills: [
      { name: "Sauce Plating (Precision)", value: 98 },
      { name: "Slow Reduction Control",    value: 96 },
      { name: "Micro-Greens Dressing",     value: 94 }
    ]
  },
  {
    id: "ducasse",
    name: "Alain Ducasse",
    restaurant: "Le Louis XV, Monte Carlo",
    title: "Michelin 3-Star Trajectory Pack",
    specialty: "Haute Cuisine Broths & Roasting",
    level: 97,
    cost: 130,
    icon: TbDroplet,
    avatar: "/Alain-Ducasse.jpg",
    specs: {
      trajectories: "210 Paths",
      gear: "Ray-Ban Meta v2",
      size: "15.4 GB",
      accuracy: "97.8%"
    },
    skills: [
      { name: "High-Precision Roasting",   value: 97 },
      { name: "Classical Broth Simmering", value: 94 },
      { name: "Herb Dressing",             value: 90 }
    ]
  },
  {
    id: "bottura",
    name: "Massimo Bottura",
    restaurant: "Osteria Francescana, Modena",
    title: "Avant-Garde Trajectory Pack",
    specialty: "Modernist Plating & Pastry Dressing",
    level: 96,
    cost: 110,
    icon: TbSparkles,
    avatar: "/massimo.jpg",
    specs: {
      trajectories: "192 Paths",
      gear: "Ray-Ban Meta v2",
      size: "14.2 GB",
      accuracy: "96.5%"
    },
    skills: [
      { name: "Modernist Sauce Splattering",  value: 96 },
      { name: "Deconstructed Pastry Piping",  value: 95 },
      { name: "Symmetric Herb Dressing",      value: 92 }
    ]
  },
  {
    id: "etchebest",
    name: "Philippe Etchebest",
    restaurant: "Quatrième Mur, Bordeaux",
    title: "Bistro Mastery Trajectory Pack",
    specialty: "Fast Rustic Cuts & Sauce Dressing",
    level: 91,
    cost: 70,
    icon: TbScissors,
    avatar: "/phlipe etchebest.jpg",
    specs: {
      trajectories: "136 Paths",
      gear: "Ray-Ban Meta v1",
      size: "9.8 GB",
      accuracy: "94.1%"
    },
    skills: [
      { name: "Rustic Herb Chopping (Speed)", value: 91 },
      { name: "Quick Olive Oil Drizzle",      value: 87 },
      { name: "Fast Pan Tossing",             value: 83 }
    ]
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
  const [isInstalling, setIsInstalling]     = useState<string | null>(null)
  const [installProgress, setInstallProgress] = useState(0)

  const {
    activeChef,
    purchasedChefs,
    robotCredits,
    setActiveChef,
    purchaseChef,
    addCredits,
    addToast
  } = useGordonStore()

  const handlePurchase = (chefId: string, cost: number, chefName: string) => {
    if (robotCredits < cost) {
      addToast("Insufficient credits! Please add more credits.", "error")
      return
    }

    setIsInstalling(chefName)
    setInstallProgress(0)

    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setInstallProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        addCredits(-cost)
        purchaseChef(chefName)
        setActiveChef(chefName)
        setIsInstalling(null)
        addToast(`Dataset installed: Active arm trajectory updated to ${chefName}!`, "success")
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
          onClick={() => {
            addCredits(100)
            addToast("Added 100 Credits to balance", "success")
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-all active:scale-[0.98]"
        >
          <TbPlus className="text-xs stroke-[2.5]" />
          <span>Get +100 Credits</span>
        </button>
      </motion.div>

      {/* Chef cards grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {chefMarketplace.map((chef) => {
          const isPurchased = purchasedChefs.includes(chef.name)
          const isActive    = activeChef === chef.name

          return (
            <motion.div
              key={chef.id}
              variants={cardVariants}
              whileHover={{ y: -3, scale: 1.01, boxShadow: "0 10px 20px -5px rgba(0,0,0,0.04)" }}
              whileTap={{ scale: 0.995 }}
              transition={{ type: "spring", stiffness: 420, damping: 25 }}
              className={`bg-white border rounded-[22px] p-4 flex flex-col justify-between space-y-4 shadow-xs relative text-left transition-colors duration-150 ${
                isActive ? "border-slate-400" : "border-slate-200/80"
              }`}
            >
              {/* Card cover panel — chef photo fills the rectangle */}
              <div className="relative w-full h-[135px] rounded-xl overflow-hidden flex flex-col justify-between p-3">
                {/* Chef photo background */}
                <img
                  src={chef.avatar}
                  alt={chef.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark gradient overlay for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

                {/* Level badge */}
                <div className="w-full flex items-center justify-between relative z-10">
                  <span className="text-[8px] bg-white/15 backdrop-blur-sm text-white rounded-full px-2 py-0.5 font-bold tracking-wider border border-white/20 uppercase">
                    Lvl {chef.level}
                  </span>
                </div>

                {/* Name + action button */}
                <div className="w-full flex items-end justify-between relative z-10">
                  <div className="min-w-0 pr-2">
                    <h4 className="text-[11px] font-extrabold text-white leading-tight truncate drop-shadow">
                      {chef.name}
                    </h4>
                    <span className="text-[8px] text-white/70 font-semibold truncate block mt-0.5">
                      {chef.restaurant.split(",")[0]}
                    </span>
                  </div>

                  {isPurchased ? (
                    isActive ? (
                      <div className="bg-white/15 backdrop-blur-sm text-white rounded-lg px-2.5 py-1 text-[8px] font-extrabold border border-white/20 uppercase tracking-wider flex items-center gap-1">
                        <TbCheck className="text-[9px] text-emerald-400 stroke-[3]" />
                        <span>Active</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveChef(chef.name)
                          addToast(`Loaded trajectory weights for ${chef.name}`, "info")
                        }}
                        className="bg-white text-slate-900 rounded-lg px-2.5 py-1 text-[8px] font-extrabold shadow-xs cursor-pointer uppercase tracking-wider hover:bg-white/90 transition-colors"
                      >
                        Activate
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handlePurchase(chef.id, chef.cost, chef.name)}
                      className="bg-white text-slate-900 rounded-lg px-2.5 py-1 text-[8px] font-extrabold shadow-xs cursor-pointer uppercase tracking-wider hover:bg-white/90 transition-colors"
                    >
                      Install
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom info row: specialty + avatar */}
              <div className="flex items-center justify-between gap-3 min-w-0">
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Style Trajectory</span>
                  <span className="text-[10px] font-bold text-slate-800 truncate block mt-0.5">
                    {chef.specialty.split(" & ")[0]}
                  </span>
                  <span className="text-[8px] text-slate-400 font-semibold block truncate mt-0.5">
                    Recorded via {chef.specs.gear}
                  </span>
                </div>

              </div>

              {/* Stats capsule */}
              <div className="bg-slate-50 border border-slate-100 rounded-full py-1.5 px-3 flex items-center justify-around text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                <span className="flex flex-col items-center">
                  <span className="text-slate-800 font-bold text-[9px]">{chef.specs.trajectories.split(" ")[0]}</span>
                  <span className="text-[7px] text-slate-400 font-bold scale-90">Paths</span>
                </span>
                <span className="w-[1px] h-3 bg-slate-200" />
                <span className="flex flex-col items-center">
                  <span className="text-slate-800 font-bold text-[9px]">{chef.specs.accuracy}</span>
                  <span className="text-[7px] text-slate-400 font-bold scale-90">Accuracy</span>
                </span>
                <span className="w-[1px] h-3 bg-slate-200" />
                <span className="flex flex-col items-center">
                  <span className="text-slate-800 font-bold text-[9px]">{chef.specs.size}</span>
                  <span className="text-[7px] text-slate-400 font-bold scale-90">Weight</span>
                </span>
              </div>

              {/* Price footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span>Dataset Price</span>
                <span className="text-[11px] font-bold text-slate-900">
                  {chef.cost === 0 ? "Included" : `${chef.cost} Credits`}
                </span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Installation progress overlay */}
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
                <h4 className="text-xs font-bold text-slate-800 tracking-tight">Installing Trajectory Pack</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  Calibrating robotic joint weights for {isInstalling}
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
