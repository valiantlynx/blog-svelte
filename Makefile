.PHONY: help dev dev-blog dev-database stop clean install check logs docker-up docker-down docker-rebuild

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

# Local development URLs (override production URLs in .env files)
LOCAL_POCKETBASE_URL := http://localhost:8090
LOCAL_URL := http://localhost:5173

help: ## Show this help message
	@echo "$(BLUE)Svelte Blog Development Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# Development commands
dev: ## Start all services in development mode (requires tmux or multiple terminals)
	@echo "$(YELLOW)Starting all services...$(NC)"
	@$(MAKE) -j3 dev-database dev-blog

dev-blog: ## Start blog development server (port 5173)
	@echo "$(BLUE)Starting blog on http://localhost:5173$(NC)"
	@PUBLIC_POCKETBASE_URL=$(LOCAL_POCKETBASE_URL) pnpm run dev

dev-database: ## Start PocketBase database (port 8090)
	@echo "$(BLUE)Starting PocketBase on http://localhost:8090$(NC)"
	@echo "$(YELLOW)Admin UI: http://localhost:8090/_/$(NC)"
	@cd pocketbase && go run . serve

# Installation commands
install: ## Install all dependencies
	@echo "$(YELLOW)Installing all dependencies...$(NC)"
	@$(MAKE) install-blog
	@$(MAKE) install-database

install-blog: ## Install blog dependencies (pnpm)
	@echo "$(BLUE)Installing blog dependencies...$(NC)"
	@pnpm install

install-database: ## Build database (Go)
	@echo "$(BLUE)Building database...$(NC)"
	@cd pocketbase && go mod download

# Quality checks
check: ## Run all quality checks
	@$(MAKE) check-blog

check-blog: ## Run blog type checking and linting
	@echo "$(BLUE)Checking blog...$(NC)"
	@pnpm run check && pnpm run lint

# Docker commands
docker-up: ## Start all services with Docker Compose
	@echo "$(YELLOW)Starting Docker services...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)Services started:$(NC)"
	@echo "  Blog:  http://localhost:9020"
	@echo "  Database:  http://localhost:8090"
	@echo "  DB Admin:  http://localhost:8090/_/"

docker-down: ## Stop all Docker services
	@echo "$(YELLOW)Stopping Docker services...$(NC)"
	@docker-compose down

docker-rebuild: ## Rebuild and restart Docker services
	@echo "$(YELLOW)Rebuilding Docker services...$(NC)"
	@docker-compose up -d --build

docker-logs: ## Show Docker logs (follow)
	@docker-compose logs -f

# Utility commands
logs: ## Show logs for all services (requires running services)
	@echo "$(YELLOW)Showing service logs...$(NC)"
	@echo "Use Ctrl+C to stop following logs"
	@tail -f blog/logs/*.log database/logs/*.log 2>/dev/null || echo "No log files found"

clean: ## Clean build artifacts and caches
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	@rm -rf .svelte-kit build node_modules/.cache
	@cd pocketbase && rm -rf pb_data/logs.db-*
	@docker-compose down -v
	@echo "$(GREEN)Cleanup complete$(NC)"

clean-all: clean ## Clean everything including dependencies
	@echo "$(YELLOW)Removing all dependencies...$(NC)"
	@rm -rf node_modules
	@echo "$(GREEN)Full cleanup complete. Run 'make install' to reinstall.$(NC)"

# Database operations
db-migrate: ## Run PocketBase migrations
	@echo "$(BLUE)Running database migrations...$(NC)"
	@cd pocketbase && go run . migrate up

db-admin: ## Show database admin credentials
	@echo "$(BLUE)PocketBase Admin Credentials:$(NC)"
	@echo "  URL:      http://localhost:8090/_/"
	@echo "  Email:    admin@valiantlynx.com"
	@echo "  Password: valiantlynx_admin_2025"

db-backup: ## Backup PocketBase database
	@echo "$(BLUE)Creating database backup...$(NC)"
	@cd pocketbase && ./backups/backup.sh || echo "Backup script not found"

# Development helpers
tmux-dev: ## Start all services in tmux session (uses window 4)
	@echo "$(YELLOW)Starting services in tmux...$(NC)"
	@if tmux has-session -t blog 2>/dev/null; then \
		echo "$(GREEN)Session 'blog' already exists. Attaching to window 4...$(NC)"; \
		tmux attach-session -t blog:4; \
	else \
		if [ -f ~/.config/tmux/tmux.conf ] && grep -q "set-hook.*session-created" ~/.config/tmux/tmux.conf 2>/dev/null; then \
			echo "$(BLUE)Using custom tmux config (session-created hook detected)...$(NC)"; \
			tmux new-session -d -s blog; \
			sleep 1; \
		else \
			echo "$(BLUE)Using standard tmux (no custom config detected)...$(NC)"; \
			tmux new-session -d -s blog -n editor; \
			tmux send-keys -t blog:1 'nvim .' C-m; \
			tmux new-window -t blog:2 -n git; \
			tmux send-keys -t blog:2 'lazygit' C-m; \
			tmux new-window -t blog:3 -n yazi; \
			tmux send-keys -t blog:3 'yazi' C-m; \
			tmux new-window -t blog:4 -n terminal; \
			sleep 0.5; \
		fi; \
		tmux select-window -t blog:4; \
		tmux send-keys -t blog:4 'cd $(PWD) && make dev-database' C-m; \
		tmux split-window -h -t blog:4; \
		tmux send-keys -t blog:4.1 'cd $(PWD) && make dev-backend' C-m; \
		tmux split-window -v -t blog:4.1; \
		tmux send-keys -t blog:4.2 'cd $(PWD) && make dev-blog' C-m; \
		tmux select-layout -t blog:4 even-horizontal; \
		tmux attach-session -t blog:4; \
	fi

tmux-stop: ## Stop tmux development session
	@tmux kill-session -t blog 2>/dev/null || echo "No tmux session found"
	@echo "$(GREEN)Tmux session stopped$(NC)"

tmux-attach: ## Attach to existing tmux session
	@tmux attach-session -t blog

# Show current configuration
show-config: ## Show current environment configuration
	@echo "$(BLUE)Current Configuration:$(NC)"
	@echo ""
	@echo "$(YELLOW)Production (from .env files):$(NC)"
	@echo "  Blog  URL:    $$(grep PUBLIC_BASE_URL .env | cut -d'=' -f2)"
	@echo "  Blog DB URL:     $$(grep PUBLIC_POCKETBASE_URL .env | cut -d'=' -f2)"
	@echo ""
	@echo "$(YELLOW)Development (used by 'make dev' commands):$(NC)"
	@echo "  Blog  URL:    $(LOCAL_URL)"
	@echo "  Blog DB URL:     $(LOCAL_POCKETBASE_URL)"

# Default target
.DEFAULT_GOAL := help
