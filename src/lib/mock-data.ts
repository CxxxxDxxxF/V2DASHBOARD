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
  tags?: string[]
  contentType?: 'PHOTO' | 'VIDEO' | 'STORY' | 'REEL' | 'CAROUSEL'
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
  category?: 'CONTENT_CREATION' | 'ENGAGEMENT' | 'ANALYTICS' | 'MAINTENANCE' | 'EVENTS'
  estimatedHours?: number
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
  weeklyGrowth: {
    posts: number
    engagement: number
    reach: number
    followers: number
  }
  audienceInsights: {
    ageGroups: { range: string; percentage: number }[]
    topLocations: { city: string; percentage: number }[]
    activeHours: { hour: number; engagement: number }[]
  }
}

// Enhanced sample posts data with realistic golf course content
export const mockPosts: MockPost[] = [
  {
    id: '1',
    caption: 'Perfect day for a round of golf! 🏌️‍♂️⛳️ The course is looking amazing today with our newly renovated greens. Who\'s ready to hit the links? #GolfLife #RutgersGolf #PerfectDay #GolfCourse #NewGreens',
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&h=600&fit=crop',
    platforms: ['FACEBOOK', 'INSTAGRAM'],
    status: 'PUBLISHED',
    publishedAt: '2024-01-15T10:30:00Z',
    engagement: {
      likes: 342,
      comments: 28,
      shares: 15,
      reach: 4200
    },
    author: {
      id: 'user1',
      name: 'John Smith',
      email: 'john@rutgersgolf.com'
    },
    createdAt: '2024-01-15T09:00:00Z',
    tags: ['golf', 'course', 'greens', 'perfect-day'],
    contentType: 'PHOTO'
  },
  {
    id: '2',
    caption: '🚨 SPECIAL OFFER ALERT! 🚨\n\nNew golf lesson packages available! 🎯 Perfect for beginners and intermediate players. Book your session today and improve your game with our PGA-certified instructors.\n\n📞 Call: (555) 123-4567\n🌐 Book online: rutgersgolf.com\n\n#GolfLessons #ImproveYourGame #PGALessons #GolfPro #RutgersGolf',
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
    createdAt: '2024-01-16T11:00:00Z',
    tags: ['lessons', 'offer', 'pga', 'booking'],
    contentType: 'CAROUSEL'
  },
  {
    id: '3',
    caption: '🏆 Tournament Results! 🏆\n\nCongratulations to our winners from this weekend\'s Spring Championship:\n\n🥇 1st Place: Mike Johnson (72)\n🥈 2nd Place: Sarah Davis (74)\n🥉 3rd Place: Tom Wilson (75)\n\nAmazing golf played by everyone! Next tournament: Memorial Day Classic. #GolfTournament #Championship #RutgersGolf #GolfWinners',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    platforms: ['FACEBOOK', 'INSTAGRAM', 'TWITTER'],
    status: 'PUBLISHED',
    publishedAt: '2024-01-14T16:45:00Z',
    engagement: {
      likes: 189,
      comments: 42,
      shares: 23,
      reach: 2800
    },
    author: {
      id: 'user2',
      name: 'Sarah Johnson',
      email: 'sarah@rutgersgolf.com'
    },
    createdAt: '2024-01-14T15:30:00Z',
    tags: ['tournament', 'winners', 'championship', 'results'],
    contentType: 'PHOTO'
  },
  {
    id: '4',
    caption: '⛳️ Course Maintenance Update ⛳️\n\nOur grounds crew has been working hard to keep the course in top condition. Today\'s focus: Bunkers and fairways.\n\n• Bunkers: Raked and ready\n• Fairways: Mowed and marked\n• Greens: Rolling at 10.5\n\nBook your tee time: rutgersgolf.com #CourseMaintenance #GolfCourse #RutgersGolf #GroundsCrew',
    platforms: ['FACEBOOK', 'INSTAGRAM'],
    status: 'PUBLISHED',
    publishedAt: '2024-01-13T08:15:00Z',
    engagement: {
      likes: 156,
      comments: 12,
      shares: 8,
      reach: 2100
    },
    author: {
      id: 'user3',
      name: 'Mike Wilson',
      email: 'mike@rutgersgolf.com'
    },
    createdAt: '2024-01-13T07:00:00Z',
    tags: ['maintenance', 'course', 'bunkers', 'fairways'],
    contentType: 'PHOTO'
  },
  {
    id: '5',
    caption: '🎥 NEW VIDEO: Pro Tips with Coach Davis! 🎥\n\nLearn the perfect putting technique in under 2 minutes. Our head pro shares his secrets for sinking more putts.\n\nWatch the full video on our YouTube channel!\n\n#GolfTips #Putting #ProTips #GolfInstruction #RutgersGolf',
    platforms: ['FACEBOOK', 'INSTAGRAM', 'YOUTUBE'],
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
    createdAt: '2024-01-17T14:20:00Z',
    tags: ['video', 'tips', 'putting', 'instruction'],
    contentType: 'VIDEO'
  },
  {
    id: '6',
    caption: '🌅 Sunrise at Rutgers Golf Course 🌅\n\nThere\'s nothing quite like an early morning round. The course is peaceful, the air is crisp, and the views are spectacular.\n\nEarly bird special: 20% off before 8 AM!\n\n#SunriseGolf #EarlyBird #GolfViews #RutgersGolf #MorningGolf',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    platforms: ['INSTAGRAM', 'FACEBOOK'],
    status: 'PUBLISHED',
    publishedAt: '2024-01-12T06:30:00Z',
    engagement: {
      likes: 423,
      comments: 31,
      shares: 19,
      reach: 5200
    },
    author: {
      id: 'user1',
      name: 'John Smith',
      email: 'john@rutgersgolf.com'
    },
    createdAt: '2024-01-12T05:45:00Z',
    tags: ['sunrise', 'morning', 'views', 'early-bird'],
    contentType: 'PHOTO'
  },
  {
    id: '7',
    caption: '🏌️‍♀️ Ladies Golf Clinic - This Saturday! 🏌️‍♀️\n\nJoin us for a fun morning of golf instruction, networking, and coffee!\n\n📅 Saturday, January 20th\n⏰ 9:00 AM - 11:00 AM\n💰 $45 per person\n\nPerfect for beginners and intermediate players. Equipment provided.\n\nRSVP: (555) 123-4567\n\n#LadiesGolf #GolfClinic #WomenInGolf #RutgersGolf #GolfCommunity',
    platforms: ['FACEBOOK', 'INSTAGRAM', 'TWITTER'],
    status: 'DRAFT',
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
    createdAt: '2024-01-16T16:00:00Z',
    tags: ['ladies', 'clinic', 'event', 'instruction'],
    contentType: 'CAROUSEL'
  },
  {
    id: '8',
    caption: '🍔 New Menu Alert! 🍔\n\nOur clubhouse restaurant has a new seasonal menu featuring local ingredients and chef\'s specials.\n\nHighlights:\n• Grilled Salmon Salad\n• Classic Club Sandwich\n• Homemade Apple Pie\n\nPerfect for post-round dining! #Clubhouse #GolfFood #LocalIngredients #RutgersGolf',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    platforms: ['FACEBOOK', 'INSTAGRAM'],
    status: 'PUBLISHED',
    publishedAt: '2024-01-11T12:00:00Z',
    engagement: {
      likes: 267,
      comments: 38,
      shares: 14,
      reach: 3400
    },
    author: {
      id: 'user3',
      name: 'Mike Wilson',
      email: 'mike@rutgersgolf.com'
    },
    createdAt: '2024-01-11T10:30:00Z',
    tags: ['food', 'menu', 'clubhouse', 'dining'],
    contentType: 'PHOTO'
  }
]

