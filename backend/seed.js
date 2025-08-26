const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');
const Offer = require('./models/Offer');
require('dotenv').config();
//cd /Users/pranabpaul/Desktop/Blog/GrocerySellingWeb/backend && node seed.js
const sampleProducts = [
  {
    name: 'Fresh Organic Apples',
    description: 'Premium quality organic apples, crisp and sweet',
    category: 'fruits',
    price: 4.99,
    stock: 100,
    unit: 'kg',
    images: [{ url: '/placeholder-product.png', alt: 'Fresh Organic Apples' }],
    isActive: true,
    isFeatured: true,
    tags: ['organic', 'fresh', 'healthy'],
    brand: 'OrganicFresh',
    expiryDays: 7
  },
  {
    name: 'Fresh Broccoli',
    description: 'Green and nutritious broccoli, perfect for healthy meals',
    category: 'vegetables',
    price: 3.49,
    stock: 50,
    unit: 'kg',
    images: [{ url: '/placeholder-product.png', alt: 'Fresh Broccoli' }],
    isActive: true,
    isFeatured: true,
    tags: ['fresh', 'healthy', 'green'],
    expiryDays: 5
  },
  {
    name: 'Whole Milk',
    description: 'Fresh whole milk from local dairy farms',
    category: 'dairy',
    price: 2.99,
    stock: 30,
    unit: 'l',
    images: [{ url: '/placeholder-product.png', alt: 'Whole Milk' }],
    isActive: true,
    isFeatured: false,
    tags: ['dairy', 'fresh'],
    brand: 'FreshDairy',
    expiryDays: 3
  }
];

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

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await Offer.deleteMany({});
    await User.deleteMany({ role: 'admin' }); // Only clear admin users, keep customer data

    // Insert sample products
    console.log('Inserting sample products...');
    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} products inserted`);

    // Insert sample offers
    console.log('Inserting sample offers...');
    await Offer.insertMany(sampleOffers);
    console.log(`${sampleOffers.length} offers inserted`);

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
