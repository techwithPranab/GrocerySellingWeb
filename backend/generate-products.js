const fs = require('fs');
const path = require('path');

// Define categories and their templates
const categories = {
  fruits: {
    names: [
      'Apple', 'Banana', 'Orange', 'Mango', 'Grapes', 'Pineapple', 'Strawberry', 'Blueberry',
      'Kiwi', 'Pear', 'Peach', 'Plum', 'Cherry', 'Watermelon', 'Muskmelon', 'Papaya',
      'Guava', 'Pomegranate', 'Lemon', 'Lime', 'Dragon Fruit', 'Avocado', 'Fig', 'Dates'
    ],
    brands: ['Fresh Farms', 'Organic Valley', 'Tropical Fruits', 'Seasonal Delights'],
    units: ['kg', 'piece'],
    priceRange: [1.99, 15.99],
    stockRange: [20, 200],
    expiryRange: [3, 14],
    tags: ['fresh', 'organic', 'healthy', 'vitamin-c', 'antioxidant', 'sweet', 'juicy']
  },
  vegetables: {
    names: [
      'Broccoli', 'Tomato', 'Onion', 'Potato', 'Spinach', 'Carrot', 'Cabbage', 'Cauliflower',
      'Capsicum', 'Brinjal', 'Lady Finger', 'Bitter Gourd', 'Bottle Gourd', 'Pumpkin', 'Radish',
      'Beetroot', 'Cucumber', 'Lettuce', 'Coriander', 'Mint', 'Green Chilli', 'Garlic', 'Ginger',
      'Drumstick', 'Beans', 'Peas'
    ],
    brands: ['Farm Fresh', 'Green Leaf', 'Nashik Farms', 'Punjab Produce'],
    units: ['kg', 'pack', 'bunch'],
    priceRange: [0.99, 5.99],
    stockRange: [30, 250],
    expiryRange: [2, 20],
    tags: ['fresh', 'green', 'healthy', 'leafy', 'crunchy', 'nutritious', 'organic']
  },
  dairy: {
    names: [
      'Milk', 'Cheese', 'Yogurt', 'Butter', 'Cream', 'Paneer', 'Curd', 'Ghee',
      'Ice Cream', 'Lassi', 'Buttermilk', 'Condensed Milk', 'Milk Powder', 'Cheese Slices',
      'Greek Yogurt', 'Cottage Cheese', 'Mozzarella', 'Feta'
    ],
    brands: ['Amul', 'FreshDairy', 'Dairy Best', 'Mother Dairy'],
    units: ['l', 'kg', 'pack', 'piece'],
    priceRange: [1.49, 8.99],
    stockRange: [15, 100],
    expiryRange: [2, 30],
    tags: ['dairy', 'fresh', 'protein', 'calcium', 'creamy', 'nutritious']
  },
  meat: {
    names: [
      'Chicken Breast', 'Chicken Thigh', 'Chicken Whole', 'Mutton', 'Beef', 'Fish Rohu',
      'Fish Catla', 'Fish Pomfret', 'Prawns', 'Eggs', 'Turkey', 'Duck', 'Lamb', 'Pork',
      'Sausages', 'Bacon', 'Salmon', 'Tuna'
    ],
    brands: ['Fresh Meat Co', 'Premium Meats', 'Sea Fresh', 'Farm Raised'],
    units: ['kg', 'pack', 'dozen'],
    priceRange: [3.99, 25.99],
    stockRange: [5, 50],
    expiryRange: [1, 3],
    tags: ['protein', 'fresh', 'lean', 'omega-3', 'antibiotic-free', 'organic']
  },
  grains: {
    names: [
      'Basmati Rice', 'Brown Rice', 'Wheat Flour', 'Maida', 'Moong Dal', 'Urad Dal',
      'Chana Dal', 'Toor Dal', 'Rajma', 'Chickpeas', 'Lentils', 'Oats', 'Quinoa',
      'Barley', 'Millet', 'Corn Flour', 'Semolina', 'Pasta', 'Noodles'
    ],
    brands: ['India Gate', 'Ashirvad', 'Tata Sampann', 'Fortune'],
    units: ['kg', 'pack'],
    priceRange: [2.49, 8.99],
    stockRange: [20, 100],
    expiryRange: [180, 730],
    tags: ['grains', 'protein', 'fiber', 'organic', 'premium', 'nutritious']
  },
  beverages: {
    names: [
      'Coca Cola', 'Pepsi', 'Sprite', 'Fanta', 'Mineral Water', 'Fruit Juice Orange',
      'Fruit Juice Apple', 'Fruit Juice Mango', 'Tea', 'Coffee', 'Energy Drink',
      'Sports Drink', 'Milkshake', 'Smoothie', 'Beer', 'Wine', 'Whiskey'
    ],
    brands: ['Coca Cola', 'PepsiCo', 'Real', 'Bisleri', 'Red Bull'],
    units: ['piece', 'pack', 'l', 'can'],
    priceRange: [0.99, 5.99],
    stockRange: [50, 200],
    expiryRange: [30, 365],
    tags: ['beverage', 'refreshing', 'carbonated', 'natural', 'energy', 'hydrating']
  },
  snacks: {
    names: [
      'Lays Chips', 'Oreo Biscuits', 'Kurkure', 'Bingo', 'Pringles', 'Doritos',
      'Cheetos', 'Popcorn', 'Chocolates', 'Candies', 'Cookies', 'Cake', 'Brownie',
      'Namkeen', 'Khakra', 'Mathri', 'Samosa', 'Pakora'
    ],
    brands: ['Lays', 'Oreo', 'Kurkure', 'Bingo', 'Pringles'],
    units: ['pack', 'piece'],
    priceRange: [0.99, 4.99],
    stockRange: [40, 150],
    expiryRange: [60, 180],
    tags: ['snack', 'crispy', 'sweet', 'salty', 'chocolate', 'fun', 'party']
  },
  household: {
    names: [
      'Surf Detergent', 'Harpic Cleaner', 'Colgate Toothpaste', 'Dettol Soap',
      'Ariel Detergent', 'Vim Dishwash', 'Lizol Floor Cleaner', 'Harpic Power Plus',
      'Pears Soap', 'Lifebuoy Soap', 'Rin Detergent', 'Wheel Detergent',
      'Fairy Dishwash', 'Domex Toilet Cleaner', 'Cif Cream Cleaner'
    ],
    brands: ['Surf Excel', 'Harpic', 'Colgate', 'Dettol', 'Ariel'],
    units: ['piece', 'pack', 'kg', 'l'],
    priceRange: [1.49, 6.99],
    stockRange: [20, 100],
    expiryRange: [180, 730],
    tags: ['cleaning', 'hygiene', 'fresh', 'powerful', 'germ-kill', 'stain-removal']
  }
};

