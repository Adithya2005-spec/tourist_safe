const WAYPOINTS = [
  { lat: 12.9716, lon: 77.5946, name: 'Start' },
  { lat: 12.9730, lon: 77.5960, name: 'Safe Junction A' },
  { lat: 12.9745, lon: 77.5975, name: 'Safe Junction B' },
  { lat: 12.9760, lon: 77.5990, name: 'Safe Boulevard' },
  { lat: 12.9763, lon: 77.5929, name: 'Cubbon Park (Destination)' },
];

const FASTEST_WAYPOINTS = [
  { lat: 12.9716, lon: 77.5946, name: 'Start' },
  { lat: 12.9740, lon: 77.6020, name: 'MG Road Crossing' },
  { lat: 12.9763, lon: 77.5929, name: 'Cubbon Park (Destination)' },
];

const HIGH_RISK_ZONES_ON_FASTEST = ['MG Road (MODERATE)', 'Commercial Street entry'];

export const routingService = {
  getSaferRoute(fromLat, fromLon, toLat, toLon) {
    return {
      type: 'SAFER',
      label: 'Safer Route',
      distanceKm: 2.6,
      durationMins: 18,
      extraTimeMins: 8,
      riskLevel: 'LOW',
      riskScore: 18,
      avoids: ['Commercial Street (HIGH)', 'Shivajinagar (CRITICAL)'],
      waypoints: WAYPOINTS,
      description: 'Takes you through Cubbon Park area and safe residential roads. Avoids all HIGH and CRITICAL zones.',
      color: '#22c55e',
    };
  },

  getFastestRoute(fromLat, fromLon, toLat, toLon) {
    return {
      type: 'FASTEST',
      label: 'Fastest Route',
      distanceKm: 2.1,
      durationMins: 10,
      extraTimeMins: 0,
      riskLevel: 'HIGH',
      riskScore: 73,
      passes: HIGH_RISK_ZONES_ON_FASTEST,
      waypoints: FASTEST_WAYPOINTS,
      description: 'Direct route via MG Road. Passes through MODERATE and HIGH risk zones. Not recommended.',
      color: '#f97316',
    };
  },

  getBothRoutes(fromLat, fromLon, toLat, toLon) {
    return {
      safer: this.getSaferRoute(fromLat, fromLon, toLat, toLon),
      fastest: this.getFastestRoute(fromLat, fromLon, toLat, toLon),
    };
  },

  getRecommendedRoute(currentRiskScore) {
    // If risk is HIGH or CRITICAL, always recommend safer
    if (currentRiskScore >= 65) return 'SAFER';
    return 'SAFER'; // Default recommendation always safer for SIH
  },
};
