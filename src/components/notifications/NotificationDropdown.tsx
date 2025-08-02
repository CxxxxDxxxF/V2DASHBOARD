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
    TrashIcon
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize notifications
    setNotifications(notificationService.getNotifications())
    setUnreadCount(notificationService.getUnreadCount())

    // Subscribe to notification changes
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications)
      setUnreadCount(notificationService.getUnreadCount())
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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

  const handleSimulateNotification = () => {
    notificationService.simulateNewNotification()
  }

  const unreadNotifications = notifications.filter(n => !n.read)
  const readNotifications = notifications.filter(n => n.read)

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <motion.button 
        className="relative p-3 text-gray-600 hover:text-gray-900 bg-white/50 hover:bg-white rounded-xl border border-gray-200/50 transition-all duration-300 hover:shadow-md"
        title="Notifications"
        aria-label="Notifications"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <BellIcon className="h-5 w-5" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span 
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-rutgers-scarlet to-red-600 text-xs font-bold text-white shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-sm z-50 max-h-96 overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <motion.button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Mark all read
                    </motion.button>
                  )}
                  <motion.button
                    onClick={handleSimulateNotification}
                    className="text-xs text-gray-500 hover:text-gray-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Simulate new notification"
                  >
                    + New
                  </motion.button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {unreadCount} unread • {notifications.length} total
              </p>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                  <p className="text-sm text-gray-400 mt-1">We'll notify you when something happens</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {/* Unread Notifications */}
                  {unreadNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      className="p-4 hover:bg-gray-50 transition-colors relative group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center mt-2 space-x-4">
                                <span className="text-xs text-gray-400">
                                  {formatNotificationTime(notification.timestamp)}
                                </span>
                                {notification.action && (
                                  <Link
                                    href={notification.action.href}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {notification.action.label}
                                  </Link>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <motion.button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-green-600 rounded"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Mark as read"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </motion.button>
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
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"></div>
                    </motion.div>
                  ))}

                  {/* Read Notifications */}
                  {readNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      className="p-4 hover:bg-gray-50 transition-colors relative group opacity-75"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 0.75, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center mt-2 space-x-4">
                                <span className="text-xs text-gray-400">
                                  {formatNotificationTime(notification.timestamp)}
                                </span>
                                {notification.action && (
                                  <Link
                                    href={notification.action.href}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {notification.action.label}
                                  </Link>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <Link
                  href="/notifications"
                  className="text-sm text-center text-blue-600 hover:text-blue-800 font-medium block"
                  onClick={() => setIsOpen(false)}
                >
                  View all notifications
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 