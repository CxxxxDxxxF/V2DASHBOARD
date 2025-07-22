# Rutgers Golf Course - Social Media Dashboard

A comprehensive internal social media management platform for Rutgers Golf Course,
featuring AI-powered content creation, multi-platform posting, approval workflows,
and analytics.

## 🚀 Features

### ✅ Currently Working

- **Multi-Platform Selection**: Facebook, Instagram, Twitter, TikTok
- **AI-Powered Content**: OpenAI GPT-3.5 caption generation
- **Content Calendar**: Visual planning with react-big-calendar
- **Post Management**: Create, edit, delete, and schedule posts
- **User Roles**: Content creators, approvers, and admin roles
- **Image Upload**: File upload with preview and management
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🚧 Coming Soon

- **Social Media APIs**: Direct posting to Facebook/Instagram
- **Approval Workflow**: Boss approval system with notifications
- **Analytics Dashboard**: Performance tracking across platforms
- **Task Management**: Priority-based to-do system with AI assistance
- **Image Optimization**: Smart cropping for platform-specific dimensions

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI, Hugging Face
- **Image Processing**: Sharp, SmartCrop
- **Deployment**: Vercel, Railway

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/rutgers-golf-dashboard.git
   cd rutgers-golf-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**

   ```bash
   # Option A: Use the setup script (recommended)
   npm run setup
   
   # Option B: Manual setup
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🗄️ Database Setup

The application uses PostgreSQL with Prisma ORM. Key tables include:

- **Users**: Authentication and role management
- **Posts**: Social media content with approval workflow
- **Tasks**: To-do items with priority system
- **Analytics**: Performance metrics for posts
- **SocialAccounts**: Platform API credentials

### Database Options

### Recommended: Cloud Database (Free)

- **Railway**: Free PostgreSQL database with easy setup
- **Supabase**: Free tier with PostgreSQL and dashboard
- **Neon**: Free serverless PostgreSQL

### Local Development

- Install PostgreSQL locally or use Docker
- Update `DATABASE_URL` in `.env.local`

### Environment Variables Required

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/rutgers_golf_db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# AI Services (Optional for testing)
OPENAI_API_KEY="your-openai-api-key"
HUGGINGFACE_API_KEY="your-huggingface-api-key"
```

## 🔐 Authentication

The platform supports role-based access:

- **Content Creator**: Create and manage posts
- **Approver**: Review and approve content
- **Admin**: Full system access

### Test Users (Created by Setup Script)

- **Admin**: `admin@rutgersgolf.com` / `admin123`
- **Content Creator**: `cristian@rutgersgolf.com` / `creator123`
- **Approver**: `boss@rutgersgolf.com` / `approver123`

## 🤖 AI Integration

- **Caption Generation**: OpenAI GPT-3.5 for engaging captions
- **Hashtag Suggestions**: AI-powered relevant hashtag recommendations
- **Image Optimization**: Smart cropping for platform-specific dimensions
- **Content Ideas**: AI brainstorming for content planning

## 📊 Analytics

Track performance metrics including:

- Engagement rates (likes, comments, shares)
- Reach and impressions
- Follower growth
- Platform-specific insights

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Railway

1. Connect repository to Railway
2. Set up PostgreSQL database
3. Configure environment variables
4. Deploy

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

## 🚀 Quick Start

1. **Set up database** (choose one):

   ```bash
   # Option A: Railway (recommended)
   # 1. Go to railway.app
   # 2. Create new project → PostgreSQL
   # 3. Copy connection string to .env.local
   
   # Option B: Supabase
   # 1. Go to supabase.com
   # 2. Create new project
   # 3. Copy connection string to .env.local
   ```

2. **Initialize the project**:

   ```bash
   npm install
   npm run setup  # Creates database and test users
   npm run dev
   ```

3. **Sign in with test account**:

   - Email: `cristian@rutgersgolf.com`
   - Password: `creator123`

4. **Test the features**:

   - Create a new post: `/posts/new`
   - View calendar: `/calendar`
   - Manage posts: `/posts`

## 📋 Development Roadmap

### Phase 1: MVP ✅ COMPLETE

- [x] Project setup and authentication
- [x] Basic dashboard layout
- [x] User roles and permissions
- [x] Database schema
- [x] NextAuth.js integration
- [x] Responsive UI with Tailwind CSS

### Phase 2: Core Features ✅ COMPLETE

- [x] Content calendar implementation (react-big-calendar)
- [x] Post composer with AI integration (OpenAI GPT-3.5)
- [x] File upload system with image preview
- [x] Multi-platform selection (Facebook, Instagram, Twitter, TikTok)
- [x] Posts management with filtering and search
- [x] Scheduling system (Draft, Schedule, Post Now)
- [x] AI caption generation API

### Phase 3: Social Integration 🚧 IN PROGRESS

- [ ] Facebook/Instagram API integration
- [ ] Auto-cropping and image optimization
- [ ] Multi-platform posting automation
- [ ] Enhanced approval workflow
- [ ] Social media account management

### Phase 4: Advanced Features 📋 PLANNED

- [ ] Analytics dashboard with charts
- [ ] Task management with AI assistance
- [ ] Performance optimization
- [ ] Email notifications
- [ ] Advanced AI features (hashtag suggestions, content ideas)

## 🤝 Contributing

This is an internal tool for Rutgers Golf Course. For questions or contributions,
contact the development team.

## 🐛 Troubleshooting

### Common Issues

### NextAuth Warnings

- Ensure `NEXTAUTH_SECRET` is set in `.env.local`
- Make sure `NEXTAUTH_URL` matches your development URL

### Database Connection

- Verify your `DATABASE_URL` is correct
- For Railway/Supabase, ensure the database is active
- Run `npm run setup` to initialize the database

### AI Features Not Working

- Add your `OPENAI_API_KEY` to `.env.local`
- AI features will fallback to basic enhancement if API is unavailable

### Image Upload Issues

- Currently using base64 storage (for development)
- For production, configure cloud storage (S3, Cloudinary)

## 📄 License

Internal use only - Rutgers Golf Course
