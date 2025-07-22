'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { MockPost } from '@/lib/mock-data'

interface RecentPostsProps {
  posts: MockPost[]
}

export default function RecentPosts({ posts }: RecentPostsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800'
      case 'PENDING_APPROVAL':
        return 'bg-yellow-100 text-yellow-800'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Posts</h3>
        <Link 
          href="/posts" 
          className="text-sm text-rutgers-scarlet hover:text-red-700"
        >
          View all
        </Link>
      </div>
      
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No posts yet</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {post.caption.substring(0, 100)}
                    {post.caption.length > 100 && '...'}
                  </p>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                      {post.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 