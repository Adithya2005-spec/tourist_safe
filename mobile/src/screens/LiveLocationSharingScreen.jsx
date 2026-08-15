import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useTranslation } from '../i18n';
import useLocationStore from '../store/locationStore';
import useAuthStore from '../store/authStore';

export default function LiveLocationSharingScreen({ navigation }) {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { latitude, longitude } = useLocationStore();

  const [isSharing, setIsSharing] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(30); // 15, 30, 60
  const [selectedContact, setSelectedContact] = useState(null);
  const [remainingMinutes, setRemainingMinutes] = useState(30);
  const [networkInterrupted, setNetworkInterrupted] = useState(false);
  const [demoMovementStep, setDemoMovementStep] = useState(0);

  const [contacts, setContacts] = useState([
    { id: 1, name: 'Mom', phone: '+91 98450 11223', relationship: 'Parent', is_primary: 1 },
    { id: 2, name: 'Rahul (Brother)', phone: '+91 98450 44556', relationship: 'Sibling', is_primary: 0 }
  ]);

  useEffect(() => {
    // Select primary contact by default
    const primary = contacts.find(c => c.is_primary) || contacts[0];
    if (primary) setSelectedContact(primary);
  }, []);

  // Timer countdown simulation
  useEffect(() => {
    let timer = null;
    if (isSharing && remainingMinutes > 0 && !networkInterrupted) {
      timer = setInterval(() => {
        setRemainingMinutes(prev => {
          if (prev <= 1) {
            setIsSharing(false);
            Alert.alert(t('locationSharing.sessionEnded'), t('locationSharing.sessionEnded'));
            return 0;
          }
          return prev - 1;
        });
      }, 10000); // simulated fast countdown
    }
    return () => timer && clearInterval(timer);
  }, [isSharing, remainingMinutes, networkInterrupted]);

  const handleStartSharing = () => {
    if (!selectedContact) {
      Alert.alert(t('common.status'), t('locationSharing.selectContact'));
      return;
    }
    setIsSharing(true);
    setRemainingMinutes(selectedDuration);
    setNetworkInterrupted(false);
  };

  const handleStopSharing = () => {
    setIsSharing(false);
    Alert.alert(t('locationSharing.sessionEnded'), t('locationSharing.sessionEnded'));
  };

  // Demo Mode Actions
  const handleSimulateMovement = () => {
    const nextStep = demoMovementStep + 1;
    setDemoMovementStep(nextStep);
    Alert.alert(
      'Location Updated',
      `GPS Coordinates updated to: 12.${9820 + nextStep * 10}, 77.${6080 + nextStep * 10}`
    );
  };

  const handleSimulateNetworkOff = () => {
    setNetworkInterrupted(true);
  };

  const handleSimulateNetworkOn = () => {
    setNetworkInterrupted(false);
    Alert.alert('Network Restored', 'Live location updates resumed.');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('locationSharing.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status Card */}
        <View style={[styles.statusCard, isSharing ? styles.statusCardActive : styles.statusCardInactive]}>
          <Text style={styles.statusDot}>{isSharing ? '🟢' : '⚪'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.statusTitle}>
              {isSharing ? t('locationSharing.active') : t('locationSharing.notSharing')}
            </Text>
            {isSharing && (
              <Text style={styles.statusSub}>
                {t('locationSharing.sharedWith')}: <Text style={{ fontWeight: 'bold', color: '#fff' }}>{selectedContact?.name}</Text>
              </Text>
            )}
          </View>
        </View>

        {/* Network Interruption Alert */}
        {networkInterrupted && isSharing && (
          <View style={styles.networkAlert}>
            <Text style={styles.networkAlertText}>⚠️ {t('locationSharing.networkInterrupted')}</Text>
            <Text style={styles.networkAlertSub}>
              Last known GPS cached locally. Updates will resume once signal returns.
            </Text>
          </View>
        )}

        {/* Active Session Display */}
        {isSharing ? (
          <View style={styles.activeSection}>
            <View style={styles.timerBox}>
              <Text style={styles.timerLabel}>{t('locationSharing.remaining')}</Text>
              <Text style={styles.timerValue}>{remainingMinutes} {t('locationSharing.minutes')}</Text>
            </View>

            <View style={styles.coordBox}>
              <Text style={styles.coordText}>
                LAT: {latitude ? latitude.toFixed(4) : '12.9820'}° N | LON: {longitude ? longitude.toFixed(4) : '77.6080'}° E
              </Text>
              <Text style={styles.coordSub}>Update Interval: 15s • TLS 1.3 Encrypted</Text>
            </View>

            <TouchableOpacity
              style={styles.stopBtn}
              onPress={handleStopSharing}
              activeOpacity={0.8}
            >
              <Text style={styles.stopBtnText}>⛔ {t('locationSharing.stopSharing')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Configuration Setup */
          <View style={styles.setupSection}>
            {/* Step 1: Select Contact */}
            <Text style={styles.sectionLabel}>{t('locationSharing.selectContact')}</Text>
            <View style={styles.contactList}>
              {contacts.map(c => {
                const selected = selectedContact?.id === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.contactCard, selected && styles.contactCardSelected]}
                    onPress={() => setSelectedContact(c)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.contactName}>{c.name}</Text>
                    <Text style={styles.contactPhone}>{c.phone} • {c.relationship}</Text>
                    {c.is_primary === 1 && (
                      <Text style={styles.primaryBadge}>PRIMARY</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Step 2: Duration Selector */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
              {t('locationSharing.selectDuration')}
            </Text>
            <View style={styles.durationRow}>
              {[
                { val: 15, label: t('locationSharing.duration15') },
                { val: 30, label: t('locationSharing.duration30') },
                { val: 60, label: t('locationSharing.duration60') }
              ].map(d => {
                const selected = selectedDuration === d.val;
                return (
                  <TouchableOpacity
                    key={d.val}
                    style={[styles.durationBtn, selected && styles.durationBtnSelected]}
                    onPress={() => setSelectedDuration(d.val)}
                  >
                    <Text style={[styles.durationText, selected && styles.durationTextSelected]}>
                      {d.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Start Button */}
            <TouchableOpacity
              style={styles.startBtn}
              onPress={handleStartSharing}
              activeOpacity={0.8}
            >
              <Text style={styles.startBtnText}>📍 {t('locationSharing.shareLiveLocation')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Privacy Card */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>🔒 Privacy & Revocation</Text>
          <Text style={styles.privacyDesc}>{t('locationSharing.privacyNotice')}</Text>
        </View>

        {/* SIH Demo Controls Bar */}
        <View style={styles.demoCard}>
          <Text style={styles.demoTitle}>🛠️ {t('demo.title')}</Text>
          <View style={styles.demoBtnGrid}>
            <TouchableOpacity style={styles.demoBtn} onPress={handleSimulateMovement}>
              <Text style={styles.demoBtnText}>🏃 {t('demo.simulateMovement')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoBtn} onPress={handleSimulateNetworkOff}>
              <Text style={styles.demoBtnText}>📵 {t('demo.simulateNetworkOff')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoBtn} onPress={handleSimulateNetworkOn}>
              <Text style={styles.demoBtnText}>📶 {t('demo.simulateNetworkOn')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#0a0f1e',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  content: {
    padding: 20,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  statusCardActive: {
    backgroundColor: 'rgba(16,185,129,0.12)',
    borderColor: 'rgba(16,185,129,0.4)',
  },
  statusCardInactive: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statusDot: {
    fontSize: 20,
    marginRight: 12,
  },
  statusTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  statusSub: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  networkAlert: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.4)',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  networkAlertText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '800',
  },
  networkAlertSub: {
    color: '#fca5a5',
    fontSize: 11,
    marginTop: 4,
  },
  sectionLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  contactList: {
    gap: 10,
  },
  contactCard: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 14,
    position: 'relative',
  },
  contactCardSelected: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56,189,248,0.08)',
  },
  contactName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  contactPhone: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  primaryBadge: {
    position: 'absolute',
    right: 14,
    top: 14,
    backgroundColor: 'rgba(56,189,248,0.2)',
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  durationRow: {
    flexDirection: 'row',
    gap: 10,
  },
  durationBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  durationBtnSelected: {
    backgroundColor: '#38bdf8',
    borderColor: '#38bdf8',
  },
  durationText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  durationTextSelected: {
    color: '#020617',
  },
  startBtn: {
    backgroundColor: '#38bdf8',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#38bdf8',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  startBtnText: {
    color: '#020617',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  activeSection: {
    gap: 16,
  },
  timerBox: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  timerLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  timerValue: {
    color: '#10b981',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
  },
  coordBox: {
    backgroundColor: '#0a0f1e',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  coordText: {
    color: '#94a3b8',
    fontSize: 11,
    fontFamily: 'Courier',
  },
  coordSub: {
    color: '#475569',
    fontSize: 10,
    marginTop: 2,
  },
  stopBtn: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  stopBtnText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '800',
  },
  privacyCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  privacyTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  privacyDesc: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16,
  },
  demoCard: {
    backgroundColor: '#0a0f1e',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.2)',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  demoTitle: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 10,
  },
  demoBtnGrid: {
    gap: 8,
  },
  demoBtn: {
    backgroundColor: '#1e293b',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  demoBtnText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
  },
});
