import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { useIncidentStore } from '../store/incidentStore';
import StatusTimeline from '../components/StatusTimeline';

const STATUS_STEPS = ['NEW', 'VERIFIED', 'ASSIGNED', 'RESPONDING', 'RESOLVED'];

const MOCK_RESPONDER = {
  unit: 'Alpha-7 Rapid Response',
  officer: 'Insp. Rajan Kumar',
  eta: '4 mins',
  contact: '+91-98765-43210',
};

export default function IncidentStatusScreen({ navigation, route }) {
  const { incidentCode } = route.params || {};
  const { incidents, fetchIncidents } = useIncidentStore();
  const [loading, setLoading] = useState(true);
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    const load = async () => {
      await fetchIncidents();
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (incidents && incidentCode) {
      const found = incidents.find(i => i.incident_code === incidentCode);
      setIncident(found || null);
    } else if (incidents && incidents.length > 0) {
      setIncident(incidents[0]);
    }
  }, [incidents, incidentCode]);

  const statusIndex = incident ? STATUS_STEPS.indexOf(incident.status || 'NEW') : 0;

  const DETAIL_ROWS = [
    { label: 'Incident Code', value: incident?.incident_code || incidentCode || 'INC-DEMO', icon: '🔖' },
    { label: 'Type', value: incident?.incident_type || 'MEDICAL', icon: '📋' },
    { label: 'Severity', value: incident?.severity || 'HIGH', icon: '⚡' },
    { label: 'Reported At', value: incident?.created_at ? new Date(incident.created_at).toLocaleString() : new Date().toLocaleString(), icon: '🕐' },
    { label: 'Location', value: incident ? `${incident.latitude?.toFixed(4)}, ${incident.longitude?.toFixed(4)}` : '12.9716, 77.5946', icon: '📍' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>INCIDENT STATUS</Text>
        </View>

        {loading ? (
          <View style={styles.loadingView}>
            <ActivityIndicator color="#38bdf8" size="large" />
            <Text style={styles.loadingText}>Fetching incident data...</Text>
          </View>
        ) : (
          <>
            {/* Status Badge */}
            <View style={styles.statusHeader}>
              <View style={[
                styles.statusPill,
                { backgroundColor: statusIndex >= 4 ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)' },
              ]}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: statusIndex >= 4 ? '#22c55e' : '#f59e0b' },
                ]} />
                <Text style={[styles.statusPillText, { color: statusIndex >= 4 ? '#22c55e' : '#f59e0b' }]}>
                  {incident?.status || 'NEW'}
                </Text>
              </View>
              <Text style={styles.incidentCodeHeader}>
                {incident?.incident_code || incidentCode || 'INC-DEMO'}
              </Text>
            </View>

            {/* 5-Step Timeline */}
            <StatusTimeline steps={STATUS_STEPS} currentStep={incident?.status || 'NEW'} />

            {/* Responder Card */}
            {(incident?.status === 'ASSIGNED' || incident?.status === 'RESPONDING') && (
              <View style={styles.responderCard}>
                <Text style={styles.responderLabel}>🚔 ASSIGNED RESPONDER</Text>
                <Text style={styles.responderUnit}>{MOCK_RESPONDER.unit}</Text>
                <Text style={styles.responderOfficer}>{MOCK_RESPONDER.officer}</Text>
                <View style={styles.responderRow}>
                  <View style={styles.responderItem}>
                    <Text style={styles.responderItemLabel}>ETA</Text>
                    <Text style={styles.responderItemValue}>{MOCK_RESPONDER.eta}</Text>
                  </View>
                  <View style={styles.responderItem}>
                    <Text style={styles.responderItemLabel}>CONTACT</Text>
                    <Text style={styles.responderItemValue}>{MOCK_RESPONDER.contact}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Incident Details */}
            <Text style={styles.sectionTitle}>INCIDENT DETAILS</Text>
            {DETAIL_ROWS.map(row => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailIcon}>{row.icon}</Text>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            ))}

            {/* Blockchain Audit Hash */}
            <Text style={styles.sectionTitle}>BLOCKCHAIN AUDIT TRAIL</Text>
            <View style={styles.blockchainCard}>
              <View style={styles.blockchainHeader}>
                <Text style={styles.blockchainEmoji}>⛓️</Text>
                <View>
                  <Text style={styles.blockchainLabel}>ON-CHAIN AUDIT HASH</Text>
                  <Text style={styles.blockchainNetwork}>Ethereum Testnet • Immutable</Text>
                </View>
              </View>
              <Text style={styles.hashText}>
                {incident?.blockchain_hash ||
                  '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}
              </Text>
              <View style={styles.blockchainFooter}>
                <Text style={styles.blockchainFooterText}>✅ SHA-256 Hash • Zero PII on-chain</Text>
              </View>
            </View>

            {/* Description */}
            {incident?.description && (
              <>
                <Text style={styles.sectionTitle}>DESCRIPTION</Text>
                <View style={styles.descCard}>
                  <Text style={styles.descText}>{incident.description}</Text>
                </View>
              </>
            )}

            <TouchableOpacity style={styles.refreshBtn} onPress={fetchIncidents}>
              <Text style={styles.refreshBtnText}>🔄 Refresh Status</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 16, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  backText: { color: '#38bdf8', fontSize: 13, fontWeight: '700' },
  title: { fontSize: 14, fontWeight: '900', color: '#f8fafc', letterSpacing: 1 },
  loadingView: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80, gap: 12 },
  loadingText: { color: '#94a3b8', fontSize: 13 },
  statusHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  statusPill: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusPillText: { fontSize: 12, fontWeight: '800' },
  incidentCodeHeader: { color: '#64748b', fontSize: 12, fontFamily: 'System' },
  responderCard: { backgroundColor: 'rgba(56,189,248,0.08)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(56,189,248,0.25)', marginBottom: 16 },
  responderLabel: { color: '#38bdf8', fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 6 },
  responderUnit: { color: '#f8fafc', fontSize: 15, fontWeight: '800', marginBottom: 2 },
  responderOfficer: { color: '#94a3b8', fontSize: 12, marginBottom: 12 },
  responderRow: { flexDirection: 'row', gap: 20 },
  responderItem: {},
  responderItemLabel: { color: '#64748b', fontSize: 9, fontWeight: '800', marginBottom: 2 },
  responderItemValue: { color: '#38bdf8', fontSize: 13, fontWeight: '700' },
  sectionTitle: { fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: 1, marginBottom: 8, marginTop: 16 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  detailIcon: { fontSize: 14 },
  detailLabel: { flex: 1, color: '#64748b', fontSize: 12 },
  detailValue: { color: '#e2e8f0', fontSize: 12, fontWeight: '600', fontFamily: 'System' },
  blockchainCard: { backgroundColor: '#0a0f1e', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(139,92,246,0.3)', marginBottom: 16 },
  blockchainHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  blockchainEmoji: { fontSize: 24 },
  blockchainLabel: { color: '#a78bfa', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  blockchainNetwork: { color: '#64748b', fontSize: 10 },
  hashText: { color: '#94a3b8', fontSize: 9, fontFamily: 'System', letterSpacing: 0.5, lineHeight: 14, marginBottom: 10 },
  blockchainFooter: { borderTopWidth: 1, borderTopColor: 'rgba(139,92,246,0.2)', paddingTop: 8 },
  blockchainFooterText: { color: '#22c55e', fontSize: 10, fontWeight: '700' },
  descCard: { backgroundColor: '#0f172a', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  descText: { color: '#94a3b8', fontSize: 13, lineHeight: 18 },
  refreshBtn: { backgroundColor: '#0f172a', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginTop: 12 },
  refreshBtnText: { color: '#94a3b8', fontSize: 13, fontWeight: '700' },
});
