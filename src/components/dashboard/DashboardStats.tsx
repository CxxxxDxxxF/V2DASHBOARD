'use client'

import { MockAnalytics } from '@/lib/mock-data'
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  MapPinIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

interface DashboardStatsProps {
  analytics: MockAnalytics
}

export default function DashboardStats({ analytics }: DashboardStatsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'growth' | 'audience'>('overview')

  const stats = [
    {
      name: 'Total Posts',
      value: analytics.totalPosts.toString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: DocumentTextIcon,
      description: 'Published this month',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
    {
      name: 'Total Engagement',
      value: analytics.totalEngagement.toLocaleString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: ClockIcon,
      description: 'Likes, comments, shares',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      name: 'Total Reach',
      value: analytics.totalReach.toLocaleString(),
      change: '+15%',
      changeType: 'positive' as const,
      icon: CheckCircleIcon,
      description: 'Unique users reached',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      name: 'Avg. Engagement Rate',
      value: `${analytics.averageEngagementRate}%`,
      change: '+0.8%',
      changeType: 'positive' as const,
      icon: ChartBarIcon,
      description: 'Engagement per post',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50'
    },
  ]

  const growthStats = [
    {
      name: 'New Posts',
      value: analytics.weeklyGrowth.posts.toString(),
      change: '+3',
      changeType: 'positive' as const,
      icon: ChartBarIcon,
      description: 'This week',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
    {
      name: 'Engagement Growth',
      value: analytics.weeklyGrowth.engagement.toString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: ChartBarIcon,
      description: 'vs last week',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      name: 'Reach Growth',
      value: analytics.weeklyGrowth.reach.toString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: CheckCircleIcon,
      description: 'vs last week',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      name: 'New Followers',
      value: analytics.weeklyGrowth.followers.toString(),
      change: '+15%',
      changeType: 'positive' as const,
      icon: UserGroupIcon,
      description: 'This week',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50'
    },
  ]

  const audienceStats = [
    {
      name: 'Top Location',
      value: analytics.audienceInsights.topLocations[0].city,
      change: `${analytics.audienceInsights.topLocations[0].percentage}%`,
      changeType: 'neutral' as const,
      icon: MapPinIcon,
      description: 'of audience',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
    {
      name: 'Peak Activity',
      value: `${analytics.audienceInsights.activeHours.reduce((max, hour) => 
        hour.engagement > max.engagement ? hour : max
      ).hour}:00`,
      change: '95%',
      changeType: 'positive' as const,
      icon: ClockIcon,
      description: 'engagement rate',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      name: 'Primary Age Group',
      value: analytics.audienceInsights.ageGroups.reduce((max, group) => 
        group.percentage > max.percentage ? group : max
      ).range,
      change: `${analytics.audienceInsights.ageGroups.reduce((max, group) => 
        group.percentage > max.percentage ? group : max
      ).percentage}%`,
      changeType: 'neutral' as const,
      icon: UserGroupIcon,
      description: 'of audience',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      name: 'Active Hours',
      value: '18',
      change: 'hours',
      changeType: 'neutral' as const,
      icon: ClockIcon,
      description: 'daily activity',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50'
    },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', count: 4 },
    { id: 'growth', label: 'Growth', count: 4 },
    { id: 'audience', label: 'Audience', count: 4 }
  ]

  const getCurrentStats = () => {
    switch (activeTab) {
      case 'growth':
        return growthStats
      case 'audience':
        return audienceStats
      default:
        return stats
    }
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

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" as const }
    }
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="text-center space-y-4">
        <motion.h2 
          className="text-3xl font-bold gradient-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Analytics Dashboard
        </motion.h2>
        <motion.p 
          className="text-gray-600 text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Track your social media performance across all platforms with real-time insights and detailed analytics
        </motion.p>
      </div>

      {/* Enhanced Tab Navigation */}
      <motion.div 
        className="flex justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-soft border border-white/20">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-rutgers-scarlet to-red-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              variants={tabVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
              <span className="ml-2 text-xs opacity-75">({tab.count})</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Stats Grid */}
      <AnimatePresence>
        <motion.div 
          key={activeTab}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.3 }}
        >
          {getCurrentStats().map((item, index) => (
            <motion.div
              key={`${activeTab}-${item.name}`}
              className={`relative overflow-hidden rounded-2xl p-6 shadow-soft hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer bg-gradient-to-br ${item.bgGradient} border border-white/50`}
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
                className={`relative w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg mb-4`}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.2 }
                }}
              >
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </motion.div>

              {/* Content */}
              <div className="relative">
                <dl>
                  <dt className="text-sm font-medium text-gray-600 mb-2">
                    {item.name}
                  </dt>
                  <dd className="flex items-baseline justify-between">
                    <motion.p 
                      className="text-3xl font-bold text-gray-900"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
                    >
                      {item.value}
                    </motion.p>
                    <motion.p
                      className={`text-sm font-semibold ${
                        item.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'
                      }`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                    >
                      {item.change}
                    </motion.p>
                  </dd>
                </dl>
                
                {/* Description */}
                <motion.div 
                  className="mt-4 pt-4 border-t border-gray-200/50"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                >
                  <p className="text-xs text-gray-500">{item.description}</p>
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
      </AnimatePresence>

      {/* Enhanced Platform Breakdown */}
      <AnimatePresence>
        {activeTab === 'overview' && (
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-8 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h4 
              className="text-2xl font-bold text-gray-900 mb-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Platform Performance
            </motion.h4>
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {Object.entries(analytics.platformBreakdown).map(([platform, data], index) => (
                <motion.div 
                  key={platform} 
                  className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "#fef2f2",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div 
                    className="text-2xl font-bold gradient-text mb-2"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </motion.div>
                  <motion.div 
                    className="text-sm text-gray-600 space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <div className="font-semibold text-gray-800">{data.posts} posts</div>
                    <div>{data.engagement.toLocaleString()} engagement</div>
                    <div>{data.reach.toLocaleString()} reach</div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 