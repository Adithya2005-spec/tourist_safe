import { create } from 'zustand';
import { calculateHaversineDistance } from '../utils/haversine';
import apiClient from '../services/api';

export const useLocationStore = create((set, get) => ({
  latitude: 12.9716, // Default Bangalore Center (Cubbon Park)
  longitude: 77.5946,
  accuracy: 4.5,
  locationName: 'Cubbon Park Heritage Area (Safe Zone)',
  lastUpdated: new Date(),
  isTracking: false,
  activeBreaches: [],

  setLocation: (lat, lon, name = null) => {
    set({
      latitude: lat,
      longitude: lon,
      locationName: name || 'Current Monitored Location',
      lastUpdated: new Date(),
    });
  },

  syncLocationToServer: async () => {
    const { latitude, longitude, accuracy } = get();
    try {
      const res = await apiClient.post('/locations', {
        latitude,
        longitude,
        accuracy,
      });
      if (res.data?.breaches) {
        set({ activeBreaches: res.data.breaches });
      }
    } catch (e) {
      // Offline mode - handled gracefully
    }
  },
}));
