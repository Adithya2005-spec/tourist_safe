import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useRiskStore } from '../store/riskStore';

export default function SplashScreen({ navigation }) {
  const { initAuth, isAuthenticated, isLoading } = useAuthStore();
  const { fetchRiskZones } = useRiskStore();

  useEffect(() => {
    const startup = async () => {
      await initAuth();
      await fetchRiskZones();
      setTimeout(() => {
        if (isAuthenticated) {
          navigation.replace('Main');
        } else {
          navigation.replace('Auth');
        }
      }, 1200);
    };
    startup();
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <View style={styles.logoBadge}>
        <Text style={styles.shieldEmoji}>🛡️</Text>
      </View>
      <Text style={styles.title}>TouristSafe</Text>
      <Text style={styles.subtitle}>Smart Tourist Safety & Incident Response</Text>
      <View style={styles.taglineBadge}>
        <Text style={styles.taglineText}>AI • Geo-Fencing • Blockchain Digital ID</Text>
      </View>

      <ActivityIndicator size="small" color="#38bdf8" style={styles.spinner} />
      <Text style={styles.footerText}>Problem Statement: SIH260483</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  shieldEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#f8fafc',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 16,
  },
  taglineBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  taglineText: {
    fontSize: 11,
    color: '#38bdf8',
    fontWeight: '600',
  },
  spinner: {
    marginTop: 40,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 11,
    color: '#475569',
    position: 'absolute',
    bottom: 32,
  },
});
