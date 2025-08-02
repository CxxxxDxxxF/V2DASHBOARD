'use client'

import { authService } from '@/lib/authService'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon, PencilIcon, PlusIcon, Squares2X2Icon, ViewColumnsIcon } from '@heroicons/react/24/outline'
import { User } from '@supabase/supabase-js'
import { addDays, addMonths, addWeeks, format, getDay, parse, startOfWeek, subDays, subMonths, subWeeks } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface Post {
  id: string
  title: string
  caption: string
  status: string
  platforms: string[]
  scheduledAt?: Date
  publishedAt?: Date
  createdAt: Date
  author: {
    name: string
    email: string
  }
}

export default function CalendarPage() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<View>(Views.MONTH)
  const [showPostDetails, setShowPostDetails] = useState(false)

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

  useEffect(() => {
    if (user) {
      fetchPosts()
    }
  }, [user])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const events = posts.map(post => ({
    id: post.id,
    title: post.caption.substring(0, 50) + (post.caption.length > 50 ? '...' : ''),
    start: post.scheduledAt ? new Date(post.scheduledAt) : new Date(),
    end: post.scheduledAt ? new Date(post.scheduledAt) : new Date(),
    post: post,
  }))

  const eventStyleGetter = (event: any) => {
    const post = event.post
    let backgroundColor = '#6B7280' // gray

    switch (post.status) {
      case 'PUBLISHED':
        backgroundColor = '#10B981' // green
        break
      case 'SCHEDULED':
        backgroundColor = '#3B82F6' // blue
        break
      case 'PENDING_APPROVAL':
        backgroundColor = '#F59E0B' // yellow
        break
      case 'DRAFT':
        backgroundColor = '#6B7280' // gray
        break
      case 'REJECTED':
        backgroundColor = '#EF4444' // red
        break
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }

  const handleSelectEvent = (event: any) => {
    setSelectedPost(event.post)
    setShowModal(true)
    setShowPostDetails(false) // Reset to modal view
  }

  const handleSelectSlot = (slotInfo: any) => {
    // Navigate to create new post with pre-filled date
    const date = format(slotInfo.start, 'yyyy-MM-dd')
    window.location.href = `/posts/new?date=${date}`
  }

  const handleEditPost = () => {
    if (selectedPost) {
      // Navigate to the posts page with edit mode
      window.location.href = `/posts?edit=${selectedPost.id}`
    }
  }

  const handleViewPostDetails = () => {
    setShowPostDetails(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedPost(null)
    setShowPostDetails(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800'
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800'
      case 'PENDING_APPROVAL':
        return 'bg-yellow-100 text-yellow-800'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlatformIcons = (platforms: string[]) => {
    const icons: { [key: string]: string } = {
      FACEBOOK: '📘',
      INSTAGRAM: '📷',
      TWITTER: '🐦',
      TIKTOK: '🎵'
    }
    return platforms.map(platform => icons[platform] || '📱').join(' ')
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    let newDate: Date
    switch (currentView) {
      case Views.MONTH:
        newDate = direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1)
        break
      case Views.WEEK:
        newDate = direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1)
        break
      case Views.DAY:
        newDate = direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1)
        break
      default:
        newDate = direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1)
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getViewLabel = () => {
    switch (currentView) {
      case Views.MONTH:
        return format(currentDate, 'MMMM yyyy')
      case Views.WEEK:
        return `Week of ${format(currentDate, 'MMM d, yyyy')}`
      case Views.DAY:
        return format(currentDate, 'EEEE, MMMM d, yyyy')
      default:
        return format(currentDate, 'MMMM yyyy')
    }
  }

  // Show loading or redirect if not authenticated
  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-gray-600">Schedule and manage your social media content</p>
        </div>
        <Link
          href="/posts/new"
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>New Post</span>
        </Link>
      </div>

      {/* Navigation Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-4">
          {/* Date Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              title="Previous"
              aria-label="Go to previous period"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">{getViewLabel()}</h2>
            </div>
            
            <button
              onClick={() => navigateDate('next')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              title="Next"
              aria-label="Go to next period"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Today
            </button>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentView(Views.MONTH)}
              className={`p-2 rounded-md ${
                currentView === Views.MONTH 
                  ? 'bg-rutgers-scarlet text-white' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="Month view"
              aria-label="Switch to month view"
            >
              <Squares2X2Icon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentView(Views.WEEK)}
              className={`p-2 rounded-md ${
                currentView === Views.WEEK 
                  ? 'bg-rutgers-scarlet text-white' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="Week view"
              aria-label="Switch to week view"
            >
              <ViewColumnsIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentView(Views.DAY)}
              className={`p-2 rounded-md ${
                currentView === Views.DAY 
                  ? 'bg-rutgers-scarlet text-white' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="Day view"
              aria-label="Switch to day view"
            >
              <CalendarIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">Published</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Scheduled</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-600">Pending Approval</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span className="text-gray-600">Draft</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">Rejected</span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          popup
          views={['month', 'week', 'day']}
          view={currentView}
          onView={(view: View) => setCurrentView(view)}
          date={currentDate}
          onNavigate={(date: Date) => setCurrentDate(date)}
          step={60}
          timeslots={1}
        />
      </div>

      {/* Post Detail Modal */}
      {showModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {showPostDetails ? 'Post Details' : 'Post Summary'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            
            {!showPostDetails ? (
              // Basic post summary
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Caption:</span>
                  <p className="text-sm text-gray-900 mt-1 line-clamp-3">{selectedPost.caption}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedPost.status)}`}>
                    {selectedPost.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Platforms:</span>
                  <p className="text-sm text-gray-900 mt-1">{getPlatformIcons(selectedPost.platforms)}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Author:</span>
                  <p className="text-sm text-gray-900 mt-1">{selectedPost.author.name}</p>
                </div>
                
                {selectedPost.scheduledAt && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Scheduled for:</span>
                    <p className="text-sm text-gray-900 mt-1">
                      {format(new Date(selectedPost.scheduledAt), 'PPP p')}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Detailed post information
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Full Caption:</span>
                  <p className="text-sm text-gray-900 mt-1 leading-relaxed">{selectedPost.caption}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <div className="mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedPost.status)}`}>
                        {selectedPost.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Platforms:</span>
                    <p className="text-sm text-gray-900 mt-1">{getPlatformIcons(selectedPost.platforms)}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Author Information:</span>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900"><strong>Name:</strong> {selectedPost.author.name}</p>
                    <p className="text-sm text-gray-600"><strong>Email:</strong> {selectedPost.author.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {selectedPost.scheduledAt && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Scheduled Date:</span>
                      <p className="text-sm text-gray-900 mt-1">
                        {format(new Date(selectedPost.scheduledAt), 'PPP')}
                      </p>
                    </div>
                  )}
                  
                  {selectedPost.publishedAt && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Published Date:</span>
                      <p className="text-sm text-gray-900 mt-1">
                        {format(new Date(selectedPost.publishedAt), 'PPP')}
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Created:</span>
                  <p className="text-sm text-gray-900 mt-1">
                    {format(new Date(selectedPost.createdAt), 'PPP p')}
                  </p>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleEditPost}
                className="flex-1 btn-secondary flex items-center justify-center space-x-2"
              >
                <PencilIcon className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleViewPostDetails}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <EyeIcon className="h-4 w-4" />
                <span>{showPostDetails ? 'Show Summary' : 'View Details'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 