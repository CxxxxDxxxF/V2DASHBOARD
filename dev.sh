#!/bin/bash

# Rutgers Golf Dashboard Development Server Manager
# This script ensures only one development server runs at a time

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${CYAN}🚀 Rutgers Golf Dashboard${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if port 3000 is in use
check_port() {
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port 3000
kill_port() {
    if check_port; then
        print_warning "Port 3000 is in use. Killing existing process..."
        lsof -ti:3000 | xargs kill -9
        sleep 2
        print_success "Port 3000 cleared"
    fi
}

# Function to start the development server
start_server() {
    print_status
    print_success "Starting development server..."
    
    # Kill any existing process on port 3000
    kill_port
    
    # Run preflight checks
    print_warning "Running preflight checks..."
    npm run preflight
    
    # Start the server
    print_success "Starting Next.js development server..."
    echo -e "${BLUE}📍 Server will be available at: http://localhost:3000${NC}"
    echo -e "${BLUE}🛑 Press Ctrl+C to stop the server${NC}"
    echo -e "${BLUE}================================${NC}"
    
    npm run dev
}

# Function to stop the development server
stop_server() {
    print_status
    print_warning "Stopping development server..."
    
    # Kill any process on port 3000
    kill_port
    
    print_success "Development server stopped"
}

# Function to restart the development server
restart_server() {
    print_status
    print_warning "Restarting development server..."
    
    stop_server
    sleep 2
    start_server
}

# Function to show server status
show_status() {
    print_status
    
    if check_port; then
        print_success "Development server is running"
        echo -e "${BLUE}🌐 Available at: http://localhost:3000${NC}"
        
        # Show process info
        PID=$(lsof -ti:3000)
        if [ ! -z "$PID" ]; then
            echo -e "${BLUE}📋 Process ID: $PID${NC}"
        fi
    else
        print_error "No development server running"
        echo -e "${BLUE}💡 Run './dev.sh start' to start the server${NC}"
    fi
}

# Function to show help
show_help() {
    print_status
    echo -e "${BLUE}Usage: ./dev.sh [command]${NC}"
    echo ""
    echo -e "${GREEN}Commands:${NC}"
    echo -e "  ${CYAN}start${NC}     - Start the development server"
    echo -e "  ${CYAN}stop${NC}      - Stop the development server"
    echo -e "  ${CYAN}restart${NC}   - Restart the development server"
    echo -e "  ${CYAN}status${NC}    - Show server status"
    echo -e "  ${CYAN}help${NC}      - Show this help message"
    echo ""
    echo -e "${YELLOW}Note: This script ensures only one server runs at a time${NC}"
}

# Main script logic
case "${1:-help}" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        restart_server
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 