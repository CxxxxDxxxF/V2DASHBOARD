// Environment variable validation utility

export function validateRequiredEnvVars() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing)
    console.error('Please check your .env.local file')
    return false
  }
  
  console.log('✅ Required environment variables are set')
  return true
}

export function validateDatabaseUrl() {
  const dbUrl = process.env.DATABASE_URL
  
  if (!dbUrl) {
    console.warn('⚠️  DATABASE_URL not set - database features will be disabled')
    return false
  }
  
  if (dbUrl.includes('YOUR_PASSWORD') || dbUrl.includes('your_actual_password_here')) {
    console.warn('⚠️  DATABASE_URL contains placeholder password - update with actual credentials')
    return false
  }
  
  console.log('✅ DATABASE_URL is properly configured')
  return true
}

export function checkEnvironment() {
  console.log('🔍 Checking environment configuration...')
  
  const supabaseValid = validateRequiredEnvVars()
  const databaseValid = validateDatabaseUrl()
  
  if (!supabaseValid) {
    throw new Error('Supabase configuration is invalid')
  }
  
  return {
    supabase: supabaseValid,
    database: databaseValid
  }
} 