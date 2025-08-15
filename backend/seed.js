const mongoose = require('mongoose');
const Vendor = require('./models/Vendor');
require('dotenv').config();

const seedVendors = [
  {
    name: "Windhoek Bakery",
    description: "Fresh bread, pastries, and baked goods daily. Our surprise bags contain a mix of day-old bread, croissants, and sweet treats perfect for families.",
    logo: "/images/windhoek-bakery-logo.jpg",
    bannerPhoto: "/images/windhoek-bakery-banner.jpg",
    address: {
      street: "123 Independence Avenue",
      city: "Windhoek",
      region: "Khomas"
    },
    location: {
      type: "Point",
      coordinates: [17.0658, -22.5609] // Windhoek coordinates
    },
    foodType: "bakery",
    surpriseBag: {
      price: 25,
      availableCount: 8,
      originalPrice: 60
    },
    pickupWindow: {
      start: "16:00",
      end: "18:00"
    },
    pickupInstructions: "Please ask for your OkaBakkie surprise bag at the main counter.",
    isActive: true
  },
  {
    name: "Café Schneider",
    description: "European-style café serving coffee, sandwiches, and light meals. Surprise bags include fresh sandwiches, salads, and pastries from our daily menu.",
    logo: "/images/cafe-schneider-logo.jpg",
    bannerPhoto: "/images/cafe-schneider-banner.jpg",
    address: {
      street: "78 Sam Nujoma Drive",
      city: "Windhoek",
      region: "Khomas"
    },
    location: {
      type: "Point",
      coordinates: [17.0756, -22.5570]
    },
    foodType: "cafe",
    surpriseBag: {
      price: 35,
      availableCount: 5,
      originalPrice: 80
    },
    pickupWindow: {
      start: "15:30",
      end: "17:30"
    },
    pickupInstructions: "Ask any staff member for your OkaBakkie order.",
    isActive: true
  },
  {
    name: "Stellenbosch Deli",
    description: "Gourmet deli with fresh salads, wraps, and prepared meals. Our surprise bags feature a selection of today's fresh items at amazing prices.",
    logo: "/images/stellenbosch-deli-logo.jpg",
    bannerPhoto: "/images/stellenbosch-deli-banner.jpg",
    address: {
      street: "45 Mandume Ndemufayo Avenue",
      city: "Windhoek",
      region: "Khomas"
    },
    location: {
      type: "Point",
      coordinates: [17.0850, -22.5750]
    },
    foodType: "restaurant",
    surpriseBag: {
      price: 45,
      availableCount: 3,
      originalPrice: 120
    },
    pickupWindow: {
      start: "17:00",
      end: "19:00"
    },
    pickupInstructions: "Please show your reservation number to the cashier.",
    isActive: true
  },
  {
    name: "UNAM Campus Café",
    description: "Student-friendly café offering affordable meals and snacks. Perfect for students looking for budget-friendly options near campus.",
    logo: "/images/unam-cafe-logo.jpg",
    bannerPhoto: "/images/unam-cafe-banner.jpg",
    address: {
      street: "UNAM Main Campus",
      city: "Windhoek",
      region: "Khomas"
    },
    location: {
      type: "Point",
      coordinates: [17.0683, -22.5568]
    },
    foodType: "cafe",
    surpriseBag: {
      price: 15,
      availableCount: 12,
      originalPrice: 40
    },
    pickupWindow: {
      start: "14:00",
      end: "16:00"
    },
    pickupInstructions: "Visit the café counter and mention OkaBakkie.",
    isActive: true
  },
  {
    name: "Kapana Corner",
    description: "Traditional Namibian street food with a modern twist. Our surprise bags contain a variety of local favorites and grilled specialties.",
    logo: "/images/kapana-corner-logo.jpg",
    bannerPhoto: "/images/kapana-corner-banner.jpg",
    address: {
      street: "Corner of Fidel Castro & Nelson Mandela",
      city: "Windhoek",
      region: "Khomas"
    },
    location: {
      type: "Point",
      coordinates: [17.0680, -22.5700]
    },
    foodType: "restaurant",
    surpriseBag: {
      price: 30,
      availableCount: 6,
      originalPrice: 75
    },
    pickupWindow: {
      start: "16:30",
      end: "18:30"
    },
    pickupInstructions: "Look for the OkaBakkie sign at our main stall.",
    isActive: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Connected to MongoDB');
    
    // Clear existing vendors
    await Vendor.deleteMany({});
    console.log('Cleared existing vendors');
    
    // Insert seed data
    await Vendor.insertMany(seedVendors);
    console.log('Seed data inserted successfully');
    
    console.log(`${seedVendors.length} vendors added to database`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
