import { signIn } from "@/auth"
import { FaGoogle, FaFacebook } from "react-icons/fa"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your Meta glasses videos</p>
        </div>

        <div className="space-y-4">
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/dashboard" })
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <FaGoogle className="text-xl text-black" />
              Continue with Google
            </button>
          </form>

          <form
            action={async () => {
              "use server"
              await signIn("facebook", { redirectTo: "/dashboard" })
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200"
            >
              <FaFacebook className="text-xl" />
              Continue with Facebook
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}
