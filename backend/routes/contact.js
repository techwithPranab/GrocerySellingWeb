const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Submit contact form (public route)
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, email, phone, subject, message } = req.body;

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });

    await contact.save();

    res.status(201).json({
      message: 'Your message has been sent successfully. We will get back to you soon.',
      contactId: contact._id
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all contacts (admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }

    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Contact.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      message: 'Contacts retrieved successfully',
      contacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalContacts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Contacts fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get contact by ID (admin only)
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({
      message: 'Contact retrieved successfully',
      contact
    });

  } catch (error) {
    console.error('Contact fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update contact status/notes (admin only)
router.put('/:id', authenticate, requireAdmin, [
  body('status').optional().isIn(['new', 'in_progress', 'resolved', 'closed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('adminNotes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { status, priority, adminNotes } = req.body;
    const updateData = {};

    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    // Set response date when status changes to resolved or closed
    if (status === 'resolved' || status === 'closed') {
      updateData.responseDate = new Date();
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({
      message: 'Contact updated successfully',
      contact
    });

  } catch (error) {
    console.error('Contact update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete contact (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Contact delete error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
