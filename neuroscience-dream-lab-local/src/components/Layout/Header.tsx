import React from 'react'
import { Bell, User, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'

export function Header() {
  const { user } = useAuthStore()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">神经梦境实验室</h2>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || '访客'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role === 'admin'
                  ? '管理员'
                  : user?.role === 'researcher'
                  ? '研究员'
                  : '观察员'}
              </p>
            </div>
            <div className="relative group">
              <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                <User size={20} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
