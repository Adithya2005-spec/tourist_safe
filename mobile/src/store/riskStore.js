import { create } from 'zustand';
import apiClient from '../services/api';
import { LocalStore } from '../utils/storage';
import { getRiskInfo } from '../constants/riskLevels';

export const useRiskStore = create((set, get) => ({
  riskScore: 18.5,
  riskLevel: 'LOW',
  riskInfo: getRiskInfo(18.5),
  riskZones: [],
  contributingFactors: null,
  lastEvaluationTime: new Date(),
  isLoading: false,

  fetchRiskZones: async () => {
    try {
      const res = await apiClient.get('/risk-zones');
      set({ riskZones: res.data });
      await LocalStore.cacheRiskZones(res.data);
    } catch (e) {
      // Fallback to cached risk zones
      const cached = await LocalStore.getCachedRiskZones();
      if (cached && cached.length > 0) {
        set({ riskZones: cached });
      }
    }
  },

  setDynamicRisk: (score, level, factors = null) => {
    set({
      riskScore: score,
      riskLevel: level,
      riskInfo: getRiskInfo(score),
      contributingFactors: factors,
      lastEvaluationTime: new Date(),
    });
  },

  predictSituationalRisk: async (features) => {
    set({ isLoading: true });
    try {
      const res = await apiClient.post('/risk/predict', features);
      const { risk_score, risk_level, contributing_factors } = res.data;
      get().setDynamicRisk(risk_score, risk_level, contributing_factors);
    } catch (e) {
      // Local fallback calculation
      const fallbackScore = Math.min(100, Math.max(0, (features.historical_risk || 30) * 0.4 + (features.recent_incidents || 0) * 5));
      const info = getRiskInfo(fallbackScore);
      get().setDynamicRisk(fallbackScore, info.label.replace(' RISK', ''), { note: 'Edge fallback prediction' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
