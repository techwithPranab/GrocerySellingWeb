#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Grocery Web App Development Servers...${NC}"

# Function to kill background processes on exit
cleanup() {
    echo -e "\n${YELLOW}⏹️  Stopping servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up trap to call cleanup function on script exit
trap cleanup INT TERM EXIT

# Check if MongoDB is running (optional check)
echo "🔍 Checking if MongoDB is accessible..."
if command -v mongosh >/dev/null 2>&1; then
    mongosh --eval "db.runCommand('ping')" --quiet >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ MongoDB is running${NC}"
    else
        echo -e "${YELLOW}⚠️  MongoDB might not be running. Make sure it's started.${NC}"
    fi
elif command -v mongo >/dev/null 2>&1; then
    mongo --eval "db.runCommand('ping')" --quiet >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ MongoDB is running${NC}"
    else
        echo -e "${YELLOW}⚠️  MongoDB might not be running. Make sure it's started.${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  MongoDB client not found. Make sure MongoDB is running.${NC}"
fi

# Start backend server
echo -e "\n🔧 Starting Backend Server (Port 5000)..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo -e "\n🎨 Starting Frontend Server (Port 3000)..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Display information
echo -e "\n${GREEN}🎉 Both servers are starting up!${NC}"
echo -e "\n📱 Application URLs:"
echo -e "   Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "   Backend API: ${GREEN}http://localhost:5000${NC}"
echo -e "   API Health: ${GREEN}http://localhost:5000/api/health${NC}"

echo -e "\n👤 Default Login Credentials:"
echo -e "   Admin: ${GREEN}admin@grocery.com / admin123${NC}"
echo -e "   Customer: ${GREEN}customer@example.com / customer123${NC}"

echo -e "\n${YELLOW}💡 Tip: Run 'npm run seed' in the backend directory to populate sample data${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Wait for processes to finish
wait
