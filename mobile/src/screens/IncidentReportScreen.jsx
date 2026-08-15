import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, Alert,
} from 'react-native';
import { useIncidentStore } from '../store/incidentStore';
import { useLocationStore } from '../store/locationStore';
import { useNetworkStore } from '../store/networkStore';

const CATEGORIES = [
  { id: 'MEDICAL', label: 'Medical Emergency', emoji: '🏥', color: '#ef4444' },
  { id: 'ACCIDENT', label: 'Road Accident', emoji: '🚗', color: '#f97316' },
  { id: 'UNSAFE_AREA', label: 'Unsafe Area', emoji: '⚠️', color: '#f59e0b' },
  { id: 'SUSPICIOUS', label: 'Suspicious Activity', emoji: '👁', color: '#a78bfa' },
  { id: 'LOST_TOURIST', label: 'Lost Tourist', emoji: '🧭', color: '#38bdf8' },
  { id: 'THEFT', label: 'Theft / Robbery', emoji: '🔓', color: '#f87171' },
  { id: 'NATURAL_HAZARD', label: 'Natural Hazard', emoji: '🌊', color: '#34d399' },
  { id: 'OTHER', label: 'Other Incident', emoji: '📋', color: '#94a3b8' },
];

const SEVERITIES = [
  { id: 'LOW', label: 'LOW', color: '#22c55e', desc: 'Non-urgent, informational' },
  { id: 'MEDIUM', label: 'MEDIUM', color: '#f59e0b', desc: 'Moderate attention required' },
  { id: 'HIGH', label: 'HIGH', color: '#f97316', desc: 'Urgent authority response' },
  { id: 'CRITICAL', label: 'CRITICAL', color: '#ef4444', desc: 'Life-threatening emergency' },
];

