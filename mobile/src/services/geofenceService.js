import { locationService } from './locationService';

// Risk zones: { id, name, lat, lon, radiusMeters, risk, riskScore }
const GEOFENCE_ZONES = [
  { id: 1, name: 'Cubbon Park', lat: 12.9763, lon: 77.5929, radiusMeters: 500, risk: 'LOW', riskScore: 22 },
  { id: 2, name: 'MG Road', lat: 12.9756, lon: 77.6087, radiusMeters: 400, risk: 'MODERATE', riskScore: 54 },
  { id: 3, name: 'Commercial Street', lat: 12.9825, lon: 77.6076, radiusMeters: 350, risk: 'HIGH', riskScore: 73 },
  { id: 4, name: 'Shivajinagar', lat: 12.9849, lon: 77.6001, radiusMeters: 300, risk: 'CRITICAL', riskScore: 91 },
];

let _breachCallbacks = [];
let _lastBreaches = new Set();

export const geofenceService = {
  getZones() {
    return GEOFENCE_ZONES;
  },

  checkLocation(latitude, longitude) {
    const results = [];
    for (const zone of GEOFENCE_ZONES) {
      const dist = locationService.calculateDistance(latitude, longitude, zone.lat, zone.lon);
      const inside = dist <= zone.radiusMeters;
      results.push({ ...zone, inside, distanceMeters: Math.round(dist) });
    }
    return results;
  },

  getActiveBreaches(latitude, longitude) {
    return this.checkLocation(latitude, longitude).filter(z => z.inside);
  },

  getNearestZone(latitude, longitude) {
    const results = this.checkLocation(latitude, longitude);
    return results.reduce((a, b) => a.distanceMeters < b.distanceMeters ? a : b);
  },

  getHighestRiskActive(latitude, longitude) {
    const breaches = this.getActiveBreaches(latitude, longitude);
    if (!breaches.length) return null;
    return breaches.reduce((a, b) => b.riskScore > a.riskScore ? b : a);
  },

  onBreach(callback) {
    _breachCallbacks.push(callback);
    return () => {
      _breachCallbacks = _breachCallbacks.filter(cb => cb !== callback);
    };
  },

  processLocationUpdate(latitude, longitude) {
    const breaches = this.getActiveBreaches(latitude, longitude);
    const currentBreachIds = new Set(breaches.map(z => z.id));

    // New breaches (not seen before)
    for (const zone of breaches) {
      if (!_lastBreaches.has(zone.id)) {
        _breachCallbacks.forEach(cb => cb({ type: 'ENTERED', zone }));
      }
    }

    // Exited zones
    for (const id of _lastBreaches) {
      if (!currentBreachIds.has(id)) {
        const zone = GEOFENCE_ZONES.find(z => z.id === id);
        if (zone) _breachCallbacks.forEach(cb => cb({ type: 'EXITED', zone }));
      }
    }

    _lastBreaches = currentBreachIds;
    return breaches;
  },

  computeDynamicRiskScore(latitude, longitude) {
    const breaches = this.getActiveBreaches(latitude, longitude);
    const nearest = this.getNearestZone(latitude, longitude);

    if (breaches.length === 0) {
      // Outside all zones — compute based on distance to nearest
      const distFactor = Math.max(0, 1 - nearest.distanceMeters / 1000);
      return Math.round(nearest.riskScore * distFactor * 0.5);
    }

    const highest = this.getHighestRiskActive(latitude, longitude);
    return highest ? highest.riskScore : 20;
  },
};
