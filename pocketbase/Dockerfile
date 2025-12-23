# Multi-stage build for Go-based PocketBase application
FROM golang:1.24-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o pocketbase-app main.go

# Final stage - minimal runtime image
FROM alpine:latest

# Install runtime dependencies
RUN apk --no-cache add ca-certificates tzdata

# Create app directory
WORKDIR /app

# Copy binary from builder stage
COPY --from=builder /app/pocketbase-app .

# Copy schema and migration files
COPY --from=builder /app/schema.sql .
COPY --from=builder /app/migrations ./migrations/
COPY --from=builder /app/pb_public ./pb_public/

# Create data directory for PocketBase
RUN mkdir -p /app/pb_data

# Set environment variables
ENV ADMIN_EMAIL=admin@valiantlynx.com
ENV ADMIN_PASSWORD=valiantlynx_admin_2025
ENV APP_URL=http://localhost:8090

# Expose port
EXPOSE 8090

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8090/api/health || exit 1

# Run the application
CMD ["./pocketbase-app", "serve", "--http=0.0.0.0:8090"]
