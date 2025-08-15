const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  bagCount: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'ready_for_pickup', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_collection'],
    default: 'cash_on_collection'
  },
  reservationNumber: {
    type: String,
    unique: true,
    required: true
  },
  pickupDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Generate unique reservation number before saving
reservationSchema.pre('save', function(next) {
  if (!this.reservationNumber) {
    this.reservationNumber = 'OB' + Date.now() + Math.random().toString(36).substr(2, 3).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);
