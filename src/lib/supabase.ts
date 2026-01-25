import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Prevent build from failing if env vars are missing
const url = isSupabaseConfigured ? supabaseUrl! : 'https://placeholder.supabase.co'
const key = isSupabaseConfigured ? supabaseAnonKey! : 'placeholder'

export const supabase = createClient(url, key)
