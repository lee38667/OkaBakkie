const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    default: '/images/default-vendor.jpg'
  },
  bannerPhoto: {
    type: String,
    default: '/images/default-banner.jpg'
  },
  address: {
    street: String,
    city: String,
    region: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  foodType: {
    type: String,
    enum: ['bakery', 'cafe', 'restaurant', 'grocery', 'other'],
    required: true
  },
  surpriseBag: {
    price: {
      type: Number,
      required: true,
      min: 0
    },
    availableCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    originalPrice: {
      type: Number,
      required: true,
      min: 0
    }
  },
  pickupWindow: {
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    }
  },
  pickupInstructions: {
    type: String,
    default: 'Please ask for your Surprise Bag at the counter.'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create 2dsphere index for location queries
vendorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Vendor', vendorSchema);
