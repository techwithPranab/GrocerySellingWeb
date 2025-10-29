const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate signature for signed upload
router.post('/signature', (req, res) => {
  try {
    const { folder, public_id } = req.body;
    
    // Validate environment variables
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        error: 'Cloudinary configuration missing',
        message: 'Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env file'
      });
    }
    
    // Parameters for the upload (only include what's necessary for signature)
    const params = {
      timestamp: Math.round(Date.now() / 1000),
      folder: folder || 'groceryweb/products/general'
    };

    // Add public_id if provided
    if (public_id) {
      params.public_id = public_id;
    }

    console.log('Generating signature with params:', params);

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET
    );

    console.log('Generated signature:', signature);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY);
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

    const response = {
      signature,
      timestamp: params.timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      folder: params.folder
      // Note: quality and fetch_format can be sent to Cloudinary without being in signature
    };

    console.log('Sending response:', response);

    res.json(response);
  } catch (error) {
    console.error('Error generating Cloudinary signature:', error);
    res.status(500).json({ 
      error: 'Failed to generate upload signature',
      message: error.message 
    });
  }
});

// Get upload configuration
router.get('/config', (req, res) => {
  try {
    res.json({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      // Don't expose api_secret in client-side requests
    });
  } catch (error) {
    console.error('Error getting Cloudinary config:', error);
    res.status(500).json({ 
      error: 'Failed to get upload configuration',
      message: error.message 
    });
  }
});

module.exports = router;
