# Series Tracker

**Status:** Heavily in Development - Core functionality implemented, actively adding features

## Project Overview

Series Tracker is a fullstack TypeScript application for tracking arbitrary numerical time series data. The application's abstract design makes it versatile for various use cases - whether tracking calories, spending, exercise minutes, reading minutes, yoga sessions, mood ratings (1-10 scale), or any other quantifiable habit or metric over time.

At its core, a time series is a collection of data points $(t, x)$ where $t$ represents time and $x$ represents the tracked value. The backend architecture supports not only numerical values but also string and boolean data types, providing flexibility for different tracking scenarios.

### Technical Architecture

**Frontend Stack:**
- **TypeScript & React** - Type-safe component architecture
- **Material-UI (MUI)** - Professional UI component library
- **Custom Hooks** - Reusable state management (`useEditableFields`)
- **REST API Integration** - Centralized API communication layer

**Backend Stack:**
- **Node.js & Express** - RESTful API server
- **Prisma ORM** - Type-safe database operations and migrations
- **PostgreSQL** - Relational database with Docker containerization
- **TypeScript** - End-to-end type safety

**DevOps & Development:**
- **Docker & Docker Compose** - Containerized development environment
- **Hot Reload Development** - Rapid iteration capabilities
- **Database Migrations** - Version-controlled schema evolution

### Current Features

- **Interactive Calendar View** - Visual representation of tracked events with date highlighting
- **CRUD Operations** - Complete Create, Read, Update, Delete functionality for both series and events
- **Real-time Updates** - Calendar automatically reflects database changes
- **Flexible Data Types** - Support for numerical, string, and boolean tracking values
- **Database Management** - Proper relational structure with foreign key relationships

### Skills Demonstrated

This project showcases proficiency in:
- **Full-Stack Development** - End-to-end application architecture
- **TypeScript Ecosystem** - Advanced type safety across frontend and backend
- **Database Design** - Relational modeling with Prisma ORM
- **Containerization** - Docker development workflows
- **State Management** - React hooks and component state patterns
- **API Design** - RESTful service architecture
- **Development Workflows** - Hot reload, migrations, and environment management

---

## Installation & Setup

### Prerequisites

- **Node.js** - Latest LTS version recommended
- **Docker & Docker Compose** - For database containerization
- **Git** - For version control

### Development Workflow Overview

This project uses a hybrid development approach:
- **Database**: Runs in Docker container (PostgreSQL)
- **Backend Server**: Runs locally with hot reload for rapid development
- **Frontend**: Standard React development server

This setup provides the best of both worlds: container isolation for the database while maintaining fast iteration cycles for application code.

### Step-by-Step Setup

#### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd SeriesTracker

# Install backend dependencies
cd backend
npm ci

# Install frontend dependencies
cd ../frontend
npm ci
```

#### 2. Environment Configuration

The project uses different environment files for local vs containerized development:

**Backend Local Development (`.env`):**
```env
DATABASE_URL="postgresql://postgres:prisma@localhost:5432/postgres?schema=public"
```

**Backend Docker Production (`.env.prod`):**
```env
DATABASE_URL="postgresql://postgres:prisma@postgres_db:5432/postgres?schema=public"
```

#### 3. Database Setup

```bash
cd backend

# Start PostgreSQL database container
npm run db:start

# Generate Prisma client
npx prisma generate

# Run initial database migrations
npx prisma migrate dev --name init
```

#### 4. Start Development Servers

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run server:start  # Starts with hot reload
```

**Terminal 2 - Frontend Server:**
```bash
cd frontend
npm start  # Opens browser at http://localhost:3000
```

**Terminal 3 - Database Management (optional):**
```bash
cd backend
# Access database directly
docker-compose exec postgres_db psql -U postgres -d postgres
```

### Alternative: Full Docker Setup

For testing production-like environments:

```bash
cd backend
npm run docker:start  # Runs everything in containers
```

---

## Development Commands Reference

### Backend Development

```bash
# === SETUP ===
npm run db:start              # Start database only
npm run server:start          # Start server with hot reload
npx prisma generate           # Generate Prisma client
npm run build                 # Compile TypeScript

# === DATABASE OPERATIONS ===
npx prisma migrate dev --name <description>  # Create new migration
npx prisma migrate reset                     # Reset database
npx prisma studio                           # Open database GUI

# === DOCKER OPERATIONS ===
npm run docker:start          # Start all containers (rebuilds)
npm run docker:stop           # Stop all containers
npm run docker:down           # Stop and remove containers + volumes

# === MONITORING ===
docker-compose logs -f        # View all container logs
docker-compose ps             # Check container status
```

