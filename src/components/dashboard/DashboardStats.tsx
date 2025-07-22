'use client'

import { 
  DocumentTextIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline'
import { MockAnalytics } from '@/lib/mock-data'

interface DashboardStatsProps {
  analytics: MockAnalytics
}

export default function DashboardStats({ analytics }: DashboardStatsProps) {
  const stats = [
    {
      name: 'Total Posts',
      value: analytics.totalPosts.toString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: DocumentTextIcon,
    },
    {
      name: 'Total Engagement',
      value: analytics.totalEngagement.toLocaleString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: ClockIcon,
    },
    {
      name: 'Total Reach',
      value: analytics.totalReach.toLocaleString(),
      change: '+15%',
      changeType: 'positive' as const,
      icon: CheckCircleIcon,
    },
    {
      name: 'Avg. Engagement Rate',
      value: `${analytics.averageEngagementRate}%`,
      change: '+0.8%',
      changeType: 'positive' as const,
      icon: ChartBarIcon,
    },
  ]

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Overview</h3>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-rutgers-scarlet p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
} 