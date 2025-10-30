const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');
const Offer = require('./models/Offer');
const Category = require('./models/Category');
const PromotionalProduct = require('./models/PromotionalProduct');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sampleCategories = [
  {
    name: 'Fresh Fruits',
    slug: 'fruits',
    description: 'Fresh and organic fruits delivered daily',
    isActive: true,
    displayOrder: 1
  },
  {
    name: 'Fresh Vegetables',
    slug: 'vegetables',
    description: 'Crisp and nutritious vegetables',
    isActive: true,
    displayOrder: 2
  },
  {
    name: 'Dairy Products',
    slug: 'dairy',
    description: 'Fresh milk, cheese, and dairy products',
    isActive: true,
    displayOrder: 3
  },
  {
    name: 'Meat & Seafood',
    slug: 'meat',
    description: 'Fresh meat and seafood products',
    isActive: true,
    displayOrder: 4
  },
  {
    name: 'Grains & Pulses',
    slug: 'grains',
    description: 'Rice, wheat, lentils and other grains',
    isActive: true,
    displayOrder: 5
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    description: 'Juices, soft drinks and beverages',
    isActive: true,
    displayOrder: 6
  },
  {
    name: 'Snacks & Packaged Foods',
    slug: 'snacks',
    description: 'Chips, cookies and packaged food items',
    isActive: true,
    displayOrder: 7
  },
  {
    name: 'Household Items',
    slug: 'household',
    description: 'Cleaning supplies and household essentials',
    isActive: true,
    displayOrder: 8
  }
];

// Load comprehensive products from JSON file
const sampleProducts = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/comprehensive-products.json'), 'utf8'));

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@freshgrocery.com',
    phone: '9876543210',
    passwordHash: 'admin123',
    role: 'admin',
    isActive: true
  },
  {
    name: 'Super Admin',
    email: 'superadmin@freshgrocery.com',
    phone: '9876543211',
    passwordHash: 'superadmin123',
    role: 'admin',
    isActive: true
  },
  {
    name: 'Demo Customer',
    email: 'customer@demo.com',
    phone: '9876543212',
    passwordHash: 'customer123',
    role: 'customer',
    isActive: true,
    addresses: [{
      type: 'home',
      street: '123 Demo Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India',
      isDefault: true
    }]
  }
];

const sampleOffers = [
  {
    code: 'FRESH10',
    title: '10% Off on Fresh Produce',
    description: 'Get 10% discount on all fresh fruits and vegetables',
    discountType: 'percentage',
    value: 10,
    minimumOrder: 500,
    maximumDiscount: 100,
    usageLimit: 100,
    usedCount: 0,
    isActive: true,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    applicableCategories: ['fruits', 'vegetables']
  },
  {
    code: 'WELCOME20',
    title: 'Welcome Offer - ₹20 Off',
    description: 'Flat ₹20 discount on your first order',
    discountType: 'fixed',
    value: 20,
    minimumOrder: 200,
    usageLimit: 1000,
    usedCount: 0,
    isActive: true,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'DAIRY15',
    title: '15% Off on Dairy Products',
    description: 'Special discount on all dairy products',
    discountType: 'percentage',
    value: 15,
    minimumOrder: 300,
    maximumDiscount: 50,
    usageLimit: 50,
    usedCount: 0,
    isActive: true,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    applicableCategories: ['dairy']
  }
];

const samplePromotionalProducts = [
  {
    title: 'Fresh Organic Fruits',
    description: 'Get 25% off on all organic fruits! Limited time offer on premium quality organic produce.',
    image: {
      url: '/api/placeholder/800/400',
      alt: 'Fresh Organic Fruits Banner'
    },
    discountType: 'percentage',
    discountValue: 25,
    originalPrice: null,
    discountedPrice: null,
    buttonText: 'Shop Organic Fruits',
    buttonLink: '/category/fruits',
    isActive: true,
    priority: 10,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    targetAudience: 'all'
  },
  {
    title: 'Premium Dairy Collection',
    description: 'Buy 2 Get 1 Free on selected dairy products! Fresh milk, cheese, and yogurt at unbeatable prices.',
    image: {
      url: '/api/placeholder/800/400',
      alt: 'Premium Dairy Collection Banner'
    },
    discountType: 'buy_one_get_one',
    discountValue: 1,
    originalPrice: null,
    discountedPrice: null,
    buttonText: 'Explore Dairy',
    buttonLink: '/category/dairy',
    isActive: true,
    priority: 9,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    targetAudience: 'all'
  },
  {
    title: 'Free Shipping on Orders Above ₹500',
    description: 'No delivery charges on orders above ₹500! Shop more, save more with free shipping.',
    image: {
      url: '/api/placeholder/800/400',
      alt: 'Free Shipping Banner'
    },
    discountType: 'free_shipping',
    discountValue: 0,
    originalPrice: null,
    discountedPrice: null,
    buttonText: 'Start Shopping',
    buttonLink: '/products',
    isActive: true,
    priority: 8,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    targetAudience: 'all'
  },
  {
    title: 'New Customer Special',
    description: 'Welcome bonus: ₹100 off on your first order! Sign up today and get instant discount.',
    image: {
      url: '/api/placeholder/800/400',
      alt: 'New Customer Welcome Banner'
    },
    discountType: 'fixed',
    discountValue: 100,
    originalPrice: null,
    discountedPrice: null,
    buttonText: 'Register Now',
    buttonLink: '/register',
    isActive: true,
    priority: 7,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    targetAudience: 'new_customers'
  },
  {
    title: 'Seasonal Vegetables Sale',
    description: '30% off on all seasonal vegetables! Fresh, nutritious, and budget-friendly.',
    image: {
      url: '/api/placeholder/800/400',
      alt: 'Seasonal Vegetables Sale Banner'
    },
    discountType: 'percentage',
    discountValue: 30,
    originalPrice: null,
    discountedPrice: null,
    buttonText: 'Shop Vegetables',
    buttonLink: '/category/vegetables',
    isActive: true,
    priority: 6,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    targetAudience: 'all'
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await Offer.deleteMany({});
    await User.deleteMany({}); // Clear all users for fresh seeding
    await Category.deleteMany({});
    await PromotionalProduct.deleteMany({});

    // Insert sample categories
    console.log('Inserting sample categories...');
    await Category.insertMany(sampleCategories);
    console.log(`${sampleCategories.length} categories inserted`);

    // Insert sample products
    console.log('Inserting sample products...');
    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} products inserted`);

    // Insert sample offers
    console.log('Inserting sample offers...');
    await Offer.insertMany(sampleOffers);
    console.log(`${sampleOffers.length} offers inserted`);

    // Insert sample promotional products
    console.log('Inserting sample promotional products...');
    await PromotionalProduct.insertMany(samplePromotionalProducts);
    console.log(`${samplePromotionalProducts.length} promotional products inserted`);

    // Insert sample users with hashed passwords
    console.log('Inserting sample users...');
    const usersWithHashedPasswords = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        passwordHash: await bcrypt.hash(user.passwordHash, 10)
      }))
    );
    await User.insertMany(usersWithHashedPasswords);
    console.log(`${sampleUsers.length} users inserted`);

    console.log('\n=== Demo Login Credentials ===');
    console.log('Admin Login:');
    console.log('Email: admin@freshgrocery.com');
    console.log('Password: admin123');
    console.log('\nSuper Admin Login:');
    console.log('Email: superadmin@freshgrocery.com');
    console.log('Password: superadmin123');
    console.log('\nDemo Customer Login:');
    console.log('Email: customer@demo.com');
    console.log('Password: customer123');
    console.log('===============================\n');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
