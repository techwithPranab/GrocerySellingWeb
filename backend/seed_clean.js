const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');
const Offer = require('./models/Offer');
const Category = require('./models/Category');
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
    await Category.deleteMany({});

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
