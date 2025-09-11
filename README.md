// README.md
# IT Inventory Management System

A comprehensive inventory management application built with Next.js, Prisma, and PostgreSQL for tracking IT assets through their complete lifecycle.

## 🚀 Features

- **Asset Lifecycle Management**: Track hardware from setup to retirement
- **Status Workflow Enforcement**: Strict rules for status transitions
- **Automatic Location Assignment**: Locations auto-set based on status
- **User Assignment**: Assign assets to active users
- **History Tracking**: Complete audit trail for all changes
- **Date Logging**: Track important dates for each status

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Deployment**: Vercel

## 📋 Quick Start

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd it-inventory-management
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your Supabase DATABASE_URL
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"
```

### 3. Database Setup
```bash
# Create tables in your database
npm run db:push

# Generate Prisma client
npm run db:generate
```

### 4. Seed Sample Data
```bash
# Option A: Run locally
npx prisma db seed

# Option B: Use API endpoint (after deployment)
curl -X POST https://your-app.vercel.app/api/seed
```

### 5. Development
```bash
npm run dev
# Open http://localhost:3000
```

## 🚀 Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repo to Vercel
   - Add `DATABASE_URL` environment variable
   - Deploy!

3. **Seed Production Database**
   ```bash
   curl -X POST https://your-app.vercel.app/api/seed
   ```

## 📊 Status Workflow

### Asset Statuses
- **Setup** → ToBeDeployed → **InUse**
- **Any Status** → ToBeRepaired → UnderRepair → Repaired
- **Most Statuses** → Retired

### Business Rules
- ✅ One status per asset at a time
- ✅ Locations auto-set by status
- ✅ Every status has correlated dates
- ✅ Edit restrictions for repair/retired states
- ✅ Complete history logging

## 🗄 Database Schema

### Users
- Personal info, role, job status
- Work style (Onsite/Remote/Hybrid)
- Current and home addresses

### Hardware
- Asset details, manufacturer, category
- Status and location tracking
- Comprehensive date logging
- User assignment

### History
- Complete audit trail
- Status change tracking
- Notes and timestamps

## 🔧 Development

```bash
# Database operations
npm run db:push      # Push schema changes
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open database browser

# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
```

## 📝 License

MIT License - feel free to use for your projects!

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**Built with ❤️ using Next.js, Prisma, and Supabase**
