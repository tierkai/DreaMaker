import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://mvbxxuoonqaomwqdwsmk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Ynh4dW9vbnFhb213cWR3c21rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDYyMjcsImV4cCI6MjA3NzIyMjIyN30.OtLhEh5O3d3pxey9m2OTVCW6bU1R_HpfR_YvUqOqPbI"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
