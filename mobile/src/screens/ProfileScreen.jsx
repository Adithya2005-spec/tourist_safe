import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert,
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../i18n';

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const { user, touristProfile, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(t('settings.logout'), 'Are you sure you want to logout?', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.logout'), style: 'destructive',
        onPress: () => { logout && logout(); navigation.replace && navigation.replace('Login'); },
      },
    ]);
  };

  const PROFILE_ROWS = [
    { label: 'Full Name', value: touristProfile?.full_name || user?.username || 'Mahalasa Rao', icon: '👤' },
    { label: 'Tourist Code', value: touristProfile?.tourist_code || 'TOURIST-1024', icon: '🎫' },
    { label: 'DID Identifier', value: touristProfile?.did_identifier || 'did:sih:tourist-1024:aadhaar-verified', icon: '🆔' },
    { label: 'Phone', value: touristProfile?.phone || '+91 98450 11223', icon: '📱' },
    { label: 'DID Status', value: 'VERIFIED', icon: '✅' },
  ];

  const NAV_ROWS = [
    { label: t('nav.digitalIdentity'), icon: '🆔', screen: 'DigitalIdentity', color: '#a78bfa' },
    { label: t('nav.emergencyContacts'), icon: '👥', screen: 'EmergencyContacts', color: '#38bdf8' },
    { label: t('nav.liveLocation'), icon: '📍', screen: 'LiveLocationSharing', color: '#10b981' },
    { label: t('nav.settings'), icon: '⚙️', screen: 'Settings', color: '#f59e0b' },
    { label: t('nav.offlineSync'), icon: '📥', screen: 'OfflineSync', color: '#6366f1' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>{t('nav.profile').toUpperCase()}</Text>

        {/* Avatar Header */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>
              {(touristProfile?.full_name || user?.username || 'M')[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.avatarInfo}>
            <Text style={styles.avatarName}>{touristProfile?.full_name || user?.username || 'Mahalasa Rao'}</Text>
            <Text style={styles.avatarCode}>{touristProfile?.tourist_code || 'TOURIST-1024'}</Text>
            <View style={styles.verifiedRow}>
              <Text style={styles.verifiedText}>✅ AADHAAR DID VERIFIED</Text>
            </View>
          </View>
        </View>

        {/* Navigation Shortcuts Inside Profile */}
        <Text style={styles.sectionTitle}>SAFETY & IDENTITY TOOLS</Text>
        <View style={styles.card}>
          {NAV_ROWS.map((r, i) => (
            <TouchableOpacity
              key={r.label}
              style={[styles.navRow, i < NAV_ROWS.length - 1 && styles.infoRowBorder]}
              onPress={() => navigation.navigate(r.screen)}
              activeOpacity={0.7}
            >
              <View style={[styles.navIconWrap, { backgroundColor: r.color + '20' }]}>
                <Text style={styles.navIcon}>{r.icon}</Text>
              </View>
              <Text style={styles.navLabel}>{r.label}</Text>
              <Text style={[styles.navArrow, { color: r.color }]}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Profile Info */}
        <Text style={styles.sectionTitle}>TRAVELER METRICS</Text>
        <View style={styles.card}>
          {PROFILE_ROWS.map((r, i) => (
            <View key={r.label} style={[styles.infoRow, i < PROFILE_ROWS.length - 1 && styles.infoRowBorder]}>
              <Text style={styles.infoIcon}>{r.icon}</Text>
              <Text style={styles.infoLabel}>{r.label}</Text>
              <Text style={[styles.infoValue, r.label === 'DID Status' && { color: '#22c55e', fontWeight: '800' }]}>
                {r.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>🚪 {t('settings.logout')}</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>RakshaSetu v1.0.0 • SIH260483</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 20, paddingBottom: 80 },
  pageTitle: { fontSize: 16, fontWeight: '900', color: '#f8fafc', letterSpacing: 1, marginBottom: 16 },
  avatarCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', borderRadius: 18, padding: 18, gap: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 20 },
  avatarCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#38bdf8', justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { color: '#020617', fontSize: 28, fontWeight: '900' },
  avatarInfo: { flex: 1 },
  avatarName: { color: '#f8fafc', fontSize: 16, fontWeight: '800', marginBottom: 2 },
  avatarCode: { color: '#38bdf8', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  verifiedRow: {},
  verifiedText: { color: '#22c55e', fontSize: 10, fontWeight: '800' },
  sectionTitle: { fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: 1, marginBottom: 8 },
  card: { backgroundColor: '#0f172a', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 20, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  infoIcon: { fontSize: 16 },
  infoLabel: { flex: 1, color: '#64748b', fontSize: 12 },
  infoValue: { color: '#e2e8f0', fontSize: 11, fontWeight: '600', maxWidth: '50%', textAlign: 'right' },
  navRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  navIconWrap: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  navIcon: { fontSize: 18 },
  navLabel: { flex: 1, color: '#e2e8f0', fontSize: 13, fontWeight: '600' },
  navArrow: { fontSize: 16, fontWeight: '800' },
  logoutBtn: { backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', marginBottom: 16 },
  logoutText: { color: '#f87171', fontSize: 14, fontWeight: '800' },
  versionText: { color: '#334155', fontSize: 10, textAlign: 'center' },
});
