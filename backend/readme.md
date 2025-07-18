# Backend - Docker Commands Reference

This README contains all the essential commands to run and manage your Prisma + TypeScript + Docker backend.

## 🚀 Quick Start

### Start the entire application (app + database)
```bash
docker-compose up --build -d
```

### Access your services
- **API**: http://localhost:3001
- **Database**: localhost:5432 (if needed externally)

---

## 📋 Essential Commands

### Start/Stop Commands
```bash
# Start everything in detached mode (runs in background)
docker-compose up --build -d

# Start and view logs in real-time
docker-compose up --build

# Stop everything
docker-compose down

# Stop and remove volumes (clears database data)
docker-compose down -v
```

### Development Commands
```bash
# Rebuild and restart after code changes
docker-compose up --build -d

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f server
docker-compose logs -f postgres_db
```

### Container Management
```bash
# List running containers
docker-compose ps

# Execute command in server container
docker-compose exec server sh

# Execute command in database container
docker-compose exec postgres_db psql -U postgres -d postgres
```

---

## 🔧 Database Commands

### Database Migrations (if needed)
```bash
# Run migrations inside the server container
docker-compose exec server npx prisma migrate dev --name migration_name

# Reset database
docker-compose exec server npx prisma migrate reset
```

### Database Access
```bash
# Connect to PostgreSQL directly
docker-compose exec postgres_db psql -U postgres -d postgres
```

---

## 🛠️ Troubleshooting

### Common Issues
```bash
# If port 5432 is already in use
sudo lsof -i :5432  # Find what's using the port
# Kill the process or change port in docker-compose.yml

# If containers won't start
docker compose -f docker-compose.yml down -v  # Remove volumes
docker compose -f docker-compose.yml up --build -d

# If database connection fails
docker compose -f docker-compose.yml logs postgres_db  # Check DB logs
```

### Clean Restart
```bash
# Nuclear option - remove everything and start fresh
docker-compose down -v
docker system prune -f
docker-compose up --build -d
```

---

## 📁 Project Structure

```
├── src/
│   └── index.ts              # Main TypeScript server file
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── generated/
│   └── prisma_client/        # Generated Prisma client
├── dist/                     # Compiled TypeScript output
├── docker-compose.yml        # Main Docker orchestration
├── Dockerfile                # Container build instructions
├── .env                      # Environment variables
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

---

## 🔄 Typical Development Workflow

1. **Make code changes** in `src/index.ts`
2. **Rebuild and restart**: `docker-compose up --build -d`
3. **Test your changes**: Visit http://localhost:3001 or use curl commands
4. **View logs if needed**: `docker-compose logs -f server`

---

## 🎯 Remember

- **Always use `--build`** when starting to ensure code changes are included
- **Use `-d` flag** to run in background (detached mode)
- **Database data persists** between container restarts (unless you use `-v` flag)
- **No need to run npm commands locally** - everything runs in Docker

---

## 📞 Quick Reference Card

| Task | Command |
|------|---------|
| Start everything | `docker-compose up --build -d` |
| Stop everything | `docker-compose down` |
| View logs | `docker-compose logs -f` |
| Restart after changes | `docker-compose up --build -d` |
| Clean restart | `docker-compose down -v && docker-compose up --build -d` |
| Access API | http://localhost:3001 |