// Mock data for demo showcase
export interface MockPost {
  id: string
  caption: string
  imageUrl?: string
  platforms: string[]
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED'
  scheduledAt?: string
  publishedAt?: string
  engagement: {
    likes: number
    comments: number
    shares: number
    reach: number
  }
  author: {
    id: string
    name: string
    email: string
  }
  createdAt: string
}

export interface MockTask {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: string
  assignedTo: {
    id: string
    name: string
    email: string
  }
  createdAt: string
}

export interface MockAnalytics {
  totalPosts: number
  totalEngagement: number
  totalReach: number
  averageEngagementRate: number
  topPerformingPost: MockPost
  platformBreakdown: {
    facebook: { posts: number; engagement: number; reach: number }
    instagram: { posts: number; engagement: number; reach: number }
    twitter: { posts: number; engagement: number; reach: number }
    tiktok: { posts: number; engagement: number; reach: number }
  }
  recentTrends: {
    date: string
    engagement: number
    reach: number
  }[]
}

// Sample posts data
export const mockPosts: MockPost[] = [
  {
    id: '1',
    caption: 'Perfect day for a round of golf! 🏌️‍♂️⛳️ The course is looking amazing today. Who\'s ready to hit the links? #GolfLife #RutgersGolf #PerfectDay',
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&h=600&fit=crop',
    platforms: ['FACEBOOK', 'INSTAGRAM'],
    status: 'PUBLISHED',
    publishedAt: '2024-01-15T10:30:00Z',
    engagement: {
      likes: 245,
      comments: 18,
      shares: 12,
      reach: 3200
    },
    author: {
      id: 'user1',
      name: 'John Smith',
      email: 'john@rutgersgolf.com'
    },
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    caption: 'New golf lesson packages available! 🎯 Perfect for beginners and intermediate players. Book your session today and improve your game. #GolfLessons #ImproveYourGame',
    platforms: ['FACEBOOK', 'INSTAGRAM', 'TWITTER'],
    status: 'SCHEDULED',
    scheduledAt: '2024-01-20T14:00:00Z',
    engagement: {
      likes: 0,
      comments: 0,
      shares: 0,
      reach: 0
    },
    author: {
      id: 'user1',
      name: 'John Smith',
      email: 'john@rutgersgolf.com'
    },
    createdAt: '2024-01-16T11:00:00Z'
  },
  {
    id: '3',
    caption: 'Weekend tournament results are in! 🏆 Congratulations to all participants. Check out the highlights from this amazing event. #GolfTournament #WeekendGolf',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop',
    platforms: ['FACEBOOK', 'INSTAGRAM'],
    status: 'PENDING_APPROVAL',
    engagement: {
      likes: 0,
      comments: 0,
      shares: 0,
      reach: 0
    },
    author: {
      id: 'user2',
      name: 'Sarah Johnson',
      email: 'sarah@rutgersgolf.com'
    },
    createdAt: '2024-01-17T16:30:00Z'
  },
  {
    id: '4',
    caption: 'Pro tip: Always keep your head down and follow through! 💪 What\'s your favorite golf tip? Share in the comments below! #GolfTips #ProTips',
    platforms: ['INSTAGRAM', 'TIKTOK'],
    status: 'DRAFT',
    engagement: {
      likes: 0,
      comments: 0,
      shares: 0,
      reach: 0
    },
    author: {
      id: 'user1',
      name: 'John Smith',
      email: 'john@rutgersgolf.com'
    },
    createdAt: '2024-01-18T08:00:00Z'
  },
  {
    id: '5',
    caption: 'Beautiful sunset on the 18th hole! 🌅 There\'s nothing quite like ending your day with a perfect round. #GolfLife #SunsetGolf #BeautifulCourse',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    platforms: ['FACEBOOK', 'INSTAGRAM'],
    status: 'PUBLISHED',
    publishedAt: '2024-01-14T19:00:00Z',
    engagement: {
      likes: 189,
      comments: 23,
      shares: 8,
      reach: 2100
    },
    author: {
      id: 'user2',
      name: 'Sarah Johnson',
      email: 'sarah@rutgersgolf.com'
    },
    createdAt: '2024-01-14T18:30:00Z'
  }
]

