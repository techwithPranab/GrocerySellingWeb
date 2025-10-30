const express = require('express');
const Product = require('../models/Product');
const Offer = require('../models/Offer');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Helper function to calculate discounted prices
const calculateDiscountedPrices = async (products) => {
  const currentDate = new Date();
  const activeOffers = await Offer.find({
    isActive: true,
    validFrom: { $lte: currentDate },
    validUntil: { $gte: currentDate }
  });

  return products.map(product => {
    let discountedPrice = product.price;
    let discountPercentage = 0;

    // Find applicable offers
    for (const offer of activeOffers) {
      let isApplicable = false;

      // Check if offer applies to this product's category
      if (offer.applicableCategories && offer.applicableCategories.length > 0) {
        isApplicable = offer.applicableCategories.includes(product.category);
      }

      // Check if offer applies to this specific product
      if (offer.applicableProducts && offer.applicableProducts.length > 0) {
        isApplicable = offer.applicableProducts.includes(product._id.toString());
      }

      // If no specific restrictions, apply to all products
      if ((!offer.applicableCategories || offer.applicableCategories.length === 0) &&
          (!offer.applicableProducts || offer.applicableProducts.length === 0)) {
        isApplicable = true;
      }

      if (isApplicable) {
        let discount = 0;
        if (offer.discountType === 'percentage') {
          discount = (product.price * offer.value) / 100;
          if (offer.maximumDiscount) {
            discount = Math.min(discount, offer.maximumDiscount);
          }
          discountPercentage = offer.value;
        } else {
          discount = offer.value;
          discountPercentage = Math.round((discount / product.price) * 100);
        }

        const newPrice = product.price - discount;
        if (newPrice < discountedPrice) {
          discountedPrice = newPrice;
        }
      }
    }

    return {
      ...product,
      discountedPrice: discountedPrice < product.price ? Math.max(0, discountedPrice) : undefined,
      discountPercentage: discountedPrice < product.price ? discountPercentage : undefined
    };
  });
};

// Get all products with filtering and pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    console.log('Fetching products with query:', req.query);
    const {
      page = 1,
      limit = 20,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(query)
    ]);

    // Calculate discounted prices
    const productsWithDiscounts = await calculateDiscountedPrices(products);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      message: 'Products retrieved successfully',
      products: productsWithDiscounts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get product by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate discounted price
    const [productWithDiscount] = await calculateDiscountedPrices([product]);

    res.json({
      message: 'Product retrieved successfully',
      product: productWithDiscount
    });

  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get product categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    
    res.json({
      message: 'Categories retrieved successfully',
      categories
    });

  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get promotional products
router.get('/promotional/list', optionalAuth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get products that have discounts or are featured with high ratings
    const products = await Product.find({
      isActive: true,
      $or: [
        { discountedPrice: { $exists: true, $ne: null } },
        { isFeatured: true, averageRating: { $gte: 4 } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(Number.parseInt(limit))
    .lean();

    // Calculate discounted prices
    const productsWithDiscounts = await calculateDiscountedPrices(products);

    res.json({
      message: 'Promotional products retrieved successfully',
      products: productsWithDiscounts
    });

  } catch (error) {
    console.error('Promotional products fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Search products
router.get('/search/query', optionalAuth, async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
    .limit(parseInt(limit))
    .lean();

    // Calculate discounted prices
    const productsWithDiscounts = await calculateDiscountedPrices(products);

    res.json({
      message: 'Search results retrieved successfully',
      products: productsWithDiscounts,
      searchQuery: q
    });

  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
