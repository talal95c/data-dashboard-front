"use client"

import { FiPlay, FiClock } from "react-icons/fi"

interface VideoCardProps {
  title: string
  duration: string
  thumbnail?: string
  date: string
}

export default function VideoCard({ title, duration, thumbnail, date }: VideoCardProps) {
  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
      <div className="aspect-video bg-gray-100 relative">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiPlay className="text-4xl text-gray-400" />
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <FiClock className="text-xs" />
          {duration}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{date}</p>
      </div>
    </div>
  )
}
