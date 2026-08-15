import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch
} from 'react-native';
import { useTranslation, SUPPORTED_LANGUAGES } from '../i18n';
import useAuthStore from '../store/authStore';

export default function SettingsScreen({ navigation }) {
  const { t, language, setLanguage } = useTranslation();
  const { logout, user } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [demoModeEnabled, setDemoModeEnabled] = useState(true);

  const handleLanguageChange = async (code) => {
    await setLanguage(code);
  };

  const handleLogout = () => {
    Alert.alert(
      t('settings.logout'),
      'Are you sure you want to log out?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('settings.logout'), style: 'destructive', onPress: () => logout && logout() }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Language Section */}
        <Text style={styles.sectionHeader}>{t('settings.language')}</Text>
        <View style={styles.card}>
          {SUPPORTED_LANGUAGES.map(item => {
            const isSelected = language === item.code;
            return (
              <TouchableOpacity
                key={item.code}
                style={[styles.langRow, isSelected && styles.langRowActive]}
                onPress={() => handleLanguageChange(item.code)}
                activeOpacity={0.7}
              >
                <View style={styles.radioOuter}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <View style={{ marginLeft: 14 }}>
                  <Text style={[styles.langNative, isSelected && styles.langTextActive]}>
                    {item.native}
                  </Text>
                  <Text style={styles.langLabel}>{item.label}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Safety Navigation */}
        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Safety Modules</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.navRow}
            onPress={() => navigation.navigate('EmergencyContacts')}
          >
            <Text style={styles.navRowIcon}>👥</Text>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.navRowTitle}>{t('settings.emergencyContacts')}</Text>
              <Text style={styles.navRowSub}>Designate primary SOS responder</Text>
            </View>
            <Text style={styles.navArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.navRow}
            onPress={() => navigation.navigate('LiveLocationSharing')}
          >
            <Text style={styles.navRowIcon}>📍</Text>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.navRowTitle}>{t('settings.liveLocationSharing')}</Text>
              <Text style={styles.navRowSub}>Time-limited encrypted GPS broadcast</Text>
            </View>
            <Text style={styles.navArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Preferences & System</Text>
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>{t('settings.notifications')}</Text>
              <Text style={styles.toggleSub}>Geofence alerts & high-risk warnings</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#334155', true: '#38bdf8' }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>{t('settings.demoMode')}</Text>
              <Text style={styles.toggleSub}>Enable SIH simulation controls</Text>
            </View>
            <Switch
              value={demoModeEnabled}
              onValueChange={setDemoModeEnabled}
              trackColor={{ false: '#334155', true: '#38bdf8' }}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>🚪 {t('settings.logout')}</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>RakshaSetu v1.0.0 • SIH260483</Text>
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
  sectionHeader: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  langRowActive: {
    backgroundColor: 'rgba(56,189,248,0.06)',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#38bdf8',
  },
  langNative: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  langLabel: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  langTextActive: {
    color: '#38bdf8',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  navRowIcon: {
    fontSize: 20,
  },
  navRowTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  navRowSub: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  navArrow: {
    color: '#64748b',
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  toggleTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  toggleSub: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 28,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '800',
  },
  versionText: {
    textAlign: 'center',
    color: '#475569',
    fontSize: 11,
    marginTop: 20,
    marginBottom: 40,
  },
});
