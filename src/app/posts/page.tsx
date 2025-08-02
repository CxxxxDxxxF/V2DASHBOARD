'use client'

import { authService } from '@/lib/authService'
import {
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EyeIcon,
    FunnelIcon,
    GlobeAltIcon,
    PencilIcon,
    PlusIcon,
    SparklesIcon,
    TrashIcon,
    UserIcon
} from '@heroicons/react/24/outline'
import { User } from '@supabase/supabase-js'
import { formatDistanceToNow } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

interface Post {
  id: string
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

interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}

export default function PostsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      const url = new URL('/api/posts', window.location.origin)
      if (filter !== 'all') {
        url.searchParams.set('status', filter)
      }
      url.searchParams.set('page', currentPage.toString())
      url.searchParams.set('limit', '10')
      
      const response = await fetch(url.toString())
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
        setPagination(data.pagination)
      }
    } catch (error) {
      // console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }, [filter, currentPage])

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
  }, [user, fetchPosts])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PENDING_APPROVAL':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
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

  const handleDelete = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          fetchPosts()
        }
      } catch (error) {
        // console.error('Error deleting post:', error)
      }
    }
  }

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const filteredPosts = posts.filter(post =>
    post.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Content Management</h1>
                  <p className="text-lg text-gray-600 font-medium">Create, schedule, and manage your social media posts</p>
                </div>
              </div>
              <Link
                href="/posts/new"
                className="btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <PlusIcon className="h-5 w-5" />
                <span>New Post</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Filters and Search */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts by caption or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-rutgers-scarlet/20 focus:border-rutgers-scarlet transition-all duration-300 placeholder-gray-500"
                />
                <SparklesIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-rutgers-scarlet/20 focus:border-rutgers-scarlet transition-all duration-300"
                aria-label="Filter posts by status"
              >
                <option value="all">All Posts</option>
                <option value="DRAFT">Drafts</option>
                <option value="PENDING_APPROVAL">Pending Approval</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="PUBLISHED">Published</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Posts List */}
        {loading ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-flex items-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rutgers-scarlet"></div>
              <span>Loading posts...</span>
            </div>
          </motion.div>
        ) : filteredPosts.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-soft">
              <SparklesIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first social media post</p>
              <Link href="/posts/new" className="btn-primary inline-flex items-center space-x-2">
                <PlusIcon className="h-5 w-5" />
                <span>Create your first post</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(post.status)}`}>
                          {post.status.replace('_', ' ')}
                        </span>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <CalendarIcon className="h-4 w-4" />
                          <span className="text-sm">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-900 mb-3 line-clamp-2 text-lg leading-relaxed">{post.caption}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <GlobeAltIcon className="h-4 w-4" />
                          <span>{getPlatformIcons(post.platforms)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UserIcon className="h-4 w-4" />
                          <span>by {post.author.name}</span>
                        </div>
                        {post.scheduledAt && (
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>Scheduled: {formatDistanceToNow(new Date(post.scheduledAt), { addSuffix: true })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link
                        href={`/posts/${post.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="View post"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/posts/${post.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                        title="Edit post"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete post"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Enhanced Pagination */}
        {pagination.pages > 1 && (
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="relative ml-3 inline-flex items-center rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(currentPage - 1) * pagination.limit + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pagination.limit, pagination.total)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{pagination.total}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-xl px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      let pageNum: number
                      if (pagination.pages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                            currentPage === pageNum
                              ? 'z-10 bg-gradient-to-r from-rutgers-scarlet to-red-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rutgers-scarlet'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.pages}
                      className="relative inline-flex items-center rounded-r-xl px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
} 