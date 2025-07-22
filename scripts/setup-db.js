const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setupDatabase() {
  try {
    console.log('Setting up database...')
    
    // Generate Prisma client
    const { execSync } = require('child_process')
    execSync('npx prisma generate', { stdio: 'inherit' })
    
    // Push schema to database
    execSync('npx prisma db push', { stdio: 'inherit' })
    
    console.log('Database schema created successfully!')
    
    // Note: Users will be created through Supabase Auth
    // These are example auth IDs that would be created when users sign up
    console.log('\n✅ Database setup complete!')
    console.log('\n📝 Next steps:')
    console.log('1. Users will be created automatically when they sign up via Supabase Auth')
    console.log('2. The auth_id field will link Prisma users to Supabase Auth users')
    console.log('3. You can create test users by signing up through the application')
    
  } catch (error) {
    console.error('Error setting up database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase() 