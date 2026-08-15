import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useRiskStore } from '../store/riskStore';
import { useLocationStore } from '../store/locationStore';

const FEATURE_WEIGHTS = [
  { key: 'historical_crime_rate', label: 'Historical Crime Rate', emoji: '📊', weight: 0.28, color: '#ef4444' },
  { key: 'recent_incident_spike', label: 'Recent Incident Spike', emoji: '📈', weight: 0.22, color: '#f97316' },
  { key: 'crowd_density', label: 'Crowd Density Index', emoji: '👥', weight: 0.18, color: '#f59e0b' },
  { key: 'time_of_day_risk', label: 'Time-of-Day Risk Factor', emoji: '🕐', weight: 0.15, color: '#a78bfa' },
  { key: 'nearest_incident', label: 'Nearest Incident Distance', emoji: '📍', weight: 0.12, color: '#38bdf8' },
  { key: 'weather_visibility', label: 'Weather & Visibility', emoji: '🌦', weight: 0.05, color: '#34d399' },
];

export default function RiskDetailsScreen({ navigation }) {
  const { riskScore, riskLevel, riskInfo, riskZones } = useRiskStore();
  const { locationName, latitude, longitude } = useLocationStore();

  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 20;

  // Simulated feature values (would come from backend prediction in real scenario)
  const featureValues = {
    historical_crime_rate: riskScore * 0.28,
    recent_incident_spike: riskScore * 0.22,
    crowd_density: riskScore * 0.18,
    time_of_day_risk: isNight ? riskScore * 0.15 : riskScore * 0.06,
    nearest_incident: riskScore * 0.12,
    weather_visibility: riskScore * 0.05,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>AI RISK ANALYSIS</Text>
        </View>

        {/* Score Card */}
        <View style={[styles.scoreCard, { borderColor: riskInfo.color }]}>
          <View style={styles.scoreCardTop}>
            <View>
              <Text style={styles.scoreMini}>LINEAR REGRESSION SCORE</Text>
              <Text style={[styles.scoreNum, { color: riskInfo.color }]}>{riskScore}</Text>
              <Text style={styles.scoreSlash}>/100</Text>
            </View>
            <View style={[styles.levelBadge, { backgroundColor: riskInfo.color + '22', borderColor: riskInfo.color }]}>
              <Text style={[styles.levelBadgeText, { color: riskInfo.color }]}>{riskLevel}</Text>
            </View>
          </View>
          <Text style={styles.scoreDesc}>{riskInfo.description}</Text>
          <View style={styles.scoreBarBg}>
            <View style={[styles.scoreBarFill, { width: `${riskScore}%`, backgroundColor: riskInfo.color }]} />
          </View>
          <Text style={styles.locationText}>📍 {locationName}</Text>
        </View>

        {/* Model Explanation */}
        <View style={styles.modelCard}>
          <Text style={styles.modelTitle}>🤖 ML MODEL: LINEAR REGRESSION</Text>
          <Text style={styles.modelDesc}>
            The risk score is computed using a trained Linear Regression model on 5,000 synthetic records.
            Features are weighted by their correlation with historical incident severity.
            Training metrics: R² = 0.61, MAE = 5.41, RMSE = 6.66
          </Text>
        </View>

        {/* Feature Breakdown */}
        <Text style={styles.sectionTitle}>FEATURE WEIGHT BREAKDOWN</Text>
        {FEATURE_WEIGHTS.map(f => {
          const value = featureValues[f.key] || 0;
          const pct = Math.min(100, (value / riskScore) * 100);
          return (
            <View key={f.key} style={styles.featureRow}>
              <View style={styles.featureHeader}>
                <Text style={styles.featureEmoji}>{f.emoji}</Text>
                <Text style={styles.featureLabel}>{f.label}</Text>
                <View style={styles.featureWeightBadge}>
                  <Text style={[styles.featureWeightText, { color: f.color }]}>
                    {(f.weight * 100).toFixed(0)}%
                  </Text>
                </View>
              </View>
              <View style={styles.featureBarBg}>
                <View style={[styles.featureBarFill, { width: `${pct}%`, backgroundColor: f.color }]} />
              </View>
              <Text style={[styles.featureContrib, { color: f.color }]}>
                Contribution: +{value.toFixed(1)} pts
              </Text>
            </View>
          );
        })}

        {/* Contextual Risk Factors */}
        <Text style={styles.sectionTitle}>CONTEXTUAL ASSESSMENT</Text>
        <View style={styles.contextGrid}>
          <View style={styles.contextItem}>
            <Text style={styles.contextEmoji}>{isNight ? '🌙' : '☀️'}</Text>
            <Text style={styles.contextLabel}>Time of Day</Text>
            <Text style={[styles.contextValue, { color: isNight ? '#f97316' : '#22c55e' }]}>
              {isNight ? 'NIGHT (+Risk)' : 'DAYTIME (Safe)'}
            </Text>
          </View>

          <View style={styles.contextItem}>
            <Text style={styles.contextEmoji}>👥</Text>
            <Text style={styles.contextLabel}>Crowd Level</Text>
            <Text style={[styles.contextValue, { color: '#f59e0b' }]}>MODERATE</Text>
          </View>

          <View style={styles.contextItem}>
            <Text style={styles.contextEmoji}>🚨</Text>
            <Text style={styles.contextLabel}>Active Incidents</Text>
            <Text style={[styles.contextValue, { color: '#ef4444' }]}>3 NEARBY</Text>
          </View>

          <View style={styles.contextItem}>
            <Text style={styles.contextEmoji}>📶</Text>
            <Text style={styles.contextLabel}>Network</Text>
            <Text style={[styles.contextValue, { color: '#34d399' }]}>ONLINE</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('SafetyMap')}
        >
          <Text style={styles.ctaBtnText}>🗺 View Safe Route on Map</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 16, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  backBtn: { paddingVertical: 4 },
  backText: { color: '#38bdf8', fontSize: 13, fontWeight: '700' },
  title: { fontSize: 14, fontWeight: '900', color: '#f8fafc', letterSpacing: 1 },
  scoreCard: { backgroundColor: '#0f172a', borderRadius: 18, padding: 18, borderWidth: 1.5, marginBottom: 14 },
  scoreCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  scoreMini: { fontSize: 9, color: '#64748b', fontWeight: '800', letterSpacing: 1 },
  scoreNum: { fontSize: 56, fontWeight: '900', lineHeight: 60 },
  scoreSlash: { fontSize: 16, color: '#64748b' },
  levelBadge: { borderRadius: 10, borderWidth: 1.5, paddingHorizontal: 12, paddingVertical: 6 },
  levelBadgeText: { fontSize: 14, fontWeight: '900' },
  scoreDesc: { color: '#94a3b8', fontSize: 12, lineHeight: 16, marginBottom: 10 },
  scoreBarBg: { height: 8, backgroundColor: '#1e293b', borderRadius: 4, marginBottom: 8 },
  scoreBarFill: { height: 8, borderRadius: 4 },
  locationText: { color: '#64748b', fontSize: 11 },
  modelCard: { backgroundColor: 'rgba(56,189,248,0.08)', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(56,189,248,0.2)', marginBottom: 16 },
  modelTitle: { color: '#38bdf8', fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 6 },
  modelDesc: { color: '#94a3b8', fontSize: 11, lineHeight: 16 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 1, marginBottom: 10 },
  featureRow: { backgroundColor: '#0f172a', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 8 },
  featureHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  featureEmoji: { fontSize: 16, marginRight: 8 },
  featureLabel: { flex: 1, color: '#e2e8f0', fontSize: 12, fontWeight: '600' },
  featureWeightBadge: { backgroundColor: '#1e293b', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  featureWeightText: { fontSize: 11, fontWeight: '900' },
  featureBarBg: { height: 6, backgroundColor: '#1e293b', borderRadius: 3, marginBottom: 6 },
  featureBarFill: { height: 6, borderRadius: 3, opacity: 0.9 },
  featureContrib: { fontSize: 10, fontWeight: '700' },
  contextGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  contextItem: { width: '48%', backgroundColor: '#0f172a', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  contextEmoji: { fontSize: 22, marginBottom: 4 },
  contextLabel: { color: '#64748b', fontSize: 10, fontWeight: '600', marginBottom: 3 },
  contextValue: { fontSize: 11, fontWeight: '800' },
  ctaBtn: { backgroundColor: 'rgba(56,189,248,0.15)', borderWidth: 1, borderColor: '#38bdf8', borderRadius: 14, padding: 16, alignItems: 'center' },
  ctaBtnText: { color: '#38bdf8', fontSize: 14, fontWeight: '800' },
});
