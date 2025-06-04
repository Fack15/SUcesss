
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://muzshdsgemwtanidrwmn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11enNoZHNnZW13dGFuaWRyd21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjI2ODQsImV4cCI6MjA2NDYzODY4NH0.dSV2ZHjdjj1yFwQbPwOLDRLC3IrRn9poA1s5NaxGhYE'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
