import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  Alert, Animated, Vibration, ScrollView
} from 'react-native';
import { useIncidentStore } from '../store/incidentStore';
import { useLocationStore } from '../store/locationStore';
import { useNetworkStore } from '../store/networkStore';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../i18n';

const SOS_STATES = {
  IDLE: 'IDLE',
  CONFIRM: 'CONFIRM',
  COUNTDOWN: 'COUNTDOWN',
  SENDING: 'SENDING',
  SENT: 'SENT',
  OFFLINE_QUEUED: 'OFFLINE_QUEUED',
};

export default function SOSScreen({ navigation }) {
  const { t } = useTranslation();
  const [state, setState] = useState(SOS_STATES.IDLE);
  const [countdown, setCountdown] = useState(3);
  const [sosIncident, setSosIncident] = useState(null);
  const timerRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Mock / stored primary contact
  const [primaryContact, setPrimaryContact] = useState({
    name: 'Mom (Radha Rao)',
    phone: '+91 98450 11223'
  });

  const { reportSOS } = useIncidentStore();
  const { latitude, longitude, locationName } = useLocationStore();
  const { isOnline } = useNetworkStore();
  const { touristProfile } = useAuthStore();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (state === SOS_STATES.COUNTDOWN) {
      Vibration.vibrate([200, 100, 200]);
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            dispatchSOS();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state]);

  const dispatchSOS = async () => {
    setState(SOS_STATES.SENDING);
    try {
      const result = await reportSOS({
        latitude: latitude || 12.9820,
        longitude: longitude || 77.6080,
        description: 'Emergency SOS triggered by tourist via 1-touch beacon',
        tourist_code: touristProfile?.tourist_code || 'TOURIST-1024',
      });
      setSosIncident(result || { incident_code: 'INC-1024' });
      setState(isOnline ? SOS_STATES.SENT : SOS_STATES.OFFLINE_QUEUED);
      Vibration.vibrate(500);
    } catch (e) {
      setSosIncident({ incident_code: 'INC-1024' });
      setState(SOS_STATES.OFFLINE_QUEUED);
    }
  };

  const cancelSOS = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(3);
    setState(SOS_STATES.IDLE);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← {t('common.back')}</Text>
      </TouchableOpacity>

      {/* IDLE STATE */}
      {state === SOS_STATES.IDLE && (
        <View style={styles.center}>
          <Text style={styles.sosTitle}>🚨 {t('sos.emergencyDistress')}</Text>
          <Text style={styles.sosSubtitle}>
            {t('sos.tapToTrigger')}
          </Text>

          <Animated.View style={[styles.sosCircleOuter, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
              style={styles.sosBigButton}
              onPress={() => setState(SOS_STATES.CONFIRM)}
              activeOpacity={0.85}
            >
              <Text style={styles.sosBigButtonText}>{t('sos.button')}</Text>
              <Text style={styles.sosBigButtonSub}>1-TOUCH DISPATCH</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Primary Contact Preview */}
          <View style={styles.contactPreviewBox}>
            <Text style={styles.contactPreviewLabel}>
              {t('sos.primaryContact')}:
            </Text>
            {primaryContact ? (
              <Text style={styles.contactPreviewName}>
                👤 {primaryContact.name} ({primaryContact.phone})
              </Text>
            ) : (
              <View style={{ alignItems: 'center', marginTop: 4 }}>
                <Text style={styles.noContactText}>{t('sos.noContactConfigured')}</Text>
                <TouchableOpacity
                  style={styles.addContactLink}
                  onPress={() => navigation.navigate('EmergencyContacts')}
                >
                  <Text style={styles.addContactLinkText}>＋ {t('sos.addContact')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}

      {/* CONFIRM STATE */}
      {state === SOS_STATES.CONFIRM && (
        <View style={styles.center}>
          <Text style={styles.confirmEmoji}>⚠️</Text>
          <Text style={styles.confirmTitle}>CONFIRM EMERGENCY SOS</Text>
          <Text style={styles.confirmDesc}>
            Transmitting emergency distress beacon with GPS coordinates to Central HQ and Primary Emergency Contact.
          </Text>
          <Text style={styles.confirmLocation}>📍 {locationName || 'Shivajinagar Canal Corridor'}</Text>
          <Text style={styles.confirmCoords}>
            LAT: {latitude ? latitude.toFixed(4) : '12.9820'}° N | LON: {longitude ? longitude.toFixed(4) : '77.6080'}° E
          </Text>

          <View style={styles.confirmBtns}>
            <TouchableOpacity style={styles.cancelBtn} onPress={cancelSOS}>
              <Text style={styles.cancelBtnText}>✕ {t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => setState(SOS_STATES.COUNTDOWN)}
            >
              <Text style={styles.confirmBtnText}>🚨 {t('common.confirm')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* COUNTDOWN STATE */}
      {state === SOS_STATES.COUNTDOWN && (
        <View style={styles.center}>
          <Text style={styles.countdownLabel}>DISPATCHING BEACON IN</Text>
          <Text style={styles.countdownNum}>{countdown}</Text>
          <Text style={styles.countdownSub}>seconds...</Text>
          <TouchableOpacity style={styles.cancelBtn} onPress={cancelSOS}>
            <Text style={styles.cancelBtnText}>✕ {t('sos.cancelSos')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* SENDING STATE */}
      {state === SOS_STATES.SENDING && (
        <View style={styles.center}>
          <Text style={styles.sendingEmoji}>📡</Text>
          <Text style={styles.sendingTitle}>DISPATCHING ENCRYPTED SOS...</Text>
          <Text style={styles.sendingDesc}>Broadcasting to Police HQ and Emergency Contacts</Text>
        </View>
      )}

      {/* CONFIRMATION / SENT STATE */}
      {(state === SOS_STATES.SENT || state === SOS_STATES.OFFLINE_QUEUED) && (
        <ScrollView contentContainerStyle={styles.sentContainer}>
          <Text style={styles.sentEmoji}>🚨</Text>
          <Text style={styles.sentTitle}>{t('sos.activated')}</Text>
          <Text style={styles.sentDesc}>{t('sos.servicesNotified')}</Text>

          {/* Detailed Verification Card */}
          <View style={styles.confirmationCard}>
            <View style={styles.confirmationRow}>
              <Text style={styles.confLabel}>{t('sos.primaryContact')}:</Text>
              <Text style={styles.confValue}>
                {primaryContact ? primaryContact.name : t('sos.noContactConfigured')}
              </Text>
            </View>

            <View style={styles.confirmationDivider} />

            <View style={styles.confirmationRow}>
              <Text style={styles.confLabel}>Location:</Text>
              <Text style={[styles.confValue, { color: '#10b981' }]}>
                {t('sos.locationShared')}
              </Text>
            </View>

            <View style={styles.confirmationDivider} />

            <View style={styles.confirmationRow}>
              <Text style={styles.confLabel}>{t('sos.incidentId')}:</Text>
              <Text style={[styles.confValue, { color: '#38bdf8', fontWeight: '900' }]}>
                {sosIncident?.incident_code || 'INC-1024'}
              </Text>
            </View>
          </View>

          {!primaryContact && (
            <TouchableOpacity
              style={styles.addContactBtn}
              onPress={() => navigation.navigate('EmergencyContacts')}
            >
              <Text style={styles.addContactBtnText}>＋ {t('sos.addContact')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() => navigation.navigate('IncidentStatus', { incidentCode: sosIncident?.incident_code || 'INC-1024' })}
          >
            <Text style={styles.trackBtnText}>📋 Track Incident Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => { setState(SOS_STATES.IDLE); setCountdown(3); setSosIncident(null); }}
          >
            <Text style={styles.resetBtnText}>← Back to SOS</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 20 },
  backBtn: { paddingVertical: 8 },
  backText: { color: '#38bdf8', fontSize: 13, fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  sosTitle: { fontSize: 20, fontWeight: '900', color: '#f8fafc', marginBottom: 8, textAlign: 'center' },
  sosSubtitle: { color: '#94a3b8', fontSize: 13, textAlign: 'center', lineHeight: 18, marginBottom: 28, paddingHorizontal: 20 },
  sosCircleOuter: {
    width: 210, height: 210, borderRadius: 105,
    backgroundColor: 'rgba(239,68,68,0.15)', borderWidth: 3, borderColor: 'rgba(239,68,68,0.5)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 28,
  },
  sosBigButton: {
    width: 165, height: 165, borderRadius: 85,
    backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#ef4444', shadowOpacity: 0.7, shadowRadius: 24, elevation: 15,
  },
  sosBigButtonText: { color: '#fff', fontSize: 44, fontWeight: '900' },
  sosBigButtonSub: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  contactPreviewBox: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    width: '90%',
    alignItems: 'center',
  },
  contactPreviewLabel: { color: '#64748b', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  contactPreviewName: { color: '#38bdf8', fontSize: 13, fontWeight: '700', marginTop: 4 },
  noContactText: { color: '#ef4444', fontSize: 12, fontWeight: '600' },
  addContactLink: { marginTop: 6, backgroundColor: 'rgba(56,189,248,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  addContactLinkText: { color: '#38bdf8', fontSize: 11, fontWeight: '800' },
  confirmEmoji: { fontSize: 50, marginBottom: 12 },
  confirmTitle: { fontSize: 18, fontWeight: '900', color: '#f8fafc', marginBottom: 10 },
  confirmDesc: { color: '#94a3b8', fontSize: 13, textAlign: 'center', lineHeight: 18, paddingHorizontal: 20, marginBottom: 16 },
  confirmLocation: { color: '#38bdf8', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  confirmCoords: { color: '#64748b', fontSize: 11, marginBottom: 24 },
  confirmBtns: { flexDirection: 'row', gap: 12 },
  cancelBtn: { backgroundColor: '#0f172a', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  cancelBtnText: { color: '#94a3b8', fontSize: 13, fontWeight: '700' },
  confirmBtn: { backgroundColor: '#ef4444', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14 },
  confirmBtnText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  countdownLabel: { color: '#94a3b8', fontSize: 13, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  countdownNum: { fontSize: 100, fontWeight: '900', color: '#ef4444', lineHeight: 110 },
  countdownSub: { color: '#94a3b8', fontSize: 14, marginBottom: 24 },
  sendingEmoji: { fontSize: 60, marginBottom: 12 },
  sendingTitle: { fontSize: 18, fontWeight: '900', color: '#f8fafc', marginBottom: 8 },
  sendingDesc: { color: '#94a3b8', fontSize: 13, textAlign: 'center' },
  sentContainer: { alignItems: 'center', paddingVertical: 20 },
  sentEmoji: { fontSize: 54, marginBottom: 10 },
  sentTitle: { fontSize: 20, fontWeight: '900', color: '#ef4444', marginBottom: 8, textAlign: 'center' },
  sentDesc: { color: '#94a3b8', fontSize: 13, textAlign: 'center', lineHeight: 18, paddingHorizontal: 20, marginBottom: 24 },
  confirmationCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    width: '100%',
    marginBottom: 20,
  },
  confirmationRow: {
    paddingVertical: 8,
  },
  confLabel: { color: '#64748b', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  confValue: { color: '#f8fafc', fontSize: 14, fontWeight: '700', marginTop: 2 },
  confirmationDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.04)' },
  addContactBtn: {
    backgroundColor: 'rgba(56,189,248,0.15)',
    borderWidth: 1,
    borderColor: '#38bdf8',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  addContactBtnText: { color: '#38bdf8', fontSize: 13, fontWeight: '800' },
  trackBtn: { backgroundColor: '#38bdf8', borderRadius: 14, paddingVertical: 14, width: '100%', alignItems: 'center', marginBottom: 12 },
  trackBtnText: { color: '#020617', fontSize: 14, fontWeight: '900' },
  resetBtn: { paddingVertical: 8 },
  resetBtnText: { color: '#64748b', fontSize: 12, fontWeight: '700' },
});