// Enhanced tasks with more realistic golf course operations
export const mockTasks: MockTask[] = [
  {
    id: '1',
    title: 'Create Spring Tournament Social Media Campaign',
    description: 'Design and schedule social media posts for the upcoming Spring Championship tournament. Include registration info, prize details, and course highlights.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2024-01-25T17:00:00Z',
    assignedTo: {
      id: 'user1',
      name: 'John Smith',
      email: 'john@rutgersgolf.com'
    },
    createdAt: '2024-01-15T09:00:00Z',
    category: 'CONTENT_CREATION',
    estimatedHours: 4
  },
  {
    id: '2',
    title: 'Review and Approve Pro Tips Video Content',
    description: 'Review the new putting instruction video from Coach Davis before publishing. Ensure quality and accuracy of golf instruction.',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '2024-01-18T17:00:00Z',
    assignedTo: {
      id: 'user2',
      name: 'Sarah Johnson',
      email: 'sarah@rutgersgolf.com'
    },
    createdAt: '2024-01-16T14:00:00Z',
    category: 'CONTENT_CREATION',
    estimatedHours: 2
  },
  {
    id: '3',
    title: 'Update Website with New Lesson Pricing',
    description: 'Update the website with new golf lesson package pricing and availability. Coordinate with the pro shop for accurate information.',
    status: 'COMPLETED',
    priority: 'HIGH',
    dueDate: '2024-01-16T17:00:00Z',
    assignedTo: {
      id: 'user3',
      name: 'Mike Wilson',
      email: 'mike@rutgersgolf.com'
    },
    createdAt: '2024-01-14T11:00:00Z',
    category: 'MAINTENANCE',
    estimatedHours: 3
  },
  {
    id: '4',
    title: 'Respond to Customer Reviews and Comments',
    description: 'Monitor and respond to all social media comments, reviews, and messages. Address any concerns and thank positive feedback.',
    status: 'TODO',
    priority: 'URGENT',
    dueDate: '2024-01-17T17:00:00Z',
    assignedTo: {
      id: 'user1',
      name: 'John Smith',
      email: 'john@rutgersgolf.com'
    },
    createdAt: '2024-01-17T08:00:00Z',
    category: 'ENGAGEMENT',
    estimatedHours: 1
  },
  {
    id: '5',
    title: 'Prepare Monthly Analytics Report',
    description: 'Compile monthly social media analytics report for management. Include engagement metrics, growth trends, and recommendations.',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '2024-01-31T17:00:00Z',
    assignedTo: {
      id: 'user2',
      name: 'Sarah Johnson',
      email: 'sarah@rutgersgolf.com'
    },
    createdAt: '2024-01-15T13:00:00Z',
    category: 'ANALYTICS',
    estimatedHours: 5
  },
  {
    id: '6',
    title: 'Coordinate Ladies Golf Clinic Promotion',
    description: 'Work with the events team to promote the upcoming Ladies Golf Clinic. Create promotional materials and social media content.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2024-01-19T17:00:00Z',
    assignedTo: {
      id: 'user3',
      name: 'Mike Wilson',
      email: 'mike@rutgersgolf.com'
    },
    createdAt: '2024-01-16T10:00:00Z',
    category: 'EVENTS',
    estimatedHours: 6
  },
  {
    id: '7',
    title: 'Update Instagram Story Highlights',
    description: 'Update Instagram story highlights with recent course photos, tournament results, and upcoming events.',
    status: 'TODO',
    priority: 'LOW',
    dueDate: '2024-01-20T17:00:00Z',
    assignedTo: {
      id: 'user1',
      name: 'John Smith',
      email: 'john@rutgersgolf.com'
    },
    createdAt: '2024-01-17T15:00:00Z',
    category: 'CONTENT_CREATION',
    estimatedHours: 2
  },
  {
    id: '8',
    title: 'Backup Social Media Content',
    description: 'Create backup of all social media content and assets. Organize files and ensure everything is properly archived.',
    status: 'OVERDUE',
    priority: 'MEDIUM',
    dueDate: '2024-01-15T17:00:00Z',
    assignedTo: {
      id: 'user2',
      name: 'Sarah Johnson',
      email: 'sarah@rutgersgolf.com'
    },
    createdAt: '2024-01-10T14:00:00Z',
    category: 'MAINTENANCE',
    estimatedHours: 3
  }
]

