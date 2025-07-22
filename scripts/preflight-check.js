#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔍 Running preflight checks...\n')

// Check 1: Environment file exists
function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found')
    console.error('   Create it with: cp .env.example .env.local')
    return false
  }
  
  console.log('✅ .env.local file exists')
  return true
}

// Check 2: Required environment variables
function checkRequiredEnvVars() {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]
  
  const missing = required.filter(key => !envContent.includes(key))
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing)
    return false
  }
  
  console.log('✅ Required environment variables are set')
  return true
}

// Check 3: Database URL validation
function checkDatabaseUrl() {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/)
  
  if (!dbUrlMatch) {
    console.warn('⚠️  DATABASE_URL not found - database features will be disabled')
    return true // Not critical for basic functionality
  }
  
  const dbUrl = dbUrlMatch[1]
  
  if (dbUrl.includes('YOUR_PASSWORD') || dbUrl.includes('your_actual_password_here')) {
    console.warn('⚠️  DATABASE_URL contains placeholder password - update with actual credentials')
    return true // Not critical for basic functionality
  }
  
  console.log('✅ DATABASE_URL is properly configured')
  return true
}

// Check 4: Dependencies
function checkDependencies() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const requiredDeps = [
    '@supabase/ssr',
    '@prisma/client',
    'next',
    'react',
    'react-dom'
  ]
  
  const missing = requiredDeps.filter(dep => !packageJson.dependencies[dep] && !packageJson.devDependencies[dep])
  
  if (missing.length > 0) {
    console.error('❌ Missing required dependencies:', missing)
    console.error('   Run: npm install')
    return false
  }
  
  console.log('✅ Required dependencies are installed')
  return true
}

// Check 5: Node version
function checkNodeVersion() {
  const nodeVersion = process.version
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])
  
  if (majorVersion < 18) {
    console.error('❌ Node.js version 18 or higher is required')
    console.error(`   Current version: ${nodeVersion}`)
    return false
  }
  
  console.log(`✅ Node.js version ${nodeVersion} is compatible`)
  return true
}

// Run all checks
function runChecks() {
  const checks = [
    checkEnvFile,
    checkRequiredEnvVars,
    checkDatabaseUrl,
    checkDependencies,
    checkNodeVersion
  ]
  
  const results = checks.map(check => check())
  const passed = results.filter(result => result === true).length
  const total = results.length
  
  console.log(`\n📊 Preflight check results: ${passed}/${total} passed`)
  
  if (passed === total) {
    console.log('🎉 All checks passed! You can start development.')
    process.exit(0)
  } else {
    console.log('❌ Some checks failed. Please fix the issues above.')
    process.exit(1)
  }
}

// Run checks if this script is executed directly
if (require.main === module) {
  runChecks()
}

module.exports = { runChecks } 