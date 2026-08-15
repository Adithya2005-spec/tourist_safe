import { create } from 'zustand';
import apiClient from '../services/api';
import { LocalStore } from '../utils/storage';

export const useIncidentStore = create((set, get) => ({
  incidents: [],
  activeIncident: null,
  offlineQueue: [],
  isLoading: false,

  fetchIncidents: async () => {
    try {
      const res = await apiClient.get('/incidents');
      set({ incidents: res.data });
      if (res.data.length > 0) {
        set({ activeIncident: res.data[0] });
      }
    } catch (e) {
      console.warn('Failed to fetch incidents', e);
    }
  },

  reportSOS: async (coords, riskScore, riskLevel, isOnline = true) => {
    set({ isLoading: true });
    const payload = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      current_risk_score: riskScore,
      current_risk_level: riskLevel,
      note: 'Emergency SOS Triggered by Tourist via Mobile HUD',
      created_at: new Date().toISOString(),
    };

    if (!isOnline) {
      // Queue offline
      const offlineItem = {
        id: `OFFLINE-${Date.now()}`,
        type: 'SOS',
        severity: 'CRITICAL',
        description: payload.note,
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: new Date().toISOString(),
        syncStatus: 'PENDING',
      };
      await LocalStore.saveOfflineIncident(offlineItem);
      const queue = await LocalStore.getOfflineIncidents();
      set({
        offlineQueue: queue,
        activeIncident: {
          incident_code: 'OFFLINE-SOS',
          incident_type: 'SOS',
          severity: 'CRITICAL',
          current_status: 'NEW',
          description: 'SOS Stored Locally - Pending Cloud Sync',
          created_at: new Date().toISOString(),
          blockchain_verified: false,
          offline: true,
        },
        isLoading: false,
      });
      return { success: true, offline: true };
    }

    try {
      const res = await apiClient.post('/sos', payload);
      set({ activeIncident: res.data, isLoading: false });
      await get().fetchIncidents();
      return { success: true, data: res.data };
    } catch (e) {
      // Fallback to offline queue on network error
      const offlineItem = {
        id: `OFFLINE-${Date.now()}`,
        type: 'SOS',
        severity: 'CRITICAL',
        description: payload.note,
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: new Date().toISOString(),
        syncStatus: 'PENDING',
      };
      await LocalStore.saveOfflineIncident(offlineItem);
      const queue = await LocalStore.getOfflineIncidents();
      set({
        offlineQueue: queue,
        activeIncident: {
          incident_code: 'OFFLINE-SOS',
          incident_type: 'SOS',
          severity: 'CRITICAL',
          current_status: 'NEW',
          description: 'Network failed. SOS Queued Locally (Pending Sync)',
          created_at: new Date().toISOString(),
          blockchain_verified: false,
          offline: true,
        },
        isLoading: false,
      });
      return { success: true, offline: true };
    }
  },

  syncOfflineQueue: async () => {
    const queue = await LocalStore.getOfflineIncidents();
    if (!queue || queue.length === 0) return { count: 0 };

    let syncedCount = 0;
    for (const item of queue) {
      if (item.syncStatus === 'PENDING') {
        try {
          if (item.type === 'SOS') {
            await apiClient.post('/sos', {
              latitude: item.latitude,
              longitude: item.longitude,
              note: item.description,
            });
          } else {
            await apiClient.post('/incidents', {
              incident_type: item.type,
              severity: item.severity,
              latitude: item.latitude,
              longitude: item.longitude,
              description: item.description,
              offline_created_at: item.timestamp,
            });
          }
          item.syncStatus = 'SYNCED';
          syncedCount++;
        } catch (e) {
          item.syncStatus = 'FAILED';
        }
      }
    }

    // Remove fully synced items
    const remaining = queue.filter((i) => i.syncStatus !== 'SYNCED');
    if (remaining.length === 0) {
      await LocalStore.clearOfflineIncidents();
    }
    set({ offlineQueue: remaining });
    await get().fetchIncidents();
    return { count: syncedCount };
  },

  updateIncidentStatusLocal: (incidentCode, newStatus, responder = null, eta = null) => {
    set((state) => {
      const updatedIncidents = state.incidents.map((inc) =>
        inc.incident_code === incidentCode
          ? { ...inc, current_status: newStatus, assigned_responder: responder || inc.assigned_responder, estimated_arrival_minutes: eta || inc.estimated_arrival_minutes }
          : inc
      );
      const updatedActive =
        state.activeIncident?.incident_code === incidentCode
          ? { ...state.activeIncident, current_status: newStatus, assigned_responder: responder || state.activeIncident.assigned_responder, estimated_arrival_minutes: eta || state.activeIncident.estimated_arrival_minutes }
          : state.activeIncident;
      return { incidents: updatedIncidents, activeIncident: updatedActive };
    });
  },
}));
