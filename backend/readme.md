# Development vs Production Workflow

This README explains the two different ways to run your backend: **Local Development** (hybrid) and **Docker Production** (containerized).

## 🔧 Local Development Workflow (Recommended for Development)

**What it is:** Server runs locally with hot reload, database runs in Docker
**Best for:** Active development, making frequent code changes

### Quick Start
```bash
# Start only the database
docker-compose up postgres_db -d

# Run server locally with hot reload
npm run dev
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
docker-compose up --build -d
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
docker-compose up postgres_db -d

# Install dependencies (if not done)
npm ci

# Generate Prisma client
npx prisma generate

# === DEVELOPMENT ===
# Start server with hot reload
npm run dev

# Build TypeScript (for testing)
npm run build

# Run built version locally
npm run start

# === DATABASE ===
# Create new migration
npx prisma migrate dev --name describe_change

# Reset database
npx prisma migrate reset

# View database directly
docker-compose exec postgres_db psql -U postgres -d postgres

# === CLEANUP ===
# Stop database
docker-compose stop postgres_db

# Remove database (loses data)
docker-compose down postgres_db -v
```

### Docker Production Commands

```bash
# === SETUP ===
# Start everything
docker-compose up --build -d

# Start without rebuilding
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
docker-compose down

# Stop and remove volumes (loses data)
docker-compose down -v

# Remove everything and rebuild
docker-compose down -v && docker-compose up --build -d
```

---

## 🔄 Common Development Workflows

### Making Code Changes (Local Development)
```bash
# 1. Start database
docker-compose up postgres_db -d

# 2. Start server with hot reload
npm run dev

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
docker-compose up --build -d
```

### Switching Between Workflows
```bash
# From Local to Docker
docker-compose stop postgres_db
docker-compose up --build -d

# From Docker to Local
docker-compose down
docker-compose up postgres_db -d
npm run dev
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
docker-compose down -v  # Remove volumes
docker-compose up --build -d  # Rebuild everything

# Database connection issues
docker-compose logs postgres_db  # Check database logs
docker-compose exec postgres_db pg_isready -U postgres  # Test connection

# App won't connect to database
docker-compose logs server  # Check server logs
# Make sure .env.prod has: DATABASE_URL="postgresql://postgres:prisma@postgres_db:5432/postgres?schema=public"

# Code changes not reflected
docker-compose up --build -d  # Always use --build for code changes
```

### General Issues

```bash
# Clean slate restart
docker-compose down -v
docker system prune -f
rm -rf node_modules
rm -rf generated
npm ci
npx prisma generate
docker-compose up --build -d

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
| **Start** | `docker-compose up postgres_db -d && npm run dev` | `docker-compose up --build -d` |
| **Stop** | `Ctrl+C` (server) + `docker-compose stop postgres_db` | `docker-compose down` |
| **Logs** | Terminal output + `docker-compose logs postgres_db` | `docker-compose logs -f` |
| **Code Changes** | Automatic reload | `docker-compose up --build -d` |
| **Database Access** | `docker-compose exec postgres_db psql -U postgres -d postgres` | `docker-compose exec postgres_db psql -U postgres -d postgres` |
| **Migrations** | `npx prisma migrate dev --name xyz` | `docker-compose exec server npx prisma migrate dev --name xyz` |

---

## 💡 Pro Tips

1. **Use Local Development for 90% of your work** - it's faster and more convenient
2. **Test in Docker before major releases** - catch container-specific issues
3. **Keep both .env files in sync** - same database structure, different hostnames
4. **Use meaningful migration names** - `add_events_table` not `init`
5. **Check container health** - `docker-compose ps` shows service status
6. **Clean up regularly** - `docker-compose down -v` removes old data when needed