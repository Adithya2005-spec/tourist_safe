import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH_TOKEN: 'touristsafe_auth_token',
  CACHED_USER: 'touristsafe_cached_user',
  CACHED_RISK_ZONES: 'touristsafe_cached_risk_zones',
  CACHED_RISK_SCORE: 'touristsafe_cached_risk_score',
  OFFLINE_INCIDENT_QUEUE: 'touristsafe_offline_incident_queue',
  EMERGENCY_CONTACTS: 'touristsafe_emergency_contacts',
};

export const LocalStore = {
  async saveToken(token) {
    try {
      await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
    } catch (e) {
      console.warn('Error saving token', e);
    }
  },
  async getToken() {
    try {
      return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
    } catch (e) {
      return null;
    }
  },
  async removeToken() {
    try {
      await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
    } catch (e) {}
  },
  async cacheRiskZones(zones) {
    try {
      await AsyncStorage.setItem(KEYS.CACHED_RISK_ZONES, JSON.stringify(zones));
    } catch (e) {}
  },
  async getCachedRiskZones() {
    try {
      const data = await AsyncStorage.getItem(KEYS.CACHED_RISK_ZONES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  async getOfflineIncidents() {
    try {
      const data = await AsyncStorage.getItem(KEYS.OFFLINE_INCIDENT_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  async saveOfflineIncident(incident) {
    try {
      const current = await this.getOfflineIncidents();
      current.push(incident);
      await AsyncStorage.setItem(KEYS.OFFLINE_INCIDENT_QUEUE, JSON.stringify(current));
    } catch (e) {}
  },
  async clearOfflineIncidents() {
    try {
      await AsyncStorage.removeItem(KEYS.OFFLINE_INCIDENT_QUEUE);
    } catch (e) {}
  },
};
