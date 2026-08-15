export const INCIDENT_TYPES = [
  { id: 'SOS', label: '🚨 Emergency SOS Beacon', severity: 'CRITICAL' },
  { id: 'Medical Emergency', label: '🚑 Medical Emergency', severity: 'HIGH' },
  { id: 'Accident', label: '🚗 Road Accident / Collision', severity: 'HIGH' },
  { id: 'Unsafe Area', label: '⚠️ Unsafe / Poorly Lit Area', severity: 'MEDIUM' },
  { id: 'Suspicious Activity', label: '👁️ Suspicious Activity / Harassment', severity: 'HIGH' },
  { id: 'Lost Tourist', label: '🗺️ Lost Tourist / Missing Member', severity: 'MEDIUM' },
  { id: 'Other', label: '📝 Other Incident', severity: 'LOW' },
];

export const INCIDENT_STATUSES = {
  NEW: { label: 'Incident Created', step: 1, color: '#38bdf8' },
  VERIFIED: { label: 'Verified by Operator', step: 2, color: '#818cf8' },
  ASSIGNED: { label: 'Unit Assigned', step: 3, color: '#fbbf24' },
  RESPONDING: { label: 'Responder En Route', step: 4, color: '#f97316' },
  RESOLVED: { label: 'Incident Resolved', step: 5, color: '#10b981' },
};
