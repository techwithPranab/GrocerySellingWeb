# Deployment Guide

This guide covers deploying the Grocery Web App to various platforms.

## Table of Contents
1. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
2. [Backend Deployment (Railway)](#backend-deployment-railway)
3. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
4. [Environment Variables](#environment-variables)
5. [Alternative Deployment Options](#alternative-deployment-options)

## Frontend Deployment (Vercel)

Vercel is the recommended platform for deploying Next.js applications.

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Install Command: `npm install`

3. **Environment Variables**
   Add these environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   NEXT_PUBLIC_APP_NAME=Fresh Grocery Store
   NEXT_PUBLIC_APP_DESCRIPTION=Your one-stop shop for fresh groceries
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - You'll get a URL like `https://your-app.vercel.app`

### Custom Domain (Optional)
- Go to your project settings in Vercel
- Add your custom domain
- Update DNS records as instructed

## Backend Deployment (Railway)

Railway provides an easy way to deploy Node.js applications with MongoDB.

### Prerequisites
- GitHub account
- Railway account (free tier available)

### Steps

1. **Prepare for Deployment**
   ```bash
   # Add a start script to package.json (already included)
   # Ensure all dependencies are in package.json
   ```

2. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder

3. **Environment Variables**
   Add these in Railway dashboard:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grocery-store
   JWT_SECRET=your-super-secure-jwt-secret-for-production
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

4. **Deploy**
   - Railway will automatically deploy your backend
   - You'll get a URL like `https://your-backend.up.railway.app`

## Database Setup (MongoDB Atlas)

MongoDB Atlas provides free cloud MongoDB hosting.

### Steps

1. **Create Account**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Choose "Shared" (free tier)
   - Select your preferred region
   - Create cluster (takes 5-10 minutes)

3. **Security Setup**
   - Create database user with username/password
   - Add IP addresses to whitelist (0.0.0.0/0 for development)

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

5. **Seed Database**
   ```bash
   # Update MONGODB_URI in backend/.env with Atlas connection string
   cd backend
   npm run seed
   ```

## Environment Variables

### Production Environment Variables

#### Backend
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grocery-store
JWT_SECRET=super-secure-jwt-secret-for-production-min-32-chars
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.com
INVENTORY_API_KEY=your-production-inventory-api-key
DELIVERY_API_KEY=your-production-delivery-api-key
INVENTORY_API_URL=https://api.inventory-system.com
DELIVERY_API_URL=https://api.delivery-system.com
```

#### Frontend
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_APP_NAME=Fresh Grocery Store
NEXT_PUBLIC_APP_DESCRIPTION=Your one-stop shop for fresh groceries
```

## Alternative Deployment Options

### Backend Alternatives

#### 1. Heroku
```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-grocery-backend
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-atlas-connection-string
# ... other environment variables
git push heroku main
```

#### 2. DigitalOcean App Platform
- Connect GitHub repository
- Configure environment variables
- Deploy with automatic builds

#### 3. AWS Elastic Beanstalk
- Create application and environment
- Upload code or connect to GitHub
- Configure environment variables

### Frontend Alternatives

#### 1. Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
cd frontend
npm run build
netlify deploy --prod --dir=.next
```

#### 2. AWS Amplify
- Connect GitHub repository
- Configure build settings
- Add environment variables

#### 3. GitHub Pages (for static export)
```javascript
// next.config.js
module.exports = {
  output: 'export',
  images: { unoptimized: true }
}
```

## SSL and Security

### Enable HTTPS
- Most platforms (Vercel, Railway, Netlify) provide HTTPS by default
- For custom domains, ensure SSL certificates are configured

### Security Headers
Backend already includes:
- Helmet.js for security headers
- CORS configuration
- JWT token security

### Rate Limiting (Optional)
Add rate limiting for production:
```bash
npm install express-rate-limit
```

## Monitoring and Logging

### Recommended Tools
- **Error Tracking**: Sentry
- **Performance**: New Relic or DataDog
- **Logs**: Built-in platform logs or LogDNA

### Health Checks
The backend includes a health check endpoint:
```
GET /api/health
```

## Scaling Considerations

### Database
- Use MongoDB Atlas clusters for high availability
- Implement database indexing for better performance

### Backend
- Use PM2 for process management in production
- Implement Redis for session storage and caching
- Consider microservices architecture for large scale

### Frontend
- Use CDN for static assets
- Implement service workers for offline functionality
- Optimize images and implement lazy loading

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure FRONTEND_URL is correctly set in backend
   - Check CORS configuration in server.js

2. **Database Connection**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist settings
   - Ensure database user has proper permissions

3. **Environment Variables**
   - Double-check all environment variables are set
   - Restart services after updating variables

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check for TypeScript errors

### Support
- Check platform-specific documentation
- Use platform support channels
- Review application logs for errors
