const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Vendor = require('../models/Vendor');

// POST /api/reservations - Create a new reservation
router.post('/', async (req, res) => {
  try {
    const { vendorId, customerName, customerPhone, customerEmail, bagCount = 1 } = req.body;
    
    // Validate required fields
    if (!vendorId || !customerName || !customerPhone) {
      return res.status(400).json({ 
        error: 'Vendor ID, customer name, and phone number are required' 
      });
    }
    
    // Check if vendor exists and has available bags
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    if (!vendor.isActive) {
      return res.status(400).json({ error: 'Vendor is not currently accepting orders' });
    }
    
    if (vendor.surpriseBag.availableCount < bagCount) {
      return res.status(400).json({ 
        error: `Only ${vendor.surpriseBag.availableCount} bags available` 
      });
    }
    
    // Calculate total price
    const totalPrice = vendor.surpriseBag.price * bagCount;
    
    // Create reservation
    const reservation = new Reservation({
      vendorId,
      customerName,
      customerPhone,
      customerEmail,
      bagCount,
      totalPrice,
      pickupDate: new Date() // For MVP, pickup is same day
    });
    
    await reservation.save();
    
    // Update vendor's available count
    vendor.surpriseBag.availableCount -= bagCount;
    await vendor.save();
    
    // Populate vendor info for response
    await reservation.populate('vendorId', 'name address pickupWindow');
    
    res.status(201).json({
      message: 'Reservation created successfully',
      reservation,
      whatsappMessage: `Hi ${customerName}! Your OkaBakkie reservation is confirmed. Pickup: ${vendor.name}, ${vendor.pickupWindow.start}-${vendor.pickupWindow.end}. Reservation #${reservation.reservationNumber}. Total: N$${totalPrice}`
    });
    
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// GET /api/reservations/:phone - Get reservations by phone number
router.get('/customer/:phone', async (req, res) => {
  try {
    const reservations = await Reservation.find({ 
      customerPhone: req.params.phone 
    })
    .populate('vendorId', 'name address pickupWindow')
    .sort({ createdAt: -1 });
    
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// PATCH /api/reservations/:id/cancel - Cancel a reservation
router.patch('/:id/cancel', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    if (reservation.status === 'cancelled' || reservation.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel this reservation' });
    }
    
    // Update reservation status
    reservation.status = 'cancelled';
    await reservation.save();
    
    // Return bags to vendor inventory
    const vendor = await Vendor.findById(reservation.vendorId);
    if (vendor) {
      vendor.surpriseBag.availableCount += reservation.bagCount;
      await vendor.save();
    }
    
    res.json({ message: 'Reservation cancelled successfully', reservation });
    
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
});

module.exports = router;
