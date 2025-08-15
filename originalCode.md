import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Search, User, Heart } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navigationItems = [
    { name: "Browse", path: createPageUrl("Browse"), icon: Search },
    { name: "Saved", path: createPageUrl("Saved"), icon: Heart },
    { name: "Profile", path: createPageUrl("Profile"), icon: User }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex flex-col">
      <style>{`
        :root {
          --primary: 230 70% 55%;
          --primary-foreground: 0 0% 100%;
          --secondary: 25 75% 95%;
          --secondary-foreground: 15 75% 25%;
          --accent: 25 75% 90%;
          --accent-foreground: 15 75% 30%;
          --background: 30 50% 96%;
          --foreground: 15 25% 15%;
          --card: 0 0% 100%;
          --card-foreground: 15 25% 15%;
          --border: 25 25% 85%;
          --ring: 230 70% 55%;
        }
      `}</style>
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/0afc3e33b_Okabakkielogo.png" 
                alt="Oka'bakkie Logo" 
                className="w-10 h-10"
              />
              <h1 className="text-xl font-bold text-orange-600">Oka'bakkie</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-orange-100 z-50">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around py-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? "text-orange-600 bg-orange-50"
                    : "text-gray-500 hover:text-orange-500"
                }`}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}





import React, { useState, useEffect } from "react";
import { FoodBag, Business } from "@/entities/all";
import { MapPin, Clock, Star, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FoodBagCard from "../components/browse/FoodBagCard";
import CategoryFilter from "../components/browse/CategoryFilter";

export default function Browse() {
  const [foodBags, setFoodBags] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bagsData, businessData] = await Promise.all([
        FoodBag.filter({ is_available: true }, "-created_date"),
        Business.filter({ is_active: true })
      ]);
      setFoodBags(bagsData);
      setBusinesses(businessData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBusinessForBag = (businessSlug) => {
    return businesses.find(b => b.slug === businessSlug);
  };

  const filteredBags = foodBags.filter(bag => {
    if (selectedCategory === "all") return true;
    const business = getBusinessForBag(bag.business_slug);
    return business?.cuisine_type === selectedCategory;
  });

  return (
    <div className="p-4 space-y-6">
      {/* Hero Section */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-orange-600 mb-2">
          Rescue delicious food
        </h2>
        <p className="text-orange-700 text-sm leading-relaxed">
          Save amazing meals from going to waste while supporting local businesses
        </p>
      </div>

      {/* Category Filter */}
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Food Bags Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="grid gap-4">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="h-32 bg-gray-200 rounded-t-lg" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredBags.length > 0 ? (
          filteredBags.map((bag) => (
            <FoodBagCard 
              key={bag.id}
              bag={bag}
              business={getBusinessForBag(bag.business_slug)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/0afc3e33b_Okabakkielogo.png" 
                alt="Oka'bakkie" 
                className="w-8 h-8"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No bags available right now
            </h3>
            <p className="text-gray-600 text-sm">
              Check back later for new rescue opportunities!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}



import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, Heart, Package } from "lucide-react";
import { format } from "date-fns";

export default function FoodBagCard({ bag, business }) {
  if (!business) return null;

  const savingsPercentage = Math.round(((bag.original_price - bag.discounted_price) / bag.original_price) * 100);
  
  const getCuisineIcon = (type) => {
    const icons = {
      restaurant: "🍽️",
      bakery: "🥖",
      grocery: "🛒",
      cafe: "☕",
      fast_food: "🍔",
      deli: "🥪",
      other: "🍴"
    };
    return icons[type] || "🍴";
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white border-orange-100">
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative h-32 bg-gradient-to-br from-orange-100 to-orange-200">
          {bag.image_url ? (
            <img 
              src={bag.image_url} 
              alt={bag.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-4xl">{getCuisineIcon(business.cuisine_type)}</div>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0">
              -{savingsPercentage}%
            </Badge>
          </div>
          <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Business Info */}
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {business.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{business.address}</span>
            </div>
            {business.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{business.rating}</span>
              </div>
            )}
          </div>

          {/* Bag Info */}
          <div className="space-y-2">
            <h4 className="font-medium text-green-900">{bag.title}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{bag.description}</p>
          </div>

          {/* Pickup Time */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-3 h-3" />
            <span>
              Today {bag.pickup_start_time} - {bag.pickup_end_time}
            </span>
          </div>

          {/* Price and Availability */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-orange-600">
                  ${bag.discounted_price?.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${bag.original_price?.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Package className="w-3 h-3" />
                <span>{bag.quantity_available} left</span>
              </div>
            </div>
            <Button 
              size="sm" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-4"
            >
              Reserve
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}




import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const categories = [
    { id: "all", label: "All", emoji: "🍽️" },
    { id: "restaurant", label: "Restaurant", emoji: "🍽️" },
    { id: "bakery", label: "Bakery", emoji: "🥖" },
    { id: "grocery", label: "Grocery", emoji: "🛒" },
    { id: "cafe", label: "Café", emoji: "☕" },
    { id: "fast_food", label: "Fast Food", emoji: "🍔" }
  ];

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 p-1">
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`cursor-pointer px-3 py-2 transition-all duration-200 ${
              selectedCategory === category.id
                ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                : "hover:bg-orange-50 hover:border-orange-200 text-gray-700"
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            <span className="mr-1">{category.emoji}</span>
            {category.label}
          </Badge>
        ))}
      </div>
    </ScrollArea>
  );
}



import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Search, User, Heart } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navigationItems = [
    { name: "Browse", path: createPageUrl("Browse"), icon: Search },
    { name: "Saved", path: createPageUrl("Saved"), icon: Heart },
    { name: "Profile", path: createPageUrl("Profile"), icon: User }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex flex-col">
      <style>{`
        :root {
          --primary: 230 70% 55%;
          --primary-foreground: 0 0% 100%;
          --secondary: 25 75% 95%;
          --secondary-foreground: 15 75% 25%;
          --accent: 25 75% 90%;
          --accent-foreground: 15 75% 30%;
          --background: 30 50% 96%;
          --foreground: 15 25% 15%;
          --card: 0 0% 100%;
          --card-foreground: 15 25% 15%;
          --border: 25 25% 85%;
          --ring: 230 70% 55%;
        }
      `}</style>
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/0afc3e33b_Okabakkielogo.png" 
                alt="Oka'bakkie Logo" 
                className="w-10 h-10"
              />
              <h1 className="text-xl font-bold text-orange-600">Oka'bakkie</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-orange-100 z-50">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around py-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? "text-orange-600 bg-orange-50"
                    : "text-gray-500 hover:text-orange-500"
                }`}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
