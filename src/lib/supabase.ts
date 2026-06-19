import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl ? createClient(supabaseUrl, supabaseAnonKey) : null as any
export type SupabaseCar = {
  id: string
  title: string
  make: string
  model: string
  year: number
  trim: string | null
  price_isk: number
  mileage_km: number | null
  fuel_type: string | null
  transmission: string | null
  body_type: string | null
  colour: string | null
  exterior_colour: string | null
  interior_colour: string | null
  export type SupabaseCar = {
  id: string
  title: string
  make: string
  model: string
  year: number
  trim: string | null
  price_isk: number
  mileage_km: number | null
  fuel_type: string | null
  transmission: string | null
  body_type: string | null
  colour: string | null
  exterior_colour: string | null
  interior_colour: string | null
