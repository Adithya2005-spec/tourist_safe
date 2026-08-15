export const API_BASE_URL = 'http://10.0.2.2:8000'; // Standard Android Emulator localhost mapping
export const WS_BASE_URL = 'ws://10.0.2.2:8000/ws';

export const CONFIG = {
  USE_MOCK_API: false, // Switch to true for offline standalone demonstration
  LOCATION_UPDATE_INTERVAL_MS: 10000,
  FASTEST_ROUTE_MOCK_DISTANCE_KM: 2.1,
  SAFER_ROUTE_MOCK_DISTANCE_KM: 2.6,
  DEFAULT_MAP_COORDINATES: {
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  },
};
