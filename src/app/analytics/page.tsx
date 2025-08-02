'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { authService } from '@/lib/authService'
import { getMockAnalytics } from '@/lib/mock-data'
import {
    ArrowTrendingUpIcon,
    ChartBarIcon,
    ChatBubbleLeftIcon,
    EyeIcon,
    GlobeAltIcon,
    HeartIcon,
    ShareIcon,
    SparklesIcon,
    UsersIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>(null)
  const [timeRange, setTimeRange] = useState('30d')
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          // Load mock analytics
          const mockAnalytics = getMockAnalytics()
          setAnalytics(mockAnalytics)
        } else {
          router.replace('/auth/signin')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.replace('/auth/signin')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading analytics..." />
  }

  if (!user) {
    return null // Will redirect to signin
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const
      }
    }
  }

  const metrics = [
    {
      name: 'Engagement Rate',
      value: '12.5%',
      change: '+2.3%',
      changeType: 'positive',
      icon: HeartIcon,
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-50 to-rose-50'
    },
    {
      name: 'Total Reach',
      value: '45.2K',
      change: '+8.7%',
      changeType: 'positive',
      icon: EyeIcon,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
    {
      name: 'Impressions',
      value: '128.9K',
      change: '+15.2%',
      changeType: 'positive',
      icon: ArrowTrendingUpIcon,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      name: 'Total Posts',
      value: analytics?.totalPosts || '24',
      change: '+12%',
      changeType: 'positive',
      icon: ChartBarIcon,
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-50'
    }
  ]

  const platformData = [
    {
      name: 'Instagram',
      followers: '8.2K',
      engagement: '12.5%',
      posts: '15',
      color: 'bg-gradient-to-r from-pink-500 to-purple-600',
      icon: '📷'
    },
    {
      name: 'Facebook',
      followers: '6.8K',
      engagement: '8.3%',
      posts: '12',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      icon: '📘'
    },
    {
      name: 'Twitter',
      followers: '3.1K',
      engagement: '5.7%',
      posts: '8',
      color: 'bg-gradient-to-r from-blue-400 to-blue-500',
      icon: '🐦'
    },
    {
      name: 'TikTok',
      followers: '2.4K',
      engagement: '18.2%',
      posts: '6',
      color: 'bg-gradient-to-r from-black to-gray-800',
      icon: '🎵'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f1f5f9%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative p-6 space-y-8">
        {/* Enhanced Header */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rutgers-scarlet/10 to-red-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-soft">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rutgers-scarlet to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Analytics Dashboard</h1>
                  <p className="text-lg text-gray-600 font-medium">Track your social media performance and insights</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-rutgers-scarlet/20 focus:border-rutgers-scarlet transition-all duration-300"
                  aria-label="Select time range for analytics"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Metrics Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.name}
              className={`relative overflow-hidden rounded-2xl p-6 shadow-soft hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer bg-gradient-to-br ${metric.bgGradient} border border-white/50`}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
              
              {/* Icon */}
              <motion.div
                className={`relative w-12 h-12 bg-gradient-to-br ${metric.gradient} rounded-xl flex items-center justify-center shadow-lg mb-4`}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.2 }
                }}
              >
                <metric.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </motion.div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  {metric.name}
                </h3>
                <div className="flex items-baseline justify-between">
                  <motion.p 
                    className="text-3xl font-bold text-gray-900"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
                  >
                    {metric.value}
                  </motion.p>
                  <motion.p
                    className={`text-sm font-semibold ${
                      metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                  >
                    {metric.change}
                  </motion.p>
                </div>
                
                <motion.div 
                  className="mt-4 pt-4 border-t border-gray-200/50"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                >
                  <p className="text-xs text-gray-500">vs previous period</p>
                </motion.div>
              </div>

              {/* Hover Effect Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Platform Performance */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-8 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.h3 
            className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <GlobeAltIcon className="h-6 w-6 text-rutgers-scarlet" />
            <span>Platform Performance</span>
          </motion.h3>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {platformData.map((platform, index) => (
              <motion.div 
                key={platform.name}
                className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 group"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "#fef2f2",
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 ${platform.color} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                    {platform.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{platform.name}</h4>
                    <p className="text-sm text-gray-500">{platform.followers} followers</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Engagement</span>
                    <span className="font-semibold text-gray-900">{platform.engagement}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Posts</span>
                    <span className="font-semibold text-gray-900">{platform.posts}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced Engagement Breakdown */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-8 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.h3 
            className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <HeartIcon className="h-6 w-6 text-rutgers-scarlet" />
            <span>Engagement Breakdown</span>
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-200"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <HeartIcon className="h-8 w-8 text-pink-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">2,847</div>
              <div className="text-sm text-gray-600">Likes</div>
              <div className="text-xs text-green-600 mt-1">+12.5%</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <ChatBubbleLeftIcon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">1,234</div>
              <div className="text-sm text-gray-600">Comments</div>
              <div className="text-xs text-green-600 mt-1">+8.3%</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <ShareIcon className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">567</div>
              <div className="text-sm text-gray-600">Shares</div>
              <div className="text-xs text-green-600 mt-1">+15.2%</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Audience Insights */}
        {analytics?.audienceInsights && (
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-8 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.h3 
              className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <UsersIcon className="h-6 w-6 text-rutgers-scarlet" />
              <span>Audience Insights</span>
            </motion.h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h4 className="font-semibold text-gray-900 mb-2">Top Location</h4>
                <p className="text-lg font-bold text-purple-600">{analytics.audienceInsights.topLocations[0]?.city || 'New York'}</p>
                <p className="text-sm text-gray-600">{analytics.audienceInsights.topLocations[0]?.percentage || '25'}% of audience</p>
              </motion.div>
              
              <motion.div 
                className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h4 className="font-semibold text-gray-900 mb-2">Peak Activity</h4>
                <p className="text-lg font-bold text-orange-600">7:00 PM</p>
                <p className="text-sm text-gray-600">95% engagement rate</p>
              </motion.div>
              
              <motion.div 
                className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <h4 className="font-semibold text-gray-900 mb-2">Primary Age</h4>
                <p className="text-lg font-bold text-green-600">25-34</p>
                <p className="text-sm text-gray-600">42% of audience</p>
              </motion.div>
              
              <motion.div 
                className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <h4 className="font-semibold text-gray-900 mb-2">Active Hours</h4>
                <p className="text-lg font-bold text-blue-600">18 hours</p>
                <p className="text-sm text-gray-600">daily activity</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Enhanced Coming Soon Notice */}
        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <SparklesIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Advanced Analytics Features</h3>
              <div className="text-blue-800 space-y-2">
                <p>This is a preview of the analytics dashboard. Real data integration will be available once the database is properly configured.</p>
                <p className="text-sm">Coming soon: Real-time data, custom date ranges, export functionality, and advanced reporting.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 