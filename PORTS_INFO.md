# 🔌 Port Configuration Guide

This document provides information about all ports used in the Food Ordering Website project.

---

## 📊 Port Summary

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Backend API** | 4000 | http://localhost:4000 | Express.js server |
| **Frontend** | 5173 | http://localhost:5173 | Customer interface |
| **Admin Panel** | 5174 | http://localhost:5174 | System admin panel |
| **Stall Admin** | 5175 | http://localhost:5175 | Stall owner panel |

---

## 🔍 Detailed Port Information

### 1. Backend Server (Port 4000)
- **Service**: Express.js API Server
- **Location**: `backend/server.js`
- **Environment Variable**: `PORT` (defaults to 4000)
- **Purpose**: RESTful API endpoints, database connections, file uploads

### 2. Frontend (Port 5173)
- **Service**: Vite Development Server
- **Location**: `frontend/` directory
- **Note**: Default Vite port (no custom config)
- **Purpose**: Customer-facing React application

### 3. Admin Panel (Port 5174)
- **Service**: Vite Development Server
- **Location**: `Admin/` directory
- **Config**: `Admin/vite.config.js` (strictPort: true)
- **Purpose**: System administration interface

### 4. Stall Admin Panel (Port 5175)
- **Service**: Vite Development Server
- **Location**: `StallAdmin/` directory
- **Config**: `StallAdmin/vite.config.js` (strictPort: true)
- **Purpose**: Stall owner management interface

---

## 🚀 Starting All Services

### Option 1: Separate Terminals (Recommended)

```bash
# Terminal 1 - Backend
cd backend && npm run server

# Terminal 2 - Frontend
cd frontend && npm run dev

# Terminal 3 - Admin Panel
cd Admin && npm run dev

# Terminal 4 - Stall Admin
cd StallAdmin && npm run dev
```

### Option 2: Background Processes

```bash
# Start all services in background
cd backend && npm run server &
cd frontend && npm run dev &
cd Admin && npm run dev &
cd StallAdmin && npm run dev &
```

---

## 🛠️ Port Management

### Freeing Ports

If ports are already in use:

```bash
# Kill all Node processes
pkill -f "node.*(server|start.js|vite)"

# Or kill specific ports individually
lsof -ti :4000 | xargs kill -9
lsof -ti :5173 | xargs kill -9
lsof -ti :5174 | xargs kill -9
lsof -ti :5175 | xargs kill -9
```

### Checking Port Status

To verify if ports are in use:

```bash
# Check all project ports
lsof -i :4000 -i :5173 -i :5174 -i :5175 | grep LISTEN

# Check specific port
lsof -i :4000
```

### Changing Ports

To change a port:

1. **Backend**: Update `PORT` in `.env` file or `backend/server.js`
2. **Frontend**: Update `vite.config.js` (if custom port needed)
3. **Admin/StallAdmin**: Update `vite.config.js` port configuration

---

## ⚠️ Common Issues

### Port Already in Use
- **Solution**: Kill the process using the port (see commands above)
- **Prevention**: Always stop services properly before restarting

### Port Conflicts
- **Solution**: Use different ports or free existing ones
- **Note**: Admin and StallAdmin use `strictPort: true` to prevent conflicts

---

**Last Updated**: 2025

