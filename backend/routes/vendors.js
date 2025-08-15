const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// GET /api/vendors - Get all active vendors with optional filtering
router.get('/', async (req, res) => {
  try {
    const { foodType, search, lat, lng, radius = 10 } = req.query;
    
    let query = { isActive: true, 'surpriseBag.availableCount': { $gt: 0 } };
    
    // Filter by food type
    if (foodType && foodType !== 'all') {
      query.foodType = foodType;
    }
    
    // Search by vendor name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    let vendors;
    
    // Filter by location if coordinates provided
    if (lat && lng) {
      vendors = await Vendor.find({
        ...query,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: radius * 1000 // Convert km to meters
          }
        }
      });
    } else {
      vendors = await Vendor.find(query);
    }
    
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

// GET /api/vendors/:id - Get vendor by ID
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    if (!vendor.isActive) {
      return res.status(404).json({ error: 'Vendor is not currently available' });
    }
    
    res.json(vendor);
  } catch (error) {
    console.error('Error fetching vendor:', error);
    res.status(500).json({ error: 'Failed to fetch vendor' });
  }
});

module.exports = router;