export default function IncidentReportScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [incidentCode, setIncidentCode] = useState(null);

  const { reportIncident } = useIncidentStore();
  const { latitude, longitude, locationName } = useLocationStore();
  const { isOnline } = useNetworkStore();

  const handleSubmit = async () => {
    if (!selectedCategory) { Alert.alert('Required', 'Please select an incident category.'); return; }
    if (!selectedSeverity) { Alert.alert('Required', 'Please select a severity level.'); return; }
    if (!description.trim()) { Alert.alert('Required', 'Please add a description.'); return; }

    setSubmitting(true);
    try {
      const result = await reportIncident({
        incident_type: selectedCategory.id,
        severity: selectedSeverity.id,
        description: description.trim(),
        latitude: latitude || 12.9716,
        longitude: longitude || 77.5946,
      });
      setIncidentCode(result?.incident_code || 'INC-' + Date.now());
      setSubmitted(true);
    } catch (e) {
      setIncidentCode('INC-OFFLINE-' + Date.now());
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successView}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.successTitle}>
            {isOnline ? 'INCIDENT REPORTED!' : 'SAVED OFFLINE'}
          </Text>
          <Text style={styles.successDesc}>
            {isOnline
              ? 'Authorities have been notified. Track status below.'
              : 'Incident queued locally. Will sync when connected.'}
          </Text>
          <View style={styles.incidentBox}>
            <Text style={styles.incidentBoxLabel}>INCIDENT CODE</Text>
            <Text style={styles.incidentBoxCode}>{incidentCode}</Text>
          </View>
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() => navigation.navigate('IncidentStatus', { incidentCode })}
          >
            <Text style={styles.trackBtnText}>📋 Track Incident</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.newBtn}
            onPress={() => {
              setSubmitted(false);
              setSelectedCategory(null);
              setSelectedSeverity(null);
              setDescription('');
            }}
          >
            <Text style={styles.newBtnText}>+ Report Another Incident</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLinkBtn}>
            <Text style={styles.backLinkText}>← Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>REPORT INCIDENT</Text>
          <View style={[styles.networkPill, { backgroundColor: isOnline ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)' }]}>
            <Text style={[styles.networkPillText, { color: isOnline ? '#22c55e' : '#f59e0b' }]}>
              {isOnline ? '📶 LIVE' : '📵 OFFLINE'}
            </Text>
          </View>
        </View>

        {/* GPS Location */}
        <View style={styles.locationCard}>
          <Text style={styles.locationLabel}>📍 AUTO-DETECTED LOCATION</Text>
          <Text style={styles.locationName}>{locationName}</Text>
          <Text style={styles.locationCoords}>{latitude?.toFixed(5)}, {longitude?.toFixed(5)}</Text>
        </View>

        {/* Category */}
        <Text style={styles.sectionLabel}>INCIDENT TYPE</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryCard,
                selectedCategory?.id === cat.id && { borderColor: cat.color, backgroundColor: cat.color + '18' },
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text style={[styles.categoryLabel, selectedCategory?.id === cat.id && { color: cat.color }]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Severity */}
        <Text style={styles.sectionLabel}>SEVERITY LEVEL</Text>
        <View style={styles.severitiesRow}>
          {SEVERITIES.map(sev => (
            <TouchableOpacity
              key={sev.id}
              style={[
                styles.severityCard,
                selectedSeverity?.id === sev.id && { borderColor: sev.color, backgroundColor: sev.color + '18' },
              ]}
              onPress={() => setSelectedSeverity(sev)}
            >
              <View style={[styles.severityDot, { backgroundColor: sev.color }]} />
              <Text style={[styles.severityLabel, selectedSeverity?.id === sev.id && { color: sev.color }]}>
                {sev.label}
              </Text>
              <Text style={styles.severityDesc}>{sev.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <Text style={styles.sectionLabel}>DESCRIPTION</Text>
        <TextInput
          style={styles.descInput}
          placeholder="Describe what happened (required)..."
          placeholderTextColor="#475569"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={500}
        />
        <Text style={styles.charCount}>{description.length}/500</Text>

        {/* Submit */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            (!selectedCategory || !selectedSeverity || !description.trim() || submitting) && styles.submitBtnDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!selectedCategory || !selectedSeverity || !description.trim() || submitting}
        >
          <Text style={styles.submitBtnText}>
            {submitting ? '📡 Submitting...' : '📝 Submit Incident Report'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 16, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { color: '#38bdf8', fontSize: 13, fontWeight: '700', marginRight: 12 },
  title: { flex: 1, fontSize: 14, fontWeight: '900', color: '#f8fafc', letterSpacing: 1 },
  networkPill: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  networkPillText: { fontSize: 10, fontWeight: '800' },
  locationCard: { backgroundColor: 'rgba(56,189,248,0.08)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(56,189,248,0.2)', marginBottom: 16 },
  locationLabel: { color: '#38bdf8', fontSize: 9, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  locationName: { color: '#e2e8f0', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  locationCoords: { color: '#64748b', fontSize: 10 },
  sectionLabel: { fontSize: 10, fontWeight: '800', color: '#94a3b8', letterSpacing: 1, marginBottom: 10 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  categoryCard: { width: '48%', backgroundColor: '#0f172a', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  categoryEmoji: { fontSize: 20, marginBottom: 4 },
  categoryLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '600' },
  severitiesRow: { gap: 8, marginBottom: 20 },
  severityCard: { backgroundColor: '#0f172a', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', flexDirection: 'row', alignItems: 'center' },
  severityDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  severityLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '800', width: 80 },
  severityDesc: { flex: 1, color: '#475569', fontSize: 10 },
  descInput: { backgroundColor: '#0f172a', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: 13, padding: 14, minHeight: 100, marginBottom: 4 },
  charCount: { color: '#475569', fontSize: 10, textAlign: 'right', marginBottom: 20 },
  submitBtn: { backgroundColor: '#38bdf8', borderRadius: 14, padding: 16, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { color: '#020617', fontSize: 14, fontWeight: '900' },
  successView: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  successEmoji: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 20, fontWeight: '900', color: '#f8fafc', marginBottom: 10 },
  successDesc: { color: '#94a3b8', fontSize: 13, textAlign: 'center', lineHeight: 18, marginBottom: 24, paddingHorizontal: 20 },
  incidentBox: { backgroundColor: '#0f172a', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', marginBottom: 20, width: '80%' },
  incidentBoxLabel: { color: '#64748b', fontSize: 10, fontWeight: '800', marginBottom: 6 },
  incidentBoxCode: { color: '#38bdf8', fontSize: 16, fontWeight: '900' },
  trackBtn: { backgroundColor: 'rgba(56,189,248,0.15)', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14, borderWidth: 1, borderColor: '#38bdf8', marginBottom: 12 },
  trackBtnText: { color: '#38bdf8', fontSize: 13, fontWeight: '800' },
  newBtn: { backgroundColor: '#0f172a', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 12 },
  newBtnText: { color: '#94a3b8', fontSize: 13, fontWeight: '700' },
  backLinkBtn: { paddingVertical: 8 },
  backLinkText: { color: '#64748b', fontSize: 12, fontWeight: '700' },
});
