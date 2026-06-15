.PHONY: help dev dev-build dev-down dev-logs prod prod-build prod-down prod-logs clean

# Default target
help:
	@echo "🐳 Safety Culture Survey - Docker Commands"
	@echo ""
	@echo "📦 Development Mode:"
	@echo "  make dev         - Start dev mode (hot reload)"
	@echo "  make dev-build   - Start dev mode with rebuild"
	@echo "  make dev-down    - Stop dev mode"
	@echo "  make dev-logs    - View dev logs"
	@echo ""
	@echo "🚀 Production Mode:"
	@echo "  make prod        - Start production mode"
	@echo "  make prod-build  - Start production with rebuild"
	@echo "  make prod-down   - Stop production"
	@echo "  make prod-logs   - View production logs"
	@echo ""
	@echo "🗄️ Database:"
	@echo "  make db-seed     - Run database seed"
	@echo "  make db-migrate  - Run database migration"
	@echo ""
	@echo "🧹 Cleanup:"
	@echo "  make clean       - Stop all and remove volumes"

# Development commands
dev:
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ Dev mode started! Access at:"
	@echo "   Frontend: http://localhost:5173"
	@echo "   Backend:  http://localhost:5000"
	@echo ""
	@echo "📋 Useful commands:"
	@echo "   make dev-logs    - View logs"
	@echo "   make dev-down    - Stop dev mode"

dev-build:
	docker-compose -f docker-compose.dev.yml up -d --build
	@echo "✅ Dev mode rebuilt and started!"

dev-down:
	docker-compose -f docker-compose.dev.yml down
	@echo "✅ Dev mode stopped"

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

dev-restart:
	docker-compose -f docker-compose.dev.yml restart

# Production commands
prod:
	docker-compose up -d

prod-build:
	docker-compose up -d --build

prod-down:
	docker-compose down

prod-logs:
	docker-compose logs -f

prod-restart:
	docker-compose restart

# Database commands
db-seed:
	docker exec -it safety-survey-backend-dev node prisma/seed.js

db-seed-dev:
	docker exec -it safety-survey-backend-dev node prisma/seed.js

db-migrate:
	docker exec -it safety-survey-backend-dev npx prisma migrate dev

# Logs
logs-backend:
	docker logs safety-survey-backend-dev -f

logs-frontend:
	docker logs safety-survey-frontend-dev -f

# Cleanup
down:
	docker-compose -f docker-compose.dev.yml down
	docker-compose down
	@echo "✅ Containers stopped (data preserved)"

down-prod:
	docker-compose down
	@echo "✅ Production stopped (data preserved)"

down-dev:
	docker-compose -f docker-compose.dev.yml down
	@echo "✅ Dev stopped (data preserved)"

clean:
	docker-compose down -v
	docker-compose -f docker-compose.dev.yml down -v
# 	@echo "✅ All containers and volumes removed"
	@echo "⚠️  Containers and volumes removed (data DELETED)"

hard-clean: clean
	docker system prune -f
	@echo "🧹 System cleaned"