// Enhanced analytics data with realistic golf course metrics
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
  ],
  weeklyGrowth: {
    posts: 12,
    engagement: 456,
    reach: 2400,
    followers: 89
  },
  audienceInsights: {
    ageGroups: [
      { range: '18-24', percentage: 15 },
      { range: '25-34', percentage: 28 },
      { range: '35-44', percentage: 32 },
      { range: '45-54', percentage: 18 },
      { range: '55+', percentage: 7 }
    ],
    topLocations: [
      { city: 'New Brunswick, NJ', percentage: 45 },
      { city: 'Princeton, NJ', percentage: 18 },
      { city: 'Edison, NJ', percentage: 12 },
      { city: 'Piscataway, NJ', percentage: 10 },
      { city: 'Other', percentage: 15 }
    ],
    activeHours: [
      { hour: 6, engagement: 45 },
      { hour: 7, engagement: 78 },
      { hour: 8, engagement: 92 },
      { hour: 9, engagement: 67 },
      { hour: 10, engagement: 54 },
      { hour: 11, engagement: 43 },
      { hour: 12, engagement: 38 },
      { hour: 13, engagement: 41 },
      { hour: 14, engagement: 56 },
      { hour: 15, engagement: 73 },
      { hour: 16, engagement: 89 },
      { hour: 17, engagement: 95 },
      { hour: 18, engagement: 82 },
      { hour: 19, engagement: 67 },
      { hour: 20, engagement: 54 },
      { hour: 21, engagement: 43 },
      { hour: 22, engagement: 32 },
      { hour: 23, engagement: 28 }
    ]
  }
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