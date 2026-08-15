import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function IncidentCard({ incident, onPress }) {
  if (!incident) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <Text style={styles.incidentCode}>{incident.incident_code || 'INC-TEMP'}</Text>
          <View
            style={[
              styles.severityBadge,
              incident.severity === 'CRITICAL' && styles.criticalBadge,
            ]}
          >
            <Text
              style={[
                styles.severityText,
                incident.severity === 'CRITICAL' && styles.criticalText,
              ]}
            >
              {incident.severity || 'HIGH'}
            </Text>
          </View>
        </View>

        <Text style={styles.statusText}>{incident.current_status || 'NEW'}</Text>
      </View>

      <Text style={styles.typeText}>{incident.incident_type || 'Emergency'}</Text>
      <Text style={styles.descriptionText} numberOfLines={2}>
        {incident.description || 'No description provided'}
      </Text>

      {incident.assigned_responder && (
        <View style={styles.responderRow}>
          <Text style={styles.responderLabel}>Responder:</Text>
          <Text style={styles.responderValue}>{incident.assigned_responder}</Text>
          {incident.estimated_arrival_minutes && (
            <Text style={styles.etaText}> (ETA: {incident.estimated_arrival_minutes}m)</Text>
          )}
        </View>
      )}

      <View style={styles.footerRow}>
        <Text style={styles.timeText}>
          {new Date(incident.created_at || Date.now()).toLocaleTimeString()}
        </Text>
        {incident.blockchain_verified && (
          <View style={styles.blockchainBadge}>
            <Text style={styles.blockchainText}>⛓️ Ledger Verified</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  incidentCode: {
    fontSize: 13,
    fontWeight: '800',
    color: '#38bdf8',
    fontFamily: 'System',
  },
  severityBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  criticalBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#ef4444',
  },
  severityText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fbbf24',
  },
  criticalText: {
    color: '#f87171',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 16,
    marginBottom: 8,
  },
  responderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    padding: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  responderLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginRight: 4,
  },
  responderValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#38bdf8',
  },
  etaText: {
    fontSize: 11,
    color: '#fbbf24',
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 8,
  },
  timeText: {
    fontSize: 10,
    color: '#64748b',
  },
  blockchainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockchainText: {
    fontSize: 10,
    color: '#34d399',
    fontWeight: '700',
  },
});
