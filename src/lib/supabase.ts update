import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  drivetrain: string | null
  engine: string | null
  doors: number | null
  seats: number | null
  description_is: string | null
  images: string[]
  status: string
  location_country: string | null
  source_site: string | null
  source_url: string | null
}
