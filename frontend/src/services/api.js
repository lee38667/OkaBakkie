import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Vendor services
export const vendorService = {
  getAllVendors: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.foodType && filters.foodType !== 'all') {
        params.append('foodType', filters.foodType);
      }
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      if (filters.lat && filters.lng) {
        params.append('lat', filters.lat);
        params.append('lng', filters.lng);
        params.append('radius', filters.radius || 10);
      }
      
      const response = await api.get(`/vendors?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  },

  getVendorById: async (id) => {
    try {
      const response = await api.get(`/vendors/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor:', error);
      throw error;
    }
  }
};

// Reservation services
export const reservationService = {
  createReservation: async (reservationData) => {
    try {
      const response = await api.post('/reservations', reservationData);
      return response.data;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  getReservationsByPhone: async (phoneNumber) => {
    try {
      const response = await api.get(`/reservations/customer/${phoneNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  },

  cancelReservation: async (reservationId) => {
    try {
      const response = await api.patch(`/reservations/${reservationId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  }
};

// Admin services
export const adminService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/admin/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  getAllVendors: async (token) => {
    try {
      const response = await api.get('/admin/vendors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching admin vendors:', error);
      throw error;
    }
  },

  createVendor: async (vendorData, token) => {
    try {
      const response = await api.post('/admin/vendors', vendorData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw error;
    }
  },

  updateVendor: async (vendorId, vendorData, token) => {
    try {
      const response = await api.patch(`/admin/vendors/${vendorId}`, vendorData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating vendor:', error);
      throw error;
    }
  },

  getAllReservations: async (token) => {
    try {
      const response = await api.get('/admin/reservations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching admin reservations:', error);
      throw error;
    }
  }
};

export default api;
