"use client"

import { VideoStatus } from "@/types/video"

interface StatusBadgeProps {
  status: VideoStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    analyzed: {
      label: "Analyzed",
      bgClass: "bg-bg-success",
      textClass: "text-text-success"
    },
    pending: {
      label: "Pending",
      bgClass: "bg-bg-warning",
      textClass: "text-text-warning"
    },
    processing: {
      label: "Processing",
      bgClass: "bg-bg-accent",
      textClass: "text-text-accent"
    },
    error: {
      label: "Error",
      bgClass: "bg-bg-danger",
      textClass: "text-text-danger"
    }
  }

  const current = config[status] || config.pending

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[20px] text-[10px] font-semibold tracking-wider leading-none select-none uppercase ${current.bgClass} ${current.textClass}`}>
      {current.label}
    </span>
  )
}
