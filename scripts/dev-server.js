#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PID_FILE = path.join(__dirname, '..', '.dev-server.pid');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkIfPortInUse(port) {
  return new Promise((resolve) => {
    exec(`lsof -ti:${port}`, (error, stdout) => {
      if (error || !stdout.trim()) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

function killProcessOnPort(port) {
  return new Promise((resolve) => {
    exec(`lsof -ti:${port} | xargs kill -9`, (error) => {
      if (error) {
        log(`No process found on port ${port}`, 'yellow');
      } else {
        log(`Killed process on port ${port}`, 'green');
      }
      resolve();
    });
  });
}

function writePidFile(pid) {
  try {
    fs.writeFileSync(PID_FILE, pid.toString());
  } catch (error) {
    log('Warning: Could not write PID file', 'yellow');
  }
}

function removePidFile() {
  try {
    if (fs.existsSync(PID_FILE)) {
      fs.unlinkSync(PID_FILE);
    }
  } catch (error) {
    // Ignore error if file doesn't exist
  }
}

function checkExistingPidFile() {
  try {
    if (fs.existsSync(PID_FILE)) {
      const pid = fs.readFileSync(PID_FILE, 'utf8').trim();
      return parseInt(pid);
    }
  } catch (error) {
    // Ignore error
  }
  return null;
}

function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return false;
  }
}

async function startDevServer() {
  log('🚀 Starting Rutgers Golf Dashboard Development Server', 'cyan');
  log('=' .repeat(50), 'blue');
  
  // Check for existing PID file
  const existingPid = checkExistingPidFile();
  if (existingPid && isProcessRunning(existingPid)) {
    log(`⚠️  Development server already running with PID ${existingPid}`, 'yellow');
    log('   Use "npm run dev:stop" to stop it first', 'yellow');
    process.exit(1);
  }
  
  // Check if port is in use
  const portInUse = await checkIfPortInUse(PORT);
  if (portInUse) {
    log(`⚠️  Port ${PORT} is already in use`, 'yellow');
    log('   Attempting to kill existing process...', 'yellow');
    await killProcessOnPort(PORT);
  }
  
  // Clean up old PID file
  removePidFile();
  
  log(`📍 Starting server on http://localhost:${PORT}`, 'green');
  log('   Press Ctrl+C to stop the server', 'blue');
  log('=' .repeat(50), 'blue');
  
  // Start the Next.js development server
  const child = spawn('npx', ['next', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: PORT.toString() }
  });
  
  // Write PID to file
  writePidFile(child.pid);
  
  // Handle process exit
  const cleanup = () => {
    log('\n🛑 Stopping development server...', 'red');
    removePidFile();
    child.kill('SIGTERM');
    process.exit(0);
  };
  
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', cleanup);
  
  // Handle child process exit
  child.on('exit', (code) => {
    log(`\n💥 Development server exited with code ${code}`, 'red');
    removePidFile();
    process.exit(code);
  });
}

async function stopDevServer() {
  log('🛑 Stopping Development Server', 'red');
  log('=' .repeat(40), 'blue');
  
  // Check PID file first
  const existingPid = checkExistingPidFile();
  if (existingPid && isProcessRunning(existingPid)) {
    log(`📋 Found running server with PID ${existingPid}`, 'yellow');
    try {
      process.kill(existingPid, 'SIGTERM');
      log('✅ Sent termination signal to existing server', 'green');
    } catch (error) {
      log('❌ Could not terminate existing server', 'red');
    }
  }
  
  // Kill any process on port 3000
  const portInUse = await checkIfPortInUse(PORT);
  if (portInUse) {
    log(`🔌 Killing process on port ${PORT}`, 'yellow');
    await killProcessOnPort(PORT);
  }
  
  // Clean up PID file
  removePidFile();
  
  log('✅ Development server stopped', 'green');
}

async function statusDevServer() {
  log('📊 Development Server Status', 'cyan');
  log('=' .repeat(30), 'blue');
  
  const existingPid = checkExistingPidFile();
  const portInUse = await checkIfPortInUse(PORT);
  
  if (existingPid && isProcessRunning(existingPid)) {
    log(`✅ Server running with PID ${existingPid}`, 'green');
    log(`🌐 Available at http://localhost:${PORT}`, 'green');
  } else if (portInUse) {
    log(`⚠️  Port ${PORT} is in use by another process`, 'yellow');
    log('   Run "npm run dev:stop" to clear the port', 'yellow');
  } else {
    log('❌ No development server running', 'red');
    log('   Run "npm run dev" to start the server', 'blue');
  }
}

// Parse command line arguments
const command = process.argv[2];

switch (command) {
  case 'start':
    startDevServer();
    break;
  case 'stop':
    stopDevServer();
    break;
  case 'status':
    statusDevServer();
    break;
  default:
    log('Usage:', 'bright');
    log('  node scripts/dev-server.js start   - Start development server', 'blue');
    log('  node scripts/dev-server.js stop    - Stop development server', 'blue');
    log('  node scripts/dev-server.js status  - Check server status', 'blue');
    process.exit(1);
} 