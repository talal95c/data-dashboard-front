"use client"

import { useGordonStore } from "@/store/useGordonStore"
import UploadZone from "@/components/upload/UploadZone"
import GalleryGrid from "@/components/gallery/GalleryGrid"

export default function GalleryPage() {
  const { showUpload } = useGordonStore()

  return (
    <div className="flex flex-col min-h-full pb-10">
      {showUpload && <UploadZone />}
      <GalleryGrid />
    </div>
  )
}
