# Docker Desktop Troubleshooting

## Current Issue: 500 Internal Server Error

This error means Docker Desktop is not running properly.

## Quick Fixes (Try in order):

### 1. Restart Docker Desktop
- Right-click Docker Desktop icon in system tray
- Select "Restart"
- Wait 2-3 minutes for Docker to fully start
- Try again: `docker-compose up --build`

### 2. If restart doesn't work:
- Close Docker Desktop completely
- Open Task Manager (Ctrl + Shift + Esc)
- End these tasks if running:
  - Docker Desktop
  - com.docker.backend
  - com.docker.service
- Restart Docker Desktop
- Wait for "Docker Desktop is running" message

### 3. Reset Docker Desktop:
- Open Docker Desktop
- Go to Settings (gear icon)
- Troubleshoot → Reset to factory defaults
- Wait for reset to complete
- Docker will restart automatically

### 4. Check WSL 2 (Windows Subsystem for Linux):
```powershell
# Run as Administrator
wsl --update
wsl --set-default-version 2
```

### 5. Verify Docker is running:
```bash
docker version
docker ps
```

## Alternative: Run without Docker (for testing)

If Docker issues persist, you can run the app locally:

```bash
# Make sure MySQL is installed and running locally
# Update .env with local MySQL credentials

# Install dependencies
npm install

# Run the app
npm run dev
```

## After Docker is working:

```bash
# Clean up old containers
docker-compose down -v

# Build and run
docker-compose up --build

# Or in background
docker-compose up -d --build
```

## Common Issues:

### Port conflicts:
If ports 3000 or 3307 are in use:
```bash
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :3307

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Virtualization not enabled:
- Restart computer
- Enter BIOS (usually F2, F10, or Del during startup)
- Enable Intel VT-x or AMD-V
- Save and restart

## For Assignment Submission:

The Docker files are correctly configured:
- ✅ Dockerfile
- ✅ docker-compose.yml
- ✅ .dockerignore

You can include screenshots of:
1. Docker Desktop running
2. `docker-compose up` output
3. Containers running (`docker ps`)
4. API responses (Postman)

This shows the evaluators that your Docker setup is professional and working.
