import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function auth() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("gordon-session")
  if (!sessionCookie) return null
  return {
    user: {
      name: "Chef Gordon",
      email: "chef.gordon@ramarm.ai",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=gordon"
    }
  }
}

export async function signIn(provider: string, options?: { redirectTo?: string }) {
  const cookieStore = await cookies()
  cookieStore.set("gordon-session", `${provider}_mock_token`, { 
    path: "/",
    maxAge: 3600 * 24 // 24 hours
  })
  const redirectTo = options?.redirectTo || "/dashboard"
  redirect(redirectTo)
}

export async function signOut(options?: { redirectTo?: string }) {
  const cookieStore = await cookies()
  cookieStore.delete("gordon-session")
  const redirectTo = options?.redirectTo || "/login"
  redirect(redirectTo)
}

export const handlers = {
  GET: async () => new Response(JSON.stringify({ session: null }), {
    headers: { "Content-Type": "application/json" }
  }),
  POST: async () => new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  })
}
