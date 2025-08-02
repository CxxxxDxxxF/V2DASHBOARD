// Notification types and interfaces
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
  action?: {
    label: string
    href: string
  }
  category: 'post' | 'task' | 'analytics' | 'system'
}

// Mock notifications data
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Post Published',
    message: 'Your post "Perfect day for golf!" has been successfully published on Facebook and Instagram.',
    type: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    action: {
      label: 'View Post',
      href: '/posts'
    },
    category: 'post'
  },
  {
    id: '2',
    title: 'Task Overdue',
    message: 'The task "Backup Social Media Content" is overdue. Please complete it as soon as possible.',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    action: {
      label: 'View Task',
      href: '/tasks'
    },
    category: 'task'
  },
  {
    id: '3',
    title: 'Analytics Update',
    message: 'Your engagement rate has increased by 15% this week. Great job!',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    read: true,
    action: {
      label: 'View Analytics',
      href: '/analytics'
    },
    category: 'analytics'
  },
  {
    id: '4',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight at 2 AM. Service may be briefly interrupted.',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    read: true,
    category: 'system'
  },
  {
    id: '5',
    title: 'Post Approval Required',
    message: 'A new post is waiting for your approval. Please review it within 24 hours.',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    read: false,
    action: {
      label: 'Review Post',
      href: '/posts'
    },
    category: 'post'
  }
]

// Notification service class
class NotificationService {
  private notifications: Notification[] = [...mockNotifications]
  private listeners: Set<(notifications: Notification[]) => void> = new Set()

  // Get all notifications
  getNotifications(): Notification[] {
    return [...this.notifications]
  }

  // Get unread notifications
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(notification => !notification.read)
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(notification => !notification.read).length
  }

  // Mark notification as read
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true
    })
    this.notifyListeners()
  }

  // Delete notification
  deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.notifyListeners()
  }

  // Add new notification
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    this.notifications.unshift(newNotification)
    this.notifyListeners()
  }

  // Subscribe to notification changes
  subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(callback => {
      callback([...this.notifications])
    })
  }

  // Simulate new notifications (for demo purposes)
  simulateNewNotification(): void {
    const types: Notification['type'][] = ['info', 'success', 'warning', 'error']
    const categories: Notification['category'][] = ['post', 'task', 'analytics', 'system']
    const messages = [
      'New comment on your latest post',
      'Weekly analytics report is ready',
      'Task deadline approaching',
      'System update completed successfully',
      'New follower milestone reached'
    ]

    const randomType = types[Math.floor(Math.random() * types.length)]
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]

    this.addNotification({
      title: 'New Update',
      message: randomMessage,
      type: randomType,
      category: randomCategory
    })
  }
}

// Export singleton instance
export const notificationService = new NotificationService()

// Helper functions
export const formatNotificationTime = (timestamp: Date): string => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return timestamp.toLocaleDateString()
}

export const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return '✅'
    case 'warning':
      return '⚠️'
    case 'error':
      return '❌'
    default:
      return 'ℹ️'
  }
}

export const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'warning':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'error':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-blue-600 bg-blue-50 border-blue-200'
  }
} 