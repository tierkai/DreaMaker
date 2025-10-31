import React, { createContext, useContext, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { User } from '../types'

interface AuthContextType {
  user: User | null
}

const AuthContext = createContext<AuthContextType>({ user: null })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    async function loadUser() {
      setLoading(true)
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .maybeSingle()
          
          if (profile) {
            setUser(profile as any)
          }
        }
      } finally {
        setLoading(false)
      }
    }
    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()
            .then(({ data }) => {
              if (data) {
                setUser(data as any)
              }
            })
        } else {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser, setLoading])

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
