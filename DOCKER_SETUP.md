# Docker Setup Instructions

## Prerequisites

### Install Docker Desktop for Windows

1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Install Docker Desktop
3. Restart your computer
4. Open Docker Desktop and wait for it to start
5. Verify installation: `docker --version`

## Quick Start with Docker

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start all services (MySQL + App)
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (clean database)
docker-compose down -v
```

### Option 2: Using Docker Only

```bash
# Build the image
docker build -t blog-management-backend .

# Run MySQL container first
docker run -d \
  --name blog_mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=blog_db \
  -p 3307:3306 \
  mysql:8.0

# Run the application
docker run -d \
  --name blog_app \
  -p 3000:3000 \
  --link blog_mysql:mysql \
  -e DB_HOST=mysql \
  -e DB_USER=root \
  -e DB_PASSWORD=root \
  -e DB_NAME=blog_db \
  -e JWT_SECRET=super_secret_key \
  blog-management-backend
```

## Testing

Once containers are running:

- API: http://localhost:3000
- MySQL: localhost:3307

### Test the API

```bash
# Health check
curl http://localhost:3000

# Register a user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "USER"
  }'
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs app
docker-compose logs mysql

# Restart services
docker-compose restart
```

### MySQL connection issues
```bash
# Wait for MySQL to be fully ready (health check)
docker-compose ps

# Check if MySQL is healthy
docker exec blog_mysql mysqladmin ping -h localhost -u root -proot
```

### Port already in use
```bash
# Change ports in docker-compose.yml
# MySQL: "3307:3306" → "3308:3306"
# App: "3000:3000" → "3001:3000"
```

## Clean Up

```bash
# Stop all containers
docker-compose down

# Remove volumes (delete all data)
docker-compose down -v

# Remove images
docker rmi blog-management-backend
docker rmi mysql:8.0
```

## Production Deployment

For production, update docker-compose.yml:

1. Use environment variables file
2. Set strong MySQL password
3. Change JWT_SECRET
4. Enable SSL/HTTPS
5. Set up proper logging
6. Configure backups for MySQL volume
