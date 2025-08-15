const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const Reservation = require('../models/Reservation');

// Simple auth middleware for admin routes
const adminAuth = (req, res, next) => {
  const { email, password } = req.body;
  
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
};

// POST /api/admin/login - Admin login
router.post('/login', adminAuth, (req, res) => {
  res.json({ 
    message: 'Admin login successful',
    token: 'admin_authenticated' // Simple token for MVP
  });
});

// POST /api/admin/vendors - Create new vendor
router.post('/vendors', (req, res) => {
  // Simple auth check
  if (req.headers.authorization !== 'Bearer admin_authenticated') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  createVendor(req, res);
});

// PATCH /api/admin/vendors/:id - Update vendor
router.patch('/vendors/:id', (req, res) => {
  // Simple auth check
  if (req.headers.authorization !== 'Bearer admin_authenticated') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  updateVendor(req, res);
});

// GET /api/admin/vendors - Get all vendors (including inactive)
router.get('/vendors', (req, res) => {
  // Simple auth check
  if (req.headers.authorization !== 'Bearer admin_authenticated') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  getAllVendors(req, res);
});

// GET /api/admin/reservations - Get all reservations
router.get('/reservations', (req, res) => {
  // Simple auth check
  if (req.headers.authorization !== 'Bearer admin_authenticated') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  getAllReservations(req, res);
});

// Implementation functions
async function createVendor(req, res) {
  try {
    const vendorData = req.body;
    
    // Validate required fields
    const required = ['name', 'description', 'foodType', 'surpriseBag', 'pickupWindow', 'location'];
    for (const field of required) {
      if (!vendorData[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }
    
    const vendor = new Vendor(vendorData);
    await vendor.save();
    
    res.status(201).json({ message: 'Vendor created successfully', vendor });
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ error: 'Failed to create vendor' });
  }
}

async function updateVendor(req, res) {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    res.json({ message: 'Vendor updated successfully', vendor });
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ error: 'Failed to update vendor' });
  }
}

async function getAllVendors(req, res) {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
}

async function getAllReservations(req, res) {
  try {
    const reservations = await Reservation.find()
      .populate('vendorId', 'name')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
}

module.exports = router;
