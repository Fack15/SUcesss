import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://onteclgdjtwacwzepfat.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9udGVjbGdkanR3YWN3emVwZmF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMjQ2MjcsImV4cCI6MjA2NDgwMDYyN30.DX5mLcHQgo5Xj-O4-ERHAbNM1QJNPYQsdeyveEMf37g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);