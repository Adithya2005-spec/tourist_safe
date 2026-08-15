import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useLocationStore } from '../store/locationStore';
import { useRiskStore } from '../store/riskStore';
import { useNetworkStore } from '../store/networkStore';
import { useIncidentStore } from '../store/incidentStore';
import RiskBadge from '../components/RiskBadge';
import SOSButton from '../components/SOSButton';
import NetworkStatus from '../components/NetworkStatus';
import DemoController from '../components/DemoController';
import { useTranslation } from '../i18n';

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const { user, touristProfile } = useAuthStore();
  const { latitude, longitude, locationName, lastUpdated, syncLocationToServer } = useLocationStore();
  const { riskScore, riskLevel, riskInfo, fetchRiskZones } = useRiskStore();
  const { isOnline } = useNetworkStore();
  const { reportSOS, fetchIncidents, offlineQueue } = useIncidentStore();

  useEffect(() => {
    fetchRiskZones && fetchRiskZones();
    fetchIncidents && fetchIncidents();
    syncLocationToServer && syncLocationToServer();
  }, []);

  const handleSOSPress = async () => {
    navigation.navigate('SOS');
  };

  const getTranslatedRiskLevel = (level) => {
    switch (level) {
      case 'CRITICAL': return t('risk.critical');
      case 'HIGH': return t('risk.high');
      case 'MODERATE': return t('risk.moderate');
      case 'LOW': default: return t('risk.low');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              fetchRiskZones && fetchRiskZones();
              fetchIncidents && fetchIncidents();
              syncLocationToServer && syncLocationToServer();
            }}
            tintColor="#38bdf8"
          />
        }
      >
        {/* Top Header Card */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.welcomeText}>
              Welcome, {touristProfile?.full_name || user?.username || 'Mahalasa Rao'}
            </Text>
            <View style={styles.didRow}>
              <Text style={styles.didBadge}>
                🆔 {touristProfile?.tourist_code || 'TOURIST-1024'}
              </Text>
              <Text style={styles.verifiedTag}>• {t('common.verified')} DID</Text>
            </View>
          </View>
          <NetworkStatus />
        </View>

        {/* Dynamic Risk Warning Banner (Appears on HIGH / CRITICAL) */}
        {(riskLevel === 'HIGH' || riskLevel === 'CRITICAL') && (
          <TouchableOpacity
            style={styles.hazardBanner}
            onPress={() => navigation.navigate('RiskDetails')}
          >
            <Text style={styles.hazardIcon}>⚠️</Text>
            <View style={styles.hazardTextCol}>
              <Text style={styles.hazardTitle}>
                {t('risk.geofenceAlert')}
              </Text>
              <Text style={styles.hazardDesc}>
                {t('risk.approachingRisk')} ({getTranslatedRiskLevel(riskLevel)})
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Current Safety Status Card */}
        <View style={styles.safetyCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardSectionTitle}>{t('common.status').toUpperCase()}</Text>
            <View style={[styles.riskPill, { backgroundColor: riskLevel === 'HIGH' || riskLevel === 'CRITICAL' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)' }]}>
              <Text style={[styles.riskPillText, { color: riskLevel === 'HIGH' || riskLevel === 'CRITICAL' ? '#ef4444' : '#10b981' }]}>
                {getTranslatedRiskLevel(riskLevel)}
              </Text>
            </View>
          </View>

          <View style={styles.scoreRow}>
            <View style={styles.scoreCol}>
              <Text style={styles.scoreLabel}>{t('risk.riskScore')}</Text>
              <Text style={[styles.scoreValue, { color: riskInfo?.color || '#38bdf8' }]}>
                {riskScore} <Text style={styles.scoreMax}>/ 100</Text>
              </Text>
            </View>
            <View style={styles.locationCol}>
              <Text style={styles.locationLabel}>CURRENT LOCATION</Text>
              <Text style={styles.locationValue} numberOfLines={2}>
                📍 {locationName || 'Shivajinagar Canal Trench'}
              </Text>
            </View>
          </View>
        </View>

        {/* 1-Touch Emergency Distress Button */}
        <View style={styles.sosSection}>
          <SOSButton onPress={handleSOSPress} size="large" />
          <Text style={styles.sosHint}>{t('sos.tapToTrigger')}</Text>
        </View>

        {/* Quick Action Grid */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('SafetyMap')}
          >
            <Text style={styles.actionIcon}>🗺️</Text>
            <Text style={styles.actionTitle}>{t('nav.map')}</Text>
            <Text style={styles.actionSub}>Live Geo-Fences</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('LiveLocationSharing')}
          >
            <Text style={styles.actionIcon}>📍</Text>
            <Text style={styles.actionTitle}>{t('nav.liveLocation')}</Text>
            <Text style={styles.actionSub}>Share with Family</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('EmergencyContacts')}
          >
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionTitle}>{t('nav.emergencyContacts')}</Text>
            <Text style={styles.actionSub}>Primary Responder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('DigitalIdentity')}
          >
            <Text style={styles.actionIcon}>🆔</Text>
            <Text style={styles.actionTitle}>{t('nav.digitalIdentity')}</Text>
            <Text style={styles.actionSub}>Aadhaar Verified</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Controller */}
        <DemoController />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scrollContent: { padding: 20, paddingBottom: 80 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  welcomeText: { color: '#f8fafc', fontSize: 16, fontWeight: '800' },
  didRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  didBadge: { color: '#38bdf8', fontSize: 11, fontWeight: '700', fontFamily: 'Courier' },
  verifiedTag: { color: '#22c55e', fontSize: 10, fontWeight: '800' },
  hazardBanner: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.4)',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  hazardIcon: { fontSize: 24 },
  hazardTextCol: { flex: 1 },
  hazardTitle: { color: '#ef4444', fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
  hazardDesc: { color: '#fca5a5', fontSize: 11, marginTop: 2 },
  safetyCard: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 20,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardSectionTitle: { color: '#64748b', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  riskPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  riskPillText: { fontSize: 11, fontWeight: '900' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scoreCol: { flex: 1 },
  scoreLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '600' },
  scoreValue: { fontSize: 28, fontWeight: '900', marginTop: 2 },
  scoreMax: { fontSize: 14, color: '#64748b', fontWeight: '400' },
  locationCol: { flex: 1.2, alignItems: 'flex-end' },
  locationLabel: { color: '#64748b', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  locationValue: { color: '#cbd5e1', fontSize: 12, fontWeight: '600', marginTop: 2, textAlign: 'right' },
  sosSection: { alignItems: 'center', marginVertical: 10 },
  sosHint: { color: '#64748b', fontSize: 11, marginTop: 8 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14, marginBottom: 20 },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  actionIcon: { fontSize: 20, marginBottom: 6 },
  actionTitle: { color: '#fff', fontSize: 13, fontWeight: '800' },
  actionSub: { color: '#64748b', fontSize: 10, marginTop: 2 },
});