// Function to generate random number between min and max
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to get random item from array
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to generate random tags
function generateTags(baseTags, count = 3) {
  const shuffled = [...baseTags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Function to generate images
function generateImages(name, count = 3) {
  const images = [];
  for (let i = 0; i < count; i++) {
    images.push({
      url: '/placeholder-product.png',
      alt: `${name} - View ${i + 1}`
    });
  }
  return images;
}

// Function to generate description
function generateDescription(name, category) {
  const descriptions = {
    fruits: `${name} - Fresh and nutritious fruit, perfect for healthy snacking.`,
    vegetables: `${name} - Fresh vegetable, rich in vitamins and minerals.`,
    dairy: `${name} - Premium dairy product, fresh and nutritious.`,
    meat: `${name} - Fresh meat, high in protein and essential nutrients.`,
    grains: `${name} - Quality grain product, perfect for daily meals.`,
    beverages: `${name} - Refreshing beverage, perfect for any occasion.`,
    snacks: `${name} - Delicious snack, great for munching.`,
    household: `${name} - Effective cleaning product for your home.`
  };
  return descriptions[category] || `${name} - High quality product.`;
}

// Generate products
const products = [];
const targetCount = 1000;
const categoryKeys = Object.keys(categories);

for (let i = 0; i < targetCount; i++) {
  const category = randomItem(categoryKeys);
  const catData = categories[category];
  const name = randomItem(catData.names);
  const brand = randomItem(catData.brands);
  const fullName = `${name} - ${brand}`;

  const product = {
    name: fullName,
    description: generateDescription(name, category),
    category: category,
    price: parseFloat(randomBetween(catData.priceRange[0], catData.priceRange[1]).toFixed(2)),
    stock: Math.floor(randomBetween(catData.stockRange[0], catData.stockRange[1])),
    unit: randomItem(catData.units),
    images: generateImages(fullName),
    isActive: Math.random() > 0.1, // 90% active
    isFeatured: Math.random() > 0.8, // 20% featured
    tags: generateTags(catData.tags),
    brand: brand,
    expiryDays: Math.floor(randomBetween(catData.expiryRange[0], catData.expiryRange[1])),
    averageRating: parseFloat(randomBetween(3.5, 5.0).toFixed(1)),
    totalReviews: Math.floor(randomBetween(10, 500))
  };

  products.push(product);
}

// Write to file
const filePath = path.join(__dirname, '..', 'data', 'comprehensive-products.json');
fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

console.log(`Generated ${products.length} products and saved to ${filePath}`);
