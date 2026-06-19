import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://fakjyfokweehxsonfbez.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZha2p5Zm9rd2VlaHhzb25mYmV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODk2NzEsImV4cCI6MjA5NTM2NTY3MX0.G5SoqBg4v4HI_bHMJ3bFvdjnk2-nUgSkD2yz_ny-67M'
)
