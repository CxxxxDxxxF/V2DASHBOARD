interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'white' | 'rutgers-scarlet'
  text?: string
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'default', 
  text = 'Loading...',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const colorClasses = {
    default: 'border-gray-300 border-t-gray-600',
    white: 'border-white/30 border-t-white',
    'rutgers-scarlet': 'border-gray-300 border-t-rutgers-scarlet'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-2 ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

export function PageLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="lg" text="Loading page..." />
    </div>
  )
}

export function ButtonLoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <LoadingSpinner size="sm" color="white" text="" />
    </div>
  )
} 