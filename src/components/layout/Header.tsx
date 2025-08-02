'use client'

import NotificationDropdown from '@/components/notifications/NotificationDropdown'
import { authService } from '@/lib/authService'
import {
    ArrowRightOnRectangleIcon,
    CogIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline'
import { User } from '@supabase/supabase-js'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    }
    getUser()

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await authService.signOut()
    router.replace('/auth/signin')
  }

  const currentTime = new Date()
  const greeting = currentTime.getHours() < 12 ? 'Good morning' : 
                   currentTime.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <motion.header 
      className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 shadow-soft"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        {/* Enhanced Left Section */}
        <motion.div 
          className="flex items-center space-x-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div>
            <motion.h2 
              className="text-3xl font-bold gradient-text"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Dashboard
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {greeting}, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}! 👋
            </motion.p>
          </div>
          
          {/* Quick Stats */}
          <motion.div 
            className="hidden lg:flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-xl border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">System Online</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-700">Live Data</span>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Enhanced Right Section */}
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Notifications */}
          <NotificationDropdown />
          
          {/* User Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 text-gray-600 hover:text-gray-900 bg-white/50 hover:bg-white rounded-xl border border-gray-200/50 transition-all duration-300 hover:shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-rutgers-scarlet to-red-600 rounded-lg flex items-center justify-center">
                <UserCircleIcon className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>
            </motion.button>
            
            {/* Dropdown Menu */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-sm z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  
                  <div className="p-2">
                    <motion.button
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <UserCircleIcon className="h-4 w-4 mr-3" />
                      Profile
                    </motion.button>
                    <motion.button
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CogIcon className="h-4 w-4 mr-3" />
                      Settings
                    </motion.button>
                  </div>
                  
                  <div className="p-2 border-t border-gray-100">
                    <motion.button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                      Sign out
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      
      {/* Click outside to close menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </motion.header>
  )
} 