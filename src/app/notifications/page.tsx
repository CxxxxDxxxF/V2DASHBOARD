'use client'

import {
    formatNotificationTime,
    getNotificationColor,
    getNotificationIcon,
    notificationService,
    type Notification
} from '@/lib/notifications'
import {
    BellIcon,
    EyeIcon,
    FunnelIcon,
    TrashIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [categoryFilter, setCategoryFilter] = useState<Notification['category'] | 'all'>('all')
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Initialize notifications
    setNotifications(notificationService.getNotifications())

    // Subscribe to notification changes
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications)
    })

    return unsubscribe
  }, [])

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id)
  }

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead()
  }

  const handleDeleteNotification = (id: string) => {
    notificationService.deleteNotification(id)
  }

  const handleDeleteSelected = () => {
    selectedNotifications.forEach(id => {
      notificationService.deleteNotification(id)
    })
    setSelectedNotifications(new Set())
  }

  const handleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set())
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)))
    }
  }

  const handleSelectNotification = (id: string) => {
    const newSelected = new Set(selectedNotifications)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedNotifications(newSelected)
  }

  const handleSimulateNotification = () => {
    notificationService.simulateNewNotification()
  }

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read)
    
    const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter
    
    return matchesFilter && matchesCategory
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const readCount = notifications.filter(n => n.read).length

  const categories = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'post', label: 'Posts', count: notifications.filter(n => n.category === 'post').length },
    { id: 'task', label: 'Tasks', count: notifications.filter(n => n.category === 'task').length },
    { id: 'analytics', label: 'Analytics', count: notifications.filter(n => n.category === 'analytics').length },
    { id: 'system', label: 'System', count: notifications.filter(n => n.category === 'system').length },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-soft"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rutgers-scarlet to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BellIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Notifications</h1>
                <p className="text-gray-600 mt-1">
                  {unreadCount} unread • {notifications.length} total
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={handleSimulateNotification}
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                + Simulate
              </motion.button>
              {unreadCount > 0 && (
                <motion.button
                  onClick={handleMarkAllAsRead}
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Mark All Read
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-soft"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </h2>
            {selectedNotifications.size > 0 && (
              <motion.button
                onClick={handleDeleteSelected}
                className="text-red-600 hover:text-red-800 font-medium flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete Selected ({selectedNotifications.size})
              </motion.button>
            )}
          </div>

          {/* Status Filters */}
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            {[
              { id: 'all', label: 'All', count: notifications.length },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'read', label: 'Read', count: readCount }
            ].map((status) => (
              <motion.button
                key={status.id}
                onClick={() => setFilter(status.id as any)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filter === status.id
                    ? 'bg-gradient-to-r from-rutgers-scarlet to-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status.label} ({status.count})
              </motion.button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setCategoryFilter(category.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  categoryFilter === category.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.label} ({category.count})
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-soft overflow-hidden"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* List Header */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-rutgers-scarlet rounded border-gray-300 focus:ring-rutgers-scarlet"
                title="Select all notifications"
              />
              <span className="text-sm font-medium text-gray-700">
                {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
              </span>
            </label>
          </div>
          </div>

          {/* Notifications */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No notifications found</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors relative group ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                                         <div className="flex items-start space-x-4">
                       <label className="flex items-start cursor-pointer">
                         <input
                           type="checkbox"
                           checked={selectedNotifications.has(notification.id)}
                           onChange={() => handleSelectNotification(notification.id)}
                           className="mt-1 w-4 h-4 text-rutgers-scarlet rounded border-gray-300 focus:ring-rutgers-scarlet"
                           title={`Select notification: ${notification.title}`}
                         />
                       </label>
                      
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center mt-2 space-x-4">
                              <span className="text-xs text-gray-400">
                                {formatNotificationTime(notification.timestamp)}
                              </span>
                              <span className="text-xs text-gray-400 capitalize">
                                {notification.category}
                              </span>
                              {notification.action && (
                                <Link
                                  href={notification.action.href}
                                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  {notification.action.label}
                                </Link>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <motion.button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-green-600 rounded"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Mark as read"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </motion.button>
                            )}
                            <motion.button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Delete notification"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"></div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 