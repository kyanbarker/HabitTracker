# Development vs Production Workflow

This README explains the two different ways to run your backend: **Local Development** (hybrid) and **Docker Production** (containerized).

## 🔧 Local Development Workflow (Recommended for Development)

**What it is:** Server runs locally with hot reload, database runs in Docker
**Best for:** Active development, making frequent code changes

### Quick Start
```bash
# Start only the database
npm run db:start

# Run server locally with hot reload
npm run server:start
```

### Access Points
- **API**: http://localhost:3001
- **Database**: localhost:5432 (accessible from local server)

### Key Benefits
- ✅ **Fast iterations** - Code changes reload automatically
- ✅ **Easy debugging** - Full IDE integration
- ✅ **Quick startup** - No container rebuild needed
- ✅ **TypeScript compilation** - Real-time error checking

---

## 🐳 Docker Production Workflow

**What it is:** Everything runs in containers (server + database)
**Best for:** Testing production setup, deployment simulation

### Quick Start
```bash
# Run everything in Docker
npm run docker:start
```

### Access Points
- **API**: http://localhost:3001
- **Database**: localhost:5432 (port forwarded from container)

### Key Benefits
- ✅ **Production-like environment** - Exact deployment simulation
- ✅ **Isolated dependencies** - No local Node.js required
- ✅ **Easy deployment** - Same setup for all environments
- ✅ **Consistent behavior** - Works the same everywhere

---

## 📋 Commands Reference

### Local Development Commands

```bash
# === SETUP ===
# Start database only
npm run db:start

# Install dependencies (if not done)
npm ci

# Generate Prisma client
npx prisma generate

# === DEVELOPMENT ===
# Start server with hot reload
npm run server:start

# Build TypeScript (for testing)
npm run build

# Run built version locally
npm start

# === DATABASE ===
# Create new migration
npx prisma migrate dev --name describe_change

# Reset database
npx prisma migrate reset

# View database directly
docker-compose exec postgres_db psql -U postgres -d postgres

# === CLEANUP ===
# Stop database
npm run db:stop

# Remove database (loses data)
npm run docker:down
```

### Docker Production Commands

```bash
# === SETUP ===
# Start everything
npm run docker:start

# Start without rebuilding (if containers exist)
docker-compose up -d

# === MONITORING ===
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f server
docker-compose logs -f postgres_db

# Check container status
docker-compose ps

# === DATABASE ===
# Run migrations in container
docker-compose exec server npx prisma migrate dev --name describe_change

# Reset database in container
docker-compose exec server npx prisma migrate reset

# Access database
docker-compose exec postgres_db psql -U postgres -d postgres

# === CLEANUP ===
# Stop all services
npm run docker:stop

# Stop and remove volumes (loses data)
npm run docker:down

# Remove everything and rebuild
npm run docker:down && npm run docker:start
```

---

## 🔄 Common Development Workflows

### Making Code Changes (Local Development)
```bash
# 1. Start database
npm run db:start

# 2. Start server with hot reload
npm run server:start

# 3. Make changes to src/index.ts
# (Server automatically restarts)

# 4. Test changes
curl -X POST http://localhost:3001/events -H "Content-Type: application/json" -d '{"series":"test"}'
```

### Schema Changes (Both Workflows)
```bash
# 1. Edit prisma/schema.prisma

# 2. Generate new client
npx prisma generate

# 3. Create migration
npx prisma migrate dev --name describe_change

# 4. If using Docker production, rebuild
npm run docker:start
```

### Switching Between Workflows
```bash
# From Local to Docker
npm run db:stop
npm run docker:start

# From Docker to Local
npm run docker:stop
npm run db:start
npm run server:start
```

---

## 🐛 Troubleshooting

### Local Development Issues

```bash
# Can't connect to database
docker-compose ps  # Check if postgres_db is running
docker-compose logs postgres_db  # Check database logs

# TypeScript errors
npx prisma generate  # Regenerate client
npm run build  # Check for compilation errors

# Port conflicts
lsof -i :3001  # Check what's using port 3001
lsof -i :5432  # Check what's using port 5432

# Database connection issues
# Make sure .env has: DATABASE_URL="postgresql://postgres:prisma@localhost:5432/postgres?schema=public"
```

### Docker Production Issues

```bash
# Containers won't start
npm run docker:down  # Remove volumes
npm run docker:start  # Rebuild everything

# Database connection issues
docker-compose logs postgres_db  # Check database logs
docker-compose exec postgres_db pg_isready -U postgres  # Test connection

# App won't connect to database
docker-compose logs server  # Check server logs
# Make sure .env.prod has: DATABASE_URL="postgresql://postgres:prisma@postgres_db:5432/postgres?schema=public"

# Code changes not reflected
npm run docker:start  # Always rebuilds containers
```

### General Issues

```bash
# Clean slate restart
npm run docker:down
docker system prune -f
rm -rf node_modules
rm -rf generated
npm ci
npx prisma generate
npm run docker:start

# Check environment files
cat .env  # Should have localhost:5432
cat .env.prod  # Should have postgres_db:5432
```

---

## 📁 Project Structure & Environment Files

```
├── src/
│   └── index.ts              # Main server file
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── .env                      # LOCAL development (localhost:5432)
├── .env.prod                 # DOCKER production (postgres_db:5432)
├── docker-compose.yml        # Container orchestration
├── Dockerfile               # Container build instructions
└── package.json             # Dependencies and scripts
```

### Environment File Contents

**.env (Local Development):**
```env
DATABASE_URL="postgresql://postgres:prisma@localhost:5432/postgres?schema=public"
```

**.env.prod (Docker Production):**
```env
DATABASE_URL="postgresql://postgres:prisma@postgres_db:5432/postgres?schema=public"
```

---

## 🎯 Quick Decision Guide

### Use Local Development When:
- Making frequent code changes
- Debugging with breakpoints
- Testing new features
- Daily development work

### Use Docker Production When:
- Testing before deployment
- Verifying container behavior
- Demonstrating to others
- Final testing phase

---

## 🚀 Quick Reference

| Task | Local Development | Docker Production |
|------|-------------------|-------------------|
| **Start** | `npm run db:start && npm run server:start` | `npm run docker:start` |
| **Stop** | `Ctrl+C` (server) + `npm run db:stop` | `npm run docker:stop` |
| **Logs** | Terminal output + `docker-compose logs postgres_db` | `docker-compose logs -f` |
| **Code Changes** | Automatic reload | `npm run docker:start` |
| **Database Access** | `docker-compose exec postgres_db psql -U postgres -d postgres` | `docker-compose exec postgres_db psql -U postgres -d postgres` |
| **Migrations** | `npx prisma migrate dev --name xyz` | `docker-compose exec server npx prisma migrate dev --name xyz` |

---

## 💡 Pro Tips

1. **Use Local Development for 90% of your work** - it's faster and more convenient
2. **Test in Docker before major releases** - catch container-specific issues
3. **Keep both .env files in sync** - same database structure, different hostnames
4. **Use meaningful migration names** - `add_events_table` not `init`
5. **Check container health** - `docker-compose ps` shows service status
6. **Clean up regularly** - `npm run docker:down` removes old data when needed

---

## 📦 Available NPM Scripts

Here are all the available scripts from `package.json`:

```bash
# Building and Running
npm run build          # Compile TypeScript to dist/
npm start             # Deploy migrations, generate client, and run built app

# Database Management
npm run db:start      # Start only the PostgreSQL database container
npm run db:stop       # Stop the PostgreSQL database container

# Local Development
npm run server:start  # Start server with hot reload using nodemon

# Docker Production
npm run docker:start  # Start all containers (with rebuild)
npm run docker:stop   # Stop all containers
npm run docker:down   # Stop and remove all containers and volumes
```