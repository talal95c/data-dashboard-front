import { auth } from "@/auth"
import { FiUpload, FiRefreshCw, FiVideo, FiDatabase, FiClock } from "react-icons/fi"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {session?.user?.name}!
        </h1>
        <p className="text-gray-600">Manage and connect your Meta glasses videos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Total Videos</h3>
            <FiVideo className="text-black text-xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Storage Used</h3>
            <FiDatabase className="text-black text-xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900">0 GB</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Last Connected</h3>
            <FiClock className="text-black text-xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900">Never</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FiUpload className="text-black text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connect Your Meta Glasses
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Connect your Meta glasses to automatically manage your video recordings
            </p>
          </div>

          <div className="space-y-4">
            <button className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200">
              <FiRefreshCw />
              Connect Now
            </button>

            <div className="text-sm text-gray-500">
              <p>Make sure your Meta glasses are connected to the same network</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Videos</h2>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Placeholder for videos - will be populated when backend is connected */}
            <div className="text-center col-span-full text-gray-500 py-8">
              <p>No videos yet. Connect your glasses to see your recordings here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
