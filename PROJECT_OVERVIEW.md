# Fresh Grocery Store - Complete E-commerce Platform

A comprehensive grocery ordering web application built with Next.js frontend and Node.js backend, featuring customer and admin portals with role-based authentication.

## 🚀 Features

### Customer Features
- **User Authentication**: Secure registration, login, and password reset
- **Product Browsing**: Browse products by categories with search and filtering
- **Shopping Cart**: Add/remove items, quantity management, persistent cart
- **Order Management**: Place orders, track delivery status, order history
- **User Profile**: Manage personal information, addresses, and preferences
- **Support System**: Help center, contact support, FAQ section

### Admin Features
- **Admin Dashboard**: Overview of sales, orders, customers, and inventory
- **Product Management**: Add, edit, delete products and manage categories
- **Order Management**: View, process, and update order statuses
- **User Management**: Manage customer accounts and permissions
- **Inventory Tracking**: Monitor stock levels and low stock alerts
- **Analytics**: Sales reports, customer insights, and performance metrics

### Technical Features
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Role-based Authentication**: JWT-based auth with customer/admin roles
- **RESTful APIs**: Clean API structure for frontend-backend communication
- **Database Integration**: MongoDB with Mongoose ODM
- **Security**: Password hashing, JWT tokens, input validation, CORS protection
- **Error Handling**: Comprehensive error handling and user feedback
- **External API Ready**: Architecture supports inventory and delivery system integration

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Forms**: React Hook Form with validation
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS
- **Environment**: dotenv

## 📁 Project Structure

```
GrocerySellingWeb/
├── backend/
│   ├── models/           # Database models (User, Product, Order, Offer)
│   ├── routes/           # API routes (auth, products, cart, orders, admin)
│   ├── middleware/       # Authentication and validation middleware
│   ├── services/         # Business logic services
│   ├── config/           # Database and environment configuration
│   ├── scripts/          # Database seeding and utility scripts
│   ├── package.json
│   └── server.js         # Main server file
├── frontend/
│   ├── src/
│   │   ├── pages/        # Next.js pages and routing
│   │   ├── components/   # Reusable React components
│   │   ├── context/      # React Context providers
│   │   ├── lib/          # Utility functions and API client
│   │   └── types/        # TypeScript type definitions
│   ├── public/           # Static assets
│   ├── styles/           # Global styles and Tailwind config
│   ├── package.json
│   └── next.config.js
├── setup.sh             # Quick setup script
├── start-dev.sh          # Development startup script
├── README.md
└── DEPLOYMENT.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd GrocerySellingWeb
```

### 2. Quick Setup (Recommended)
```bash
chmod +x setup.sh start-dev.sh
./setup.sh
```

### 3. Manual Setup

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secret
npm run seed    # Optional: Add sample data
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Start Development
```bash
# From project root
./start-dev.sh
```

## 🔧 Environment Configuration

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grocery-store
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📱 Pages & Routes

### Customer Pages
- `/` - Home page with featured products
- `/login` - Customer login
- `/register` - Customer registration
- `/products` - Product catalog
- `/cart` - Shopping cart
- `/checkout` - Order checkout
- `/orders` - Order history
- `/profile` - User profile
- `/help` - Help center and FAQ
- `/contact` - Contact support
- `/track-order` - Order tracking
- `/about` - About us
- `/terms` - Terms and conditions
- `/privacy` - Privacy policy
- `/return-policy` - Return policy

### Admin Pages
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/customers` - Customer management
- `/admin/analytics` - Reports and analytics

## 🔐 API Endpoints

### Authentication
```
POST /api/auth/register     # Customer registration
POST /api/auth/login        # User login
POST /api/auth/logout       # User logout
GET  /api/auth/me          # Get current user
POST /api/auth/forgot      # Forgot password
POST /api/auth/reset       # Reset password
```

### Products
```
GET    /api/products       # Get all products
GET    /api/products/:id   # Get single product
POST   /api/products       # Create product (admin)
PUT    /api/products/:id   # Update product (admin)
DELETE /api/products/:id   # Delete product (admin)
```

### Cart
```
GET    /api/cart           # Get user cart
POST   /api/cart/add       # Add item to cart
PUT    /api/cart/update    # Update cart item
DELETE /api/cart/remove    # Remove cart item
DELETE /api/cart/clear     # Clear cart
```

### Orders
```
GET  /api/orders           # Get user orders
POST /api/orders           # Create new order
GET  /api/orders/:id       # Get order details
PUT  /api/orders/:id       # Update order status (admin)
```

### Admin
```
GET  /api/admin/dashboard  # Dashboard statistics
GET  /api/admin/users      # Manage users
GET  /api/admin/analytics  # Analytics data
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6, #2563EB, #1D4ED8)
- **Secondary**: Gray (#6B7280, #4B5563, #374151)
- **Success**: Green (#10B981, #059669)
- **Warning**: Yellow (#F59E0B, #D97706)
- **Error**: Red (#EF4444, #DC2626)

### Typography
- **Font Family**: Inter (system fonts fallback)
- **Headings**: Bold weights (700, 600)
- **Body**: Regular (400) and medium (500)
- **Sizes**: Responsive scale from text-sm to text-5xl

### Components
- **Buttons**: Primary, secondary, outline variants
- **Forms**: Consistent styling with validation states
- **Cards**: Shadow-based elevation system
- **Navigation**: Responsive header with mobile menu
- **Footer**: Multi-column layout with links

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation with express-validator
- **CORS Protection**: Configured for frontend domain
- **Helmet Security**: Security headers and protections
- **Rate Limiting**: API request limiting (configurable)
- **Environment Variables**: Sensitive data protection

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: Enum ['customer', 'admin'],
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  image: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: Enum ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
  deliveryAddress: Object,
  paymentMethod: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Test Coverage
- Unit tests for API endpoints
- Integration tests for authentication
- Component tests for React components
- E2E tests for critical user flows

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build
npm start

# Backend
cd backend
npm run build
npm start
```

### Environment Setup
- Set NODE_ENV=production
- Configure production MongoDB URI
- Set secure JWT secrets
- Configure CORS for production domain
- Set up SSL/HTTPS
- Configure reverse proxy (nginx recommended)

### Deployment Platforms
- **Vercel**: Frontend deployment (recommended for Next.js)
- **Heroku**: Full-stack deployment
- **AWS**: EC2, ECS, or Lambda deployment
- **DigitalOcean**: VPS deployment
- **Netlify**: Static site deployment (frontend only)

## 🔧 Development

### Code Style
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework

### Development Workflow
1. Create feature branch from main
2. Implement changes with proper TypeScript types
3. Add tests for new functionality
4. Run linting and formatting
5. Test in development environment
6. Create pull request with description
7. Code review and merge

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions, issues, or contributions:

- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub discussions for questions
- **Contact**: Email support at dev@freshgrocery.com

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the excellent React framework
- MongoDB team for the flexible database solution
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors whose packages make this project possible

---

**Fresh Grocery Store** - Making grocery shopping convenient, fresh, and reliable! 🛒🥬✨
