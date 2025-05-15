  import { createClient } from "@supabase/supabase-js"
  import type { Database } from "./database.types"

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  let clientInstance: ReturnType<typeof createClient<Database>> | null = null

  export const getSupabaseBrowserClient = () => {
    if (!clientInstance) {
      clientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    }
    return clientInstance
  }
