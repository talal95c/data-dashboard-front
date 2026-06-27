"use client"

import { useState } from "react"
import { useGordonStore } from "@/store/useGordonStore"
import { useRouter } from "next/navigation"
import { 
  TbRobot, 
  TbLogout, 
  TbSettings, 
  TbActivity, 
  TbBolt, 
  TbCpu, 
  TbPlus, 
  TbCheck,
  TbFlame,
  TbStar,
  TbDroplet,
  TbEye,
  TbDatabase,
  TbVector,
  TbSparkles,
  TbScissors
} from "react-icons/tb"
import { motion, AnimatePresence } from "framer-motion"

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'robot' | 'marketplace' | 'profile'>('robot')
  const [isInstalling, setIsInstalling] = useState<string | null>(null)
  const [installProgress, setInstallProgress] = useState(0)

  const { 
    user, 
    setUser, 
    setAccessToken, 
    addToast,
    activeChef,
    purchasedChefs,
    robotCredits,
    setActiveChef,
    purchaseChef,
    addCredits,
    gordonStatus,
    setGordonStatus
  } = useGordonStore()

  const handleLogout = async () => {
    document.cookie = "gordon-session=; path=/; max-age=0;"
    setUser(null)
    setAccessToken(null)
    addToast("Logged out successfully.", "info")
    router.push("/login")
  }

  const displayName = user?.name || "Chef Gordon"
  const displayEmail = user?.email || "chef.gordon@ramarm.ai"
  const displayAvatar = user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=gordon"

  // Famous Chefs Trajectory Datasets Configuration
  const chefMarketplace = [
    {
      id: "ramsay",
      name: "Gordon Ramsay",
      restaurant: "Restaurant Gordon Ramsay, London",
      distinction: "3 Michelin Stars",
      philosophy: "Intense precision and flavor-forward modernism by Gordon Ramsay.",
      menuPrice: "Included / Free",
      styleType: "Modern British",
      openingDays: "Mon - Sat",
      level: 99,
      cost: 0,
      icon: TbFlame,
      color: "text-slate-800 bg-slate-50 border border-slate-200",
      avatar: "/gordon ramsey.jpg",
      objectPosition: "object-[center_15%]",
      specs: {
        trajectories: "184 Paths",
        gear: "Ray-Ban Meta v2",
        size: "12.4 GB",
        accuracy: "99.2%"
      },
      skills: [
        { name: "Steak Searing (Aggressive)", value: 99 },
        { name: "Pan Deglazing (High Heat)", value: 95 },
        { name: "Chopping Pace", value: 85 }
      ]
    },
    {
      id: "bocuse",
      name: "Paul Bocuse",
      restaurant: "L'Auberge du Pont de Collonges, Lyon",
      distinction: "Michelin Legend",
      philosophy: "Classic French haute cuisine and legacy by Paul Bocuse.",
      menuPrice: "150 Credits",
      styleType: "French Classical",
      openingDays: "Tue - Sun",
      level: 98,
      cost: 150,
      icon: TbStar,
      color: "text-slate-800 bg-slate-50 border border-slate-200",
      avatar: "/paul-bocuse.jpg",
      specs: {
        trajectories: "248 Paths",
        gear: "Ray-Ban Meta Pro",
        size: "18.1 GB",
        accuracy: "98.7%"
      },
      skills: [
        { name: "Sauce Plating (Precision)", value: 98 },
        { name: "Slow Reduction Control", value: 96 },
        { name: "Micro-Greens Dressing", value: 94 }
      ]
    },
    {
      id: "ducasse",
      name: "Alain Ducasse",
      restaurant: "Le Louis XV, Monte Carlo",
      distinction: "3 Michelin Stars",
      philosophy: "Naturalness, haute cuisine perfection and roasting by Alain Ducasse.",
      menuPrice: "130 Credits",
      styleType: "Haute Cuisine",
      openingDays: "Mon - Fri",
      level: 97,
      cost: 130,
      icon: TbDroplet,
      color: "text-slate-800 bg-slate-50 border border-slate-200",
      avatar: "/Alain-Ducasse.jpg",
      objectPosition: "object-[center_25%]",
      specs: {
        trajectories: "210 Paths",
        gear: "Ray-Ban Meta v2",
        size: "15.4 GB",
        accuracy: "97.8%"
      },
      skills: [
        { name: "High-Precision Roasting", value: 97 },
        { name: "Classical Broth Simmering", value: 94 },
        { name: "Herb Dressing", value: 90 }
      ]
    },
    {
      id: "bottura",
      name: "Massimo Bottura",
      restaurant: "Osteria Francescana, Modena",
      distinction: "3 Michelin Stars",
      philosophy: "Avant-garde visual plating and artful cooking by Massimo Bottura.",
      menuPrice: "110 Credits",
      styleType: "Avant-Garde",
      openingDays: "Tue - Sat",
      level: 96,
      cost: 110,
      icon: TbSparkles,
      color: "text-slate-800 bg-slate-50 border border-slate-200",
      avatar: "/massimo.jpg",
      specs: {
        trajectories: "192 Paths",
        gear: "Ray-Ban Meta v2",
        size: "14.2 GB",
        accuracy: "96.5%"
      },
      skills: [
        { name: "Modernist Sauce Splattering", value: 96 },
        { name: "Deconstructed Pastry Piping", value: 95 },
        { name: "Symmetric Herb Dressing", value: 92 }
      ]
    },
    {
      id: "etchebest",
      name: "Philippe Etchebest",
      restaurant: "Maison Nouvelle, Bordeaux",
      distinction: "Meilleur Ouvrier de France",
      philosophy: "French culinary rigor and Bordeaux terroir by Philippe Etchebest.",
      menuPrice: "70 Credits",
      styleType: "Gastronomic Terroir",
      openingDays: "Mon - Fri",
      level: 92,
      cost: 70,
      icon: TbScissors,
      color: "text-slate-800 bg-slate-50 border border-slate-200",
      avatar: "/phlipe etchebest.jpg",
      specs: {
        trajectories: "135 Paths",
        gear: "Ray-Ban Meta v2",
        size: "9.2 GB",
        accuracy: "95.1%"
      },
      skills: [
        { name: "Steak Grilling (High Heat)", value: 92 },
        { name: "Emulsion Whisking Control", value: 89 },
        { name: "Vegetable Prep Speeds", value: 84 }
      ]
    }
  ]

  // Purchase data handler
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
        
        // Update states
        addCredits(-cost)
        purchaseChef(chefName)
        setActiveChef(chefName)
        
        setIsInstalling(null)
        addToast(`Dataset installed: Active arm trajectory updated to ${chefName}!`, "success")
      }
    }, 250)
  }

  // Active calibration simulation
  const handleCalibrate = () => {
    addToast("Calibrating joint trajectories and vector weights...", "info")
    setGordonStatus("busy")
    setTimeout(() => {
      setGordonStatus("online")
      addToast("Arm alignment optimized successfully.", "success")
    }, 3000)
  }

  // Test motion path
  const handleTestPath = () => {
    addToast("Loading test trajectory vectors...", "info")
    setGordonStatus("busy")
    setTimeout(() => {
      setGordonStatus("online")
      addToast("Trajectory test complete. Motor paths alignment clean.", "success")
    }, 3500)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 280, damping: 24 } as const
    }
  }

  const activeChefConfig = chefMarketplace.find(c => c.name === activeChef) || chefMarketplace[0]

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 select-none relative h-full">
      
      {/* Title & Description */}
      <div className="flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex items-center gap-3"
        >
          <motion.div 
            whileHover={{ scale: 1.06, rotate: [0, -5, 5, 0] }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs cursor-pointer"
          >
            <TbRobot className="text-xl" />
          </motion.div>
          <div>
            <h1 className="text-base font-bold text-slate-800 tracking-tight">Robotic Trajectory Center</h1>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Manage datasets and install chef motor paths captured via Ray-Ban Meta glasses</p>
          </div>
        </motion.div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-100 gap-6 text-xs font-bold text-slate-400 relative">
        <button 
          onClick={() => setActiveTab('robot')} 
          className={`pb-2.5 cursor-pointer relative transition-colors duration-150 ${activeTab === 'robot' ? 'text-slate-950 font-bold' : 'hover:text-slate-700'}`}
        >
          <span>Trajectory Manager</span>
          {activeTab === 'robot' && (
            <motion.div 
              layoutId="activeTabUnderline" 
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-950 z-10" 
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('marketplace')} 
          className={`pb-2.5 cursor-pointer relative transition-colors duration-150 ${activeTab === 'marketplace' ? 'text-slate-950 font-bold' : 'hover:text-slate-700'}`}
        >
          <span>Chef Marketplace</span>
          {activeTab === 'marketplace' && (
            <motion.div 
              layoutId="activeTabUnderline" 
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-950 z-10" 
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('profile')} 
          className={`pb-2.5 cursor-pointer relative transition-colors duration-150 ${activeTab === 'profile' ? 'text-slate-950 font-bold' : 'hover:text-slate-700'}`}
        >
          <span>Account & Devices</span>
          {activeTab === 'profile' && (
            <motion.div 
              layoutId="activeTabUnderline" 
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-950 z-10" 
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      </div>

      {/* Render active Tab */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-5"
        key={activeTab}
      >
        {activeTab === 'robot' && (
          <>
            {/* Trajectory Manager overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Telemetry info */}
              <motion.div variants={cardVariants} className="bg-white border border-slate-200 rounded-xl p-4.5 space-y-3 shadow-xs md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Gordon RamArm v1.0</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    gordonStatus === 'online' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    gordonStatus === 'busy' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-slate-50 text-slate-500 border border-slate-100'
                  }`}>
                    {gordonStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-50/50 border border-slate-100 p-2.5 rounded-lg text-left">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <TbCpu className="text-[10px]" /> Trajectory Accuracy
                    </span>
                    <p className="text-xs font-bold text-slate-700 mt-1">{activeChefConfig.specs.accuracy}</p>
                  </div>
                  <div className="bg-slate-50/50 border border-slate-100 p-2.5 rounded-lg text-left">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <TbDatabase className="text-[10px]" /> Memory Weight
                    </span>
                    <p className="text-xs font-bold text-slate-700 mt-1">{activeChefConfig.specs.size}</p>
                  </div>
                </div>

                {/* Motor calibration buttons */}
                <div className="flex items-center gap-3 pt-3">
                  <button
                    onClick={handleCalibrate}
                    disabled={gordonStatus === 'busy'}
                    className="flex-1 text-center bg-slate-950 hover:bg-slate-800 text-white font-bold text-[10px] py-2 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    Calibrate Trajectories
                  </button>
                  <button
                    onClick={handleTestPath}
                    disabled={gordonStatus === 'busy'}
                    className="flex-1 text-center border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[10px] py-2 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Test Motor Paths
                  </button>
                </div>
              </motion.div>

              {/* Status gauges */}
              <motion.div variants={cardVariants} className="bg-white border border-slate-200 rounded-xl p-4.5 space-y-4 shadow-xs">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Diagnostics</span>
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-slate-500">
                      <span>Joint Battery</span>
                      <span>98%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[98%] h-full bg-slate-900 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-slate-500">
                      <span>Joint Temperature</span>
                      <span>Optimal</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[45%] h-full bg-slate-600 rounded-full" />
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Unlocked Skill Trajectories Matrix */}
            <motion.div variants={cardVariants} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Skill Matrix Trajectories</h3>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Unlocked actions based on the active chef dataset</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-slate-150 bg-slate-50">
                  <span className="text-[9px] font-bold text-slate-700">{activeChef} Active</span>
                </div>
              </div>

              <div className="space-y-3.5">
                {activeChefConfig.skills.map((skill, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                      <span>{skill.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold">Level {skill.value}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.value}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-slate-900 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Active profile card */}
            <motion.div variants={cardVariants} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">Current Cooking Trajectory</h3>
              
              <div className="flex items-center gap-4 bg-[#f7f7f5] p-4 rounded-xl border border-slate-200">
                {/* Photo profile loader */}
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative shadow-xs">
                  <img 
                    src={activeChefConfig.avatar} 
                    alt={activeChefConfig.name} 
                    className={`w-full h-full object-cover ${activeChefConfig.objectPosition || 'object-center'}`} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-800">{activeChefConfig.name}</h4>
                    <span className="text-[8px] bg-slate-900 text-white font-bold px-1 rounded-sm">Lvl {activeChefConfig.level}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 font-semibold">Style: {activeChefConfig.styleType} &bull; {activeChefConfig.distinction}</p>
                  
                  {/* Trajectory vector details list */}
                  <div className="flex items-center gap-4 mt-2.5 text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-0.5"><TbVector className="text-[10px]" /> {activeChefConfig.specs.trajectories}</span>
                    <span className="flex items-center gap-0.5"><TbEye className="text-[10px]" /> {activeChefConfig.specs.gear}</span>
                  </div>
                </div>
                <span className="text-[9px] bg-slate-200 text-slate-600 border border-slate-300 px-2 py-0.5 rounded-[20px] font-bold uppercase">
                  Installed
                </span>
              </div>
            </motion.div>
          </>
        )}

        {activeTab === 'marketplace' && (
          <>
            {/* Credits display header */}
            <motion.div variants={cardVariants} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-xs">
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

            {/* Chefs skill data packs list (Visual structure of inspiration13.jpg adapted for gastronomy specs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chefMarketplace.map((chef) => {
                const isPurchased = purchasedChefs.includes(chef.name)
                const isActive = activeChef === chef.name

                return (
                  <motion.div 
                    key={chef.id}
                    variants={cardVariants} 
                    whileHover={{ y: -3, scale: 1.01, boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.04)" }}
                    whileTap={{ scale: 0.995 }}
                    transition={{ type: "spring", stiffness: 420, damping: 25 }}
                    className={`bg-white border rounded-[22px] p-4 flex flex-col justify-between space-y-4 shadow-xs relative text-left transition-colors duration-150 ${
                      isActive ? 'border-slate-450' : 'border-slate-200/80'
                    }`}
                  >
                    {/* Visual Card Cover Image (Mountain panel structure with linear dark gradient overlay) */}
                    <div className="relative w-full h-[140px] rounded-xl overflow-hidden bg-slate-900 flex flex-col justify-between p-3.5 border border-slate-100 shadow-sm">
                      {/* Photographic background of chef */}
                      <img 
                        src={chef.avatar} 
                        alt={chef.name} 
                        className={`absolute inset-0 w-full h-full object-cover select-none ${chef.objectPosition || 'object-center'}`}
                      />
                      {/* Gradient overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                      {/* Top left rating tag */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-[8px] bg-slate-950/80 text-white rounded-full px-2 py-0.5 font-bold tracking-wider uppercase border border-slate-800">
                          Lvl {chef.level}
                        </span>
                      </div>

                      {/* Bottom Row: Name/Restaurant (Left) + Translucent Pill Button (Right) */}
                      <div className="relative z-10 w-full flex items-end justify-between">
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs font-bold text-white tracking-tight leading-tight truncate">
                            {chef.name}
                          </h4>
                          <span className="text-[9px] text-white/80 font-medium truncate block mt-0.5 leading-none">
                            {chef.restaurant}
                          </span>
                        </div>

                        {/* Translucent pill shape CTA action button (Directions button style) */}
                        {isPurchased ? (
                          isActive ? (
                            <div className="bg-white/20 backdrop-blur-md text-white border border-white/25 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wide">
                              Active
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setActiveChef(chef.name)
                                addToast(`Loaded trajectory weights for ${chef.name}`, "info")
                              }}
                              className="bg-white/25 hover:bg-white/35 backdrop-blur-md text-white border border-white/30 rounded-full px-3 py-1 text-[9px] font-bold cursor-pointer uppercase transition-colors"
                            >
                              Activate
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => handlePurchase(chef.id, chef.cost, chef.name)}
                            className="bg-white text-slate-900 hover:bg-slate-50 border border-white rounded-full px-3 py-1 text-[9px] font-bold cursor-pointer uppercase transition-colors shadow-xs"
                          >
                            Install
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Bottom Details Section */}
                    <div className="flex items-start justify-between gap-3 min-w-0 px-0.5">
                      <div className="min-w-0 space-y-0.5">
                        {/* Distinction Title (Gros) */}
                        <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">
                          {chef.distinction}
                        </h5>
                        {/* Philosophy Description */}
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[210px]">
                          {chef.philosophy}
                        </p>
                      </div>

                      {/* Minimalist line-art Cloche platter icon container */}
                      <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-slate-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m-8.5 12h17a1 1 0 011 1v1a1 1 0 01-1 1h-17a1 1 0 01-1-1v-1a1 1 0 011-1zm1.5-1A7 7 0 0112 7a7 7 0 017 7H5z" />
                        </svg>
                      </div>
                    </div>

                    {/* Horizontal fine separator border-gray-200 */}
                    <div className="border-t border-slate-100/80" />

                    {/* 3-Column horizontal stats area (Distance/Elevation/Duration layout) */}
                    <div className="grid grid-cols-3 gap-5 text-left px-0.5">
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold block">Menu Dégustation</span>
                        <span className="text-[10px] font-bold text-slate-800 mt-1 block">{chef.menuPrice}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold block">Style</span>
                        <span className="text-[10px] font-bold text-slate-800 mt-1 block">{chef.styleType}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold block">Ouverture</span>
                        <span className="text-[10px] font-bold text-slate-800 mt-1 block">{chef.openingDays}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </>
        )}

        {activeTab === 'profile' && (
          <>
            {/* Profile Section */}
            <motion.div variants={cardVariants} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <h2 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                User Profile
              </h2>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <img 
                  src={displayAvatar} 
                  alt="Avatar" 
                  className="w-12 h-12 rounded-lg bg-white border border-slate-250 p-0.5 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-800 truncate">
                    {displayName}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold truncate mt-0.5">
                    {displayEmail}
                  </p>
                </div>
                <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-[20px] font-bold uppercase">
                  Connected
                </span>
              </div>
            </motion.div>

            {/* Device Connection Section */}
            <motion.div variants={cardVariants} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <h2 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Hardware & Integrations
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                      <TbEye className="text-base" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">Ray-Ban Meta Glasses</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Meta live video stream parser</p>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-[20px] font-bold uppercase">
                    Active
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Logout button */}
            <motion.div variants={cardVariants} className="pt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100/70 border border-red-200 text-red-600 hover:text-red-700 font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors"
              >
                <TbLogout className="text-sm" />
                <span>Disconnect Session</span>
              </button>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Installation overlay progress bar */}
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
              className="bg-white border border-slate-200/80 rounded-2xl p-6.5 shadow-xl w-full max-w-[330px] text-center space-y-4"
            >
              {/* Premium Rotating Circle Loader */}
              <div className="w-9 h-9 rounded-full border-2 border-slate-100 border-t-slate-900 animate-spin mx-auto flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 tracking-tight">Installing Trajectory Pack</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  Calibrating robotic joint weights for {isInstalling}
                </p>
              </div>

              {/* Progress bar line */}
              <div className="w-full h-1 bg-slate-100/80 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-slate-900 rounded-full"
                  animate={{ width: `${installProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mt-1">
                {installProgress}% compiled
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
