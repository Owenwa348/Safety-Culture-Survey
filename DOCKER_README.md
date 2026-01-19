# 🐳 Docker Setup Guide

## Prerequisites
- Docker Desktop installed
- Docker Compose installed

## Quick Start

### 1. Setup Environment Variables
```bash
# Copy the example env file
copy .env.example .env

# Edit .env and set your password
DB_PASSWORD=YourSecurePassword123
DB_NAME=safety_survey
```

### 2. Run the Application
```bash
# Start all services (MySQL + Backend + Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 3. Access the Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **MySQL**: localhost:3306

## Useful Commands

```bash
# Rebuild containers after code changes
docker-compose up -d --build

# View running containers
docker ps

# Access backend container shell
docker exec -it safety-survey-backend sh

# Run Prisma migrations manually
docker exec -it safety-survey-backend npx prisma migrate deploy

# View database logs
docker-compose logs mysql

# Stop and remove all containers + volumes
docker-compose down -v
```

## Development Workflow

### Making Code Changes
- Backend code changes: Container will auto-restart if using nodemon
- Frontend code changes: Rebuild with `docker-compose up -d --build frontend`

### Database Migrations
```bash
# Create new migration
docker exec -it safety-survey-backend npx prisma migrate dev --name your_migration_name

# Apply migrations
docker exec -it safety-survey-backend npx prisma migrate deploy
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if MySQL is ready
docker-compose logs mysql

# Restart backend
docker-compose restart backend
```

### Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :5000
netstat -ano | findstr :80
netstat -ano | findstr :3306

# Stop the process or change ports in docker-compose.yml
```

### Clean Start
```bash
# Remove everything and start fresh
docker-compose down -v
docker-compose up -d --build
```

## Production Deployment

For production, consider:
1. Use environment-specific `.env` files
2. Set `NODE_ENV=production`
3. Use proper secrets management
4. Configure reverse proxy (nginx/traefik)
5. Set up SSL certificates
6. Use Docker secrets for sensitive data

## Architecture

```
┌─────────────────┐
│   Frontend      │ :80
│   (Vue + Vite)  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Backend       │ :5000
│   (Node.js)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   MySQL         │ :3306
│   (Database)    │
└─────────────────┘
```

## Notes
- MySQL data persists in Docker volume `mysql_data`
- Backend runs migrations automatically on startup
- Frontend is served via Nginx for better performance
