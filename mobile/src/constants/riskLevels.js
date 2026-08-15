export const RISK_LEVELS = {
  LOW: {
    label: 'LOW RISK',
    color: '#10b981', // Emerald green
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#059669',
    description: 'Safe tourist environment with normal monitoring',
  },
  MODERATE: {
    label: 'MODERATE RISK',
    color: '#f59e0b', // Amber
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#d97706',
    description: 'Elevated crowd or traffic activity. Exercise awareness.',
  },
  HIGH: {
    label: 'HIGH RISK',
    color: '#f97316', // Orange
    bgColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: '#ea580c',
    description: 'Hazardous area. Caution advisories and notifications active.',
  },
  CRITICAL: {
    label: 'CRITICAL RISK',
    color: '#ef4444', // Red
    bgColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#dc2626',
    description: 'Urgent danger zone. Follow safer detour routes.',
  },
};

export const getRiskInfo = (score) => {
  if (score <= 25) return RISK_LEVELS.LOW;
  if (score <= 50) return RISK_LEVELS.MODERATE;
  if (score <= 75) return RISK_LEVELS.HIGH;
  return RISK_LEVELS.CRITICAL;
};
