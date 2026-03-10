import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let supabaseClientPromise: Promise<SupabaseClient | null> | null = null

export async function getSupabaseClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) {
    return null
  }

  if (!supabaseClientPromise) {
    supabaseClientPromise = import('@supabase/supabase-js').then(({ createClient }) => {
      return createClient(supabaseUrl!, supabaseAnonKey!)
    })
  }

  return supabaseClientPromise
}
