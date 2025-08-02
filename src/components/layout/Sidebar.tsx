'use client'

import { authService } from '@/lib/authService'
import {
    CalendarIcon,
    ChartBarIcon,
    CheckCircleIcon,
    CogIcon,
    DocumentTextIcon,
    HomeIcon,
    SparklesIcon,
    UserIcon
} from '@heroicons/react/24/outline'
import { User } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, badge: null },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon, badge: null },
  { name: 'Posts', href: '/posts', icon: DocumentTextIcon, badge: '12' },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, badge: null },
  { name: 'Tasks', href: '/tasks', icon: CheckCircleIcon, badge: '3' },
  { name: 'Settings', href: '/settings', icon: CogIcon, badge: null },
]

export default function Sidebar() {
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()

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

  return (
    <motion.div 
      className="flex h-full w-64 flex-col bg-gradient-to-b from-white to-gray-50 border-r border-gray-200/50 shadow-soft"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" as const }}
    >
      {/* Enhanced Header */}
      <motion.div 
        className="flex h-20 items-center justify-center border-b border-gray-200/50 bg-gradient-to-r from-rutgers-scarlet/5 to-red-600/5"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-rutgers-scarlet to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">
            Rutgers Golf
          </h1>
        </div>
      </motion.div>
      
      {/* Enhanced Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <motion.div
              key={item.name}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-rutgers-scarlet to-red-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:shadow-md'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                    layoutId="activeIndicator"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-400 group-hover:text-rutgers-scarlet group-hover:scale-110'
                  }`}
                />
                <span className="flex-1">{item.name}</span>
                
                {/* Badge */}
                {item.badge && (
                  <motion.span
                    className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-rutgers-scarlet text-white'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 500 }}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>
      
      {/* Enhanced User Profile */}
      <motion.div 
        className="border-t border-gray-200/50 p-6 bg-white/50 backdrop-blur-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div 
            className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center shadow-md"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <UserIcon className="h-5 w-5 text-white" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.p 
              className="text-sm font-semibold text-gray-900 truncate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
            </motion.p>
            <motion.p 
              className="text-xs text-gray-500 truncate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {user?.email}
            </motion.p>
          </div>
        </div>
        
        {/* Status indicator */}
        <motion.div 
          className="flex items-center mt-3 space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Online</span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
} 