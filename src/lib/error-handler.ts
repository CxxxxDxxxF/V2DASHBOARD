// Centralized error handling utility

export interface AppError {
  message: string
  code?: string
  details?: any
  timestamp: Date
  userFriendly?: boolean
}

export class AppErrorHandler {
  private static instance: AppErrorHandler
  private errorLog: AppError[] = []

  static getInstance(): AppErrorHandler {
    if (!AppErrorHandler.instance) {
      AppErrorHandler.instance = new AppErrorHandler()
    }
    return AppErrorHandler.instance
  }

  // Handle database errors
  handleDatabaseError(error: any): AppError {
    const appError: AppError = {
      message: 'Database connection failed',
      code: 'DATABASE_ERROR',
      details: error,
      timestamp: new Date(),
      userFriendly: true
    }

    if (error.message?.includes('FATAL: Tenant or user not found')) {
      appError.message = 'Database credentials are invalid or database is not accessible'
      appError.code = 'DATABASE_AUTH_ERROR'
    } else if (error.message?.includes('connection')) {
      appError.message = 'Unable to connect to database'
      appError.code = 'DATABASE_CONNECTION_ERROR'
    }

    this.logError(appError)
    return appError
  }

  // Handle authentication errors
  handleAuthError(error: any): AppError {
    const appError: AppError = {
      message: 'Authentication failed',
      code: 'AUTH_ERROR',
      details: error,
      timestamp: new Date(),
      userFriendly: true
    }

    if (error.message?.includes('Invalid login credentials')) {
      appError.message = 'Invalid email or password'
    } else if (error.message?.includes('Email not confirmed')) {
      appError.message = 'Please check your email and confirm your account'
    }

    this.logError(appError)
    return appError
  }

  // Handle API errors
  handleApiError(error: any): AppError {
    const appError: AppError = {
      message: 'API request failed',
      code: 'API_ERROR',
      details: error,
      timestamp: new Date(),
      userFriendly: true
    }

    if (error.status === 429) {
      appError.message = 'Too many requests. Please try again later.'
      appError.code = 'RATE_LIMIT_ERROR'
    } else if (error.status >= 500) {
      appError.message = 'Server error. Please try again later.'
      appError.code = 'SERVER_ERROR'
    }

    this.logError(appError)
    return appError
  }

  // Handle CSP errors
  handleCSPError(error: any): AppError {
    const appError: AppError = {
      message: 'Content Security Policy violation',
      code: 'CSP_ERROR',
      details: error,
      timestamp: new Date(),
      userFriendly: false
    }

    this.logError(appError)
    return appError
  }

  // Log error for debugging
  private logError(error: AppError) {
    this.errorLog.push(error)
    
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 App Error:', {
        message: error.message,
        code: error.code,
        timestamp: error.timestamp,
        details: error.details
      })
    }
  }

  // Get recent errors
  getRecentErrors(limit: number = 10): AppError[] {
    return this.errorLog.slice(-limit)
  }

  // Clear error log
  clearErrorLog() {
    this.errorLog = []
  }
}

// Convenience functions
export const errorHandler = AppErrorHandler.getInstance()

export function handleError(error: any, context: string = 'unknown'): AppError {
  if (error.message?.includes('database') || error.message?.includes('prisma')) {
    return errorHandler.handleDatabaseError(error)
  } else if (error.message?.includes('auth') || error.message?.includes('supabase')) {
    return errorHandler.handleAuthError(error)
  } else if (error.message?.includes('CSP') || error.message?.includes('Content Security Policy')) {
    return errorHandler.handleCSPError(error)
  } else {
    return errorHandler.handleApiError(error)
  }
}

// React error boundary helper
export function getErrorBoundaryFallback(error: Error) {
  const appError = handleError(error)
  
  return {
    title: 'Something went wrong',
    message: appError.userFriendly ? appError.message : 'An unexpected error occurred',
    code: appError.code
  }
} 