import { Platform } from 'react-native';

// Mock location for Expo Go / web — real Expo Location in production
let _watchId = null;
let _callbacks = [];
let _mockInterval = null;

// Bangalore demo coordinates with slight drift
const BASE_LAT = 12.9716;
const BASE_LON = 77.5946;

function getMockLocation() {
  const drift = 0.001;
  return {
    latitude: BASE_LAT + (Math.random() - 0.5) * drift,
    longitude: BASE_LON + (Math.random() - 0.5) * drift,
    accuracy: 10,
    speed: 0,
    heading: 0,
    timestamp: Date.now(),
  };
}

export const locationService = {
  async requestPermission() {
    // In real Expo: await Location.requestForegroundPermissionsAsync()
    return { status: 'granted' };
  },

  async getCurrentLocation() {
    // Returns mock location for demo; swap with real Expo Location in production
    return getMockLocation();
  },

  startWatching(callback, intervalMs = 5000) {
    _callbacks.push(callback);
    // Immediately call with current location
    callback(getMockLocation());
    // Poll every intervalMs
    _mockInterval = setInterval(() => {
      const loc = getMockLocation();
      _callbacks.forEach(cb => cb(loc));
    }, intervalMs);
    return _mockInterval;
  },

  stopWatching() {
    if (_mockInterval) {
      clearInterval(_mockInterval);
      _mockInterval = null;
    }
    _callbacks = [];
  },

  calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  },
};
