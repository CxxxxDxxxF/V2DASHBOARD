import DashboardStats from '@/components/dashboard/DashboardStats'
import PendingApprovals from '@/components/dashboard/PendingApprovals'
import RecentPosts from '@/components/dashboard/RecentPosts'
import TaskList from '@/components/dashboard/TaskList'
import { requireAuth } from '@/lib/auth-server'
import { getMockAnalytics, getMockPosts, getMockTasks } from '@/lib/mock-data'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  try {
    const user = await requireAuth()

    // Use mock data for demo purposes
    const posts = getMockPosts()
    const pendingApprovals = getMockPosts('PENDING_APPROVAL')
    const tasks = getMockTasks()
    const analytics = getMockAnalytics()

    return (
      <div className="p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.email}!</h1>
          <p className="text-gray-600">Here&apos;s what&apos;s happening with your social media dashboard.</p>
        </div>

        <DashboardStats analytics={analytics} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentPosts posts={posts.slice(0, 3)} />
          <PendingApprovals approvals={pendingApprovals} />
        </div>
        
        <TaskList tasks={tasks.slice(0, 5)} />

        {/* Demo Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Demo Mode</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>This is a demo showcasing the social media dashboard functionality. All data shown is mock data for demonstration purposes.</p>
                <p className="mt-1">In production, this would connect to real social media APIs and databases.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    // If there's an error, redirect to sign in
    redirect('/auth/signin')
  }
} 