'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/authService'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
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

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your social media performance and insights.</p>
      </div>

      {/* Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Rate</h3>
          <div className="text-3xl font-bold text-rutgers-scarlet">12.5%</div>
          <p className="text-sm text-gray-600 mt-2">+2.3% from last month</p>
        </div>

        {/* Reach Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Reach</h3>
          <div className="text-3xl font-bold text-rutgers-scarlet">45.2K</div>
          <p className="text-sm text-gray-600 mt-2">+8.7% from last month</p>
        </div>

        {/* Impressions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Impressions</h3>
          <div className="text-3xl font-bold text-rutgers-scarlet">128.9K</div>
          <p className="text-sm text-gray-600 mt-2">+15.2% from last month</p>
        </div>
      </div>

      {/* Platform Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="font-medium">Instagram</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">8.2K</div>
              <div className="text-sm text-gray-600">+12%</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="font-medium">Facebook</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">6.8K</div>
              <div className="text-sm text-gray-600">+8%</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span className="font-medium">Twitter</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">3.1K</div>
              <div className="text-sm text-gray-600">+5%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Analytics Features</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>This is a preview of the analytics dashboard. Real data integration will be available once the database is properly configured.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 