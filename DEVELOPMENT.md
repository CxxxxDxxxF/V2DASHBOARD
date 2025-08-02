# 🚀 Development Guide

## Development Server Management

This project includes a smart development server management system that ensures **only one server runs at a time**, preventing port conflicts and confusion.

### 🎯 Why This Matters

- **No More Port Conflicts**: Automatically handles multiple instances
- **Clean Development**: Always know which server is running
- **Easy Management**: Simple commands to start, stop, and restart
- **Process Tracking**: Know exactly which process is using port 3000

### 📋 Available Commands

#### Using npm scripts (Recommended)
```bash
# Start the development server
npm run dev

# Stop the development server
npm run dev:stop

# Check server status
npm run dev:status

# Restart the development server
npm run dev:restart
```

#### Using the shell script (Alternative)
```bash
# Start the development server
./dev.sh start

# Stop the development server
./dev.sh stop

# Check server status
./dev.sh status

# Restart the development server
./dev.sh restart

# Show help
./dev.sh help
```

### 🔧 How It Works

1. **Port Detection**: Automatically detects if port 3000 is in use
2. **Process Management**: Kills conflicting processes before starting
3. **PID Tracking**: Tracks the development server process ID
4. **Clean Shutdown**: Properly terminates processes on exit
5. **Status Monitoring**: Shows current server status and process info

### 🚨 Troubleshooting

#### If you see "Port 3000 is already in use"
```bash
# This will automatically fix it
npm run dev:stop
npm run dev
```

#### If the server won't start
```bash
# Check what's using port 3000
lsof -i :3000

# Force kill everything on port 3000
lsof -ti:3000 | xargs kill -9

# Then start normally
npm run dev
```

#### If you're still having issues
```bash
# Clean restart
npm run dev:stop
rm -rf .next
npm run dev
```

### 📊 Server Status

The status command shows:
- ✅ Whether the server is running
- 🌐 The URL where it's available
- 📋 The process ID (PID)
- ⚠️ Any issues that need attention

### 🎨 Features

- **Colored Output**: Easy-to-read status messages
- **Automatic Cleanup**: Removes PID files on exit
- **Preflight Checks**: Runs validation before starting
- **Graceful Shutdown**: Properly terminates processes
- **Cross-Platform**: Works on macOS, Linux, and Windows

### 💡 Pro Tips

1. **Always use the managed commands**: Don't run `next dev` directly
2. **Check status first**: Use `npm run dev:status` to see what's running
3. **Use restart for changes**: `npm run dev:restart` after major changes
4. **Keep it simple**: One server, one port, no confusion!

### 🔄 Workflow

```bash
# 1. Check if anything is running
npm run dev:status

# 2. Start development (if needed)
npm run dev

# 3. Make your changes...

# 4. Restart if needed
npm run dev:restart

# 5. Stop when done
npm run dev:stop
```

This system ensures you always have a clean, predictable development environment! 🎉 