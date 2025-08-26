#!/bin/bash

echo "🚀 Setting up Grocery Ordering Web App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm${NC}"
    exit 1
fi

if ! command_exists git; then
    echo -e "${RED}❌ Git is not installed. Please install Git${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites met!${NC}"

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${YELLOW}⚠️  Warning: Node.js version 18+ is recommended. Current version: $(node -v)${NC}"
fi

# Setup Backend
echo -e "\n🔧 Setting up Backend..."
cd backend

if [ ! -f package.json ]; then
    echo -e "${RED}❌ Backend package.json not found${NC}"
    exit 1
fi

echo "📦 Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cat > .env << EOL
# Environment Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/grocery-store
# For production, use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/grocery-store

# JWT Configuration
JWT_SECRET=grocery-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# API Keys (for external integrations)
INVENTORY_API_KEY=your-inventory-api-key
DELIVERY_API_KEY=your-delivery-api-key

# External API URLs
INVENTORY_API_URL=https://api.inventory-system.com
DELIVERY_API_URL=https://api.delivery-system.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
EOL
    echo -e "${GREEN}✅ Backend .env file created${NC}"
fi

# Setup Frontend
echo -e "\n🎨 Setting up Frontend..."
cd ../frontend

if [ ! -f package.json ]; then
    echo -e "${RED}❌ Frontend package.json not found${NC}"
    exit 1
fi

echo "📦 Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating frontend .env.local file..."
    cat > .env.local << EOL
# Environment Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Fresh Grocery Store
NEXT_PUBLIC_APP_DESCRIPTION=Your one-stop shop for fresh groceries

# For production deployment
# NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
EOL
    echo -e "${GREEN}✅ Frontend .env.local file created${NC}"
fi

cd ..

echo -e "\n🎉 Setup completed successfully!"
echo -e "\n📋 Next steps:"
echo -e "1. ${YELLOW}Make sure MongoDB is running${NC}"
echo -e "   - Local: Start MongoDB service"
echo -e "   - Cloud: Update MONGODB_URI in backend/.env with your Atlas connection string"
echo -e "\n2. ${YELLOW}Seed the database with sample data:${NC}"
echo -e "   cd backend && npm run seed"
echo -e "\n3. ${YELLOW}Start the development servers:${NC}"
echo -e "   ${GREEN}Backend:${NC} cd backend && npm run dev"
echo -e "   ${GREEN}Frontend:${NC} cd frontend && npm run dev"
echo -e "\n4. ${YELLOW}Access the application:${NC}"
echo -e "   Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "   Backend API: ${GREEN}http://localhost:5000${NC}"
echo -e "\n5. ${YELLOW}Default login credentials (after seeding):${NC}"
echo -e "   Admin: ${GREEN}admin@grocery.com / admin123${NC}"
echo -e "   Customer: ${GREEN}customer@example.com / customer123${NC}"

echo -e "\n📚 For more information, check README.md"