### Frontend Development

```bash
npm start                     # Start development server
npm test                      # Run test suite
npm run build                 # Build for production
```

### Common Development Workflows

**Making Schema Changes:**
1. Edit `backend/prisma/schema.prisma`
2. Run `npx prisma generate`
3. Run `npx prisma migrate dev --name describe_change`
4. Server automatically restarts with new schema

**Adding New Features:**
1. Backend: Add routes in `src/index.ts` or `src/crudController.ts`
2. Frontend: Create components in `src/components/`
3. Both servers auto-reload on file changes

**Database Inspection:**
```bash
# Direct PostgreSQL access
docker-compose exec postgres_db psql -U postgres -d postgres

# Visual database browser
npx prisma studio
```

---

## Project Structure

```
HabitTracker/
├── readme.md                 # This comprehensive guide
├── backend/                  # Express + Prisma API server
│   ├── src/
│   │   ├── index.ts         # Main server file
│   │   ├── crudController.ts # Database operations
│   │   └── prisma.ts        # Database connection
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema definition
│   │   └── migrations/      # Version-controlled DB changes
│   ├── docker-compose.yml   # Container orchestration
│   ├── Dockerfile          # Container build instructions
│   ├── .env                # Local development config
│   └── .env.prod           # Docker container config
├── frontend/                # React + TypeScript UI
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   └── util/           # API and utility functions
│   └── public/             # Static assets
└── shared/                 # Shared TypeScript types
    └── types/              # Common data models
```

---

## Troubleshooting

### Local Development Issues

**Database Connection Problems:**
```bash
# Check if database container is running
docker-compose ps

# View database logs
docker-compose logs postgres_db

# Test database connectivity
docker-compose exec postgres_db pg_isready -U postgres
```

**TypeScript/Prisma Issues:**
```bash
# Regenerate Prisma client
npx prisma generate

# Check for compilation errors
npm run build

# Reset generated files
rm -rf generated/ && npx prisma generate
```

**Port Conflicts:**
```bash
# Check what's using port 3001 (backend)
netstat -ano | findstr :3001

# Check what's using port 5432 (database)
netstat -ano | findstr :5432
```

### Docker Issues

**Containers Won't Start:**
```bash
# Clean slate restart
npm run docker:down
docker system prune -f
npm run docker:start
```

**Database Connection in Docker:**
```bash
# Check container logs
docker-compose logs server
docker-compose logs postgres_db

# Verify network connectivity
docker-compose exec server ping postgres_db
```

**Code Changes Not Reflected:**
```bash
# Rebuild containers with latest code
npm run docker:start  # Always rebuilds
```

### General Recovery

**Complete Reset:**
```bash
# Backend
cd backend
npm run docker:down
rm -rf node_modules generated
npm ci
npx prisma generate
npm run docker:start

# Frontend
cd frontend
rm -rf node_modules
npm ci
npm start
```

---

## Adding Demo Data

You can populate the application with sample data in two ways:

### Through the Frontend UI
1. Start both servers (backend + frontend)
2. Navigate to http://localhost:3000
3. Use the CRUD interface to create series and events

### Direct API Calls
```bash
# Create a new series
curl -X POST http://localhost:3001/series \
  -H "Content-Type: application/json" \
  -d '{"name": "Daily Calories", "description": "Track daily caloric intake"}'

# Add events to the series
curl -X POST http://localhost:3001/events \
  -H "Content-Type: application/json" \
  -d '{"seriesId": 1, "date": "2025-09-26", "value": "2000"}'
```

---

## Future Development Plans

- **Enhanced Visualizations** - Charts and graphs for trend analysis
- **Data Export/Import** - CSV and JSON data portability
- **User Authentication** - Multi-user support with secure sessions
- **Mobile Responsiveness** - Optimized mobile interface
- **Advanced Analytics** - Statistical analysis and insights
- **Goal Setting** - Target tracking and progress monitoring

---

This project demonstrates modern full-stack development practices with emphasis on type safety, developer experience, and scalable architecture. The flexible time series approach showcases understanding of abstract data modeling and its practical applications across various domains.