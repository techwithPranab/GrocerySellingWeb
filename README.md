# Grocery Ordering Web App

A full-stack grocery ordering application built with Next.js (frontend) and Node.js + Express + MongoDB (backend).

## Features

### Customer Features
- 🛒 Browse and search products by category
- 🛍️ Add items to cart and manage quantities
- 🏠 Multiple delivery addresses
- 💳 Multiple payment options (COD, Card, UPI, Wallet)
- 📱 Order tracking with real-time updates
- 🎫 Coupon and offer management
- 👤 User profile and order history

### Admin Features
- 📊 Comprehensive dashboard with sales analytics
- 📦 Product management (CRUD operations)
- 🚚 Order management and status updates
- 🎯 Offer and coupon management
- 📈 Sales and customer reports
- 👥 User management

### Technical Features
- 🔐 JWT-based authentication with role management
- 📱 Responsive design (mobile + desktop)
- 🔄 Real-time cart synchronization
- 🔌 REST API integration ready for:
  - Inventory Management System
  - Delivery Management System
- 🗄️ MongoDB for data persistence
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Yup validation
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT
- **Validation**: Express Validator
- **Security**: Helmet, CORS
- **File Upload**: Multer
- **Logging**: Morgan

## Project Structure

```
GrocerySellingWeb/
├── backend/                 # Node.js backend
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication & validation
│   ├── services/           # Business logic
│   ├── server.js           # Entry point
│   └── seed.js             # Sample data
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Next.js pages
│   │   ├── context/        # React contexts
│   │   ├── lib/            # Utility libraries
│   │   ├── types/          # TypeScript types
│   │   └── styles/         # CSS files
│   └── public/             # Static assets
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GrocerySellingWeb
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Copy environment file and configure
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   
   # Seed the database with sample data
   npm run seed
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Copy environment file and configure
   cp .env.local.example .env.local
   # Edit .env.local with your API URL
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Default Credentials

After running the seed script:
- **Admin**: admin@grocery.com / admin123
- **Customer**: customer@example.com / customer123

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grocery-store
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Fresh Grocery Store
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/login` - Customer login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/profile` - Get user profile

### Customer Endpoints
- `GET /api/products` - Get products with filtering
- `GET /api/products/:id` - Get product details
- `POST /api/cart/add` - Add item to cart
- `POST /api/orders/checkout` - Place order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id/track` - Track order

### Admin Endpoints
- `POST /api/admin/products` - Add product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `POST /api/admin/offers` - Create offer
- `GET /api/admin/reports/sales` - Sales reports

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Get connection string
3. Update MONGODB_URI in environment variables

## External API Integration

The system is designed to integrate with:

### Inventory Management System
- Product stock updates
- Automatic reordering
- Price synchronization

### Delivery Management System
- Order assignment to delivery partners
- Real-time tracking
- Delivery status updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@freshgrocery.com or create an issue in the repository.

## 🆕 New Frontend Features

### Enhanced Product Experience
- **📱 Products Page (`/products`)**: Full product catalog with advanced filtering
  - Left sidebar filters (category, price range, search)
  - Sort by name, price, date, rating
  - Mobile-responsive filter panel
  - Real-time product search
  - Grid view with product cards

### 🛒 Shopping Cart & Checkout
- **Cart Page (`/cart`)**: Complete shopping cart management
  - Add/remove items with quantity controls
  - Real-time price calculations
  - Delivery fee and tax calculations
  - Free delivery threshold indicator
  - Continue shopping functionality

- **Checkout Page (`/checkout`)**: Comprehensive checkout process
  - Delivery address form with validation
  - Multiple delivery slot selection
  - Payment method selection (COD, Card, UPI, Wallet)
  - Order notes and offer code input
  - Order summary with itemized costs

### 📦 Order Management
- **Orders Page (`/orders`)**: Complete order history and management
  - Order status filtering (All, Preparing, Out for Delivery, etc.)
  - Order cards with item previews
  - Status badges with color coding
  - Order tracking and details links
  - Delivery information display

- **Order Details Page (`/orders/[orderId]`)**: Detailed order view
  - Complete order timeline with status updates
  - Item breakdown with images and quantities
  - Delivery information and address
  - Payment method and status
  - Order summary with pricing breakdown
  - Contact support integration

- **Order Tracking Page (`/track-order`)**: Enhanced tracking functionality
  - Order number search with email verification
  - Visual timeline with status icons
  - Estimated delivery time
  - Real-time status updates
  - Contact support integration

### 🔧 Enhanced Components
- **ProductCard**: Interactive cart integration
  - Add to cart functionality
  - Quantity controls (+/- buttons)
  - Loading states and animations
  - Stock status indicators
  - Cart quantity display

- **Header**: Updated navigation
  - Cart icon with item count badge
  - User dropdown with order history link
  - Mobile-responsive search
  - Enhanced navigation menu

### 📊 Technical Improvements
- **Form Validation**: React Hook Form integration
  - Address validation for checkout
  - Email validation for tracking
  - Error handling and user feedback

- **State Management**: Enhanced cart context
  - Real-time cart synchronization
  - Persistent cart state
  - Loading states for all operations
  - Error handling with toast notifications

- **UI/UX Enhancements**:
  - Responsive design for all screen sizes
  - Loading animations and skeleton screens
  - Accessibility improvements (proper labels, ARIA attributes)
  - Consistent color coding for order statuses
  - Professional layouts with proper spacing

### 🔄 Integration Ready
- All pages prepared for backend API integration
- Sample data structure matches backend models
- Authentication flow integrated
- Error handling for API failures
- Toast notifications for user feedback