// Sample tasks data
export const mockTasks: MockTask[] = [
  {
    id: '1',
    title: 'Create monthly newsletter content',
    description: 'Write engaging content for the February newsletter including course updates and upcoming events.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2024-01-25T17:00:00Z',
    assignedTo: {
      id: 'user1',
      name: 'John Smith',
      email: 'john@rutgersgolf.com'
    },
    createdAt: '2024-01-20T09:00:00Z'
  },
  {
    id: '2',
    title: 'Schedule social media posts for tournament',
    description: 'Create and schedule posts for the upcoming spring tournament across all platforms.',
    status: 'TODO',
    priority: 'URGENT',
    dueDate: '2024-01-22T12:00:00Z',
    assignedTo: {
      id: 'user2',
      name: 'Sarah Johnson',
      email: 'sarah@rutgersgolf.com'
    },
    createdAt: '2024-01-21T10:00:00Z'
  },
  {
    id: '3',
    title: 'Review and approve pending posts',
    description: 'Review 3 pending social media posts and provide feedback or approval.',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    dueDate: '2024-01-19T16:00:00Z',
    assignedTo: {
      id: 'user1',
      name: 'John Smith',
      email: 'john@rutgersgolf.com'
    },
    createdAt: '2024-01-18T14:00:00Z'
  },
  {
    id: '4',
    title: 'Update website with new course photos',
    description: 'Upload and optimize new course photos for the website gallery.',
    status: 'TODO',
    priority: 'LOW',
    dueDate: '2024-01-30T17:00:00Z',
    assignedTo: {
      id: 'user2',
      name: 'Sarah Johnson',
      email: 'sarah@rutgersgolf.com'
    },
    createdAt: '2024-01-20T11:00:00Z'
  },
  {
    id: '5',
    title: 'Analyze social media performance',
    description: 'Generate monthly social media performance report and identify top-performing content.',
    status: 'OVERDUE',
    priority: 'HIGH',
    dueDate: '2024-01-15T17:00:00Z',
    assignedTo: {
      id: 'user1',
      name: 'John Smith',
      email: 'john@rutgersgolf.com'
    },
    createdAt: '2024-01-10T09:00:00Z'
  }
]

// Sample analytics data
export const mockAnalytics: MockAnalytics = {
  totalPosts: 45,
  totalEngagement: 2847,
  totalReach: 15600,
  averageEngagementRate: 6.2,
  topPerformingPost: mockPosts[0],
  platformBreakdown: {
    facebook: { posts: 18, engagement: 1245, reach: 7200 },
    instagram: { posts: 15, engagement: 892, reach: 5400 },
    twitter: { posts: 8, engagement: 456, reach: 2100 },
    tiktok: { posts: 4, engagement: 254, reach: 900 }
  },
  recentTrends: [
    { date: '2024-01-15', engagement: 245, reach: 1200 },
    { date: '2024-01-16', engagement: 189, reach: 980 },
    { date: '2024-01-17', engagement: 312, reach: 1500 },
    { date: '2024-01-18', engagement: 278, reach: 1350 },
    { date: '2024-01-19', engagement: 345, reach: 1680 },
    { date: '2024-01-20', engagement: 298, reach: 1420 },
    { date: '2024-01-21', engagement: 267, reach: 1280 }
  ]
}

// Helper functions
export function getMockPosts(status?: string): MockPost[] {
  if (status) {
    return mockPosts.filter(post => post.status === status)
  }
  return mockPosts
}

export function getMockTasks(status?: string): MockTask[] {
  if (status) {
    return mockTasks.filter(task => task.status === status)
  }
  return mockTasks
}

export function getMockAnalytics(): MockAnalytics {
  return mockAnalytics
} 