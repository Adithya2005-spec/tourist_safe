import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Dimensions,
} from 'react-native';
import { useLocationStore } from '../store/locationStore';
import { useRiskStore } from '../store/riskStore';
import { useIncidentStore } from '../store/incidentStore';
import RiskBadge from '../components/RiskBadge';

const { width } = Dimensions.get('window');
const MAP_SIZE = width - 32;
const CENTER_X = MAP_SIZE / 2;
const CENTER_Y = MAP_SIZE / 2;

const RISK_ZONES = [
  { id: 1, name: 'Cubbon Park', lat: 12.9763, lon: 77.5929, radius: 55, risk: 'LOW', color: '#22c55e', score: 22 },
  { id: 2, name: 'MG Road', lat: 12.9756, lon: 77.6087, radius: 50, risk: 'MODERATE', color: '#f59e0b', score: 54 },
  { id: 3, name: 'Commercial Street', lat: 12.9825, lon: 77.6076, radius: 45, risk: 'HIGH', color: '#f97316', score: 73 },
  { id: 4, name: 'Shivajinagar', lat: 12.9849, lon: 77.6001, radius: 40, risk: 'CRITICAL', color: '#ef4444', score: 91 },
];

const INCIDENT_MARKERS = [
  { id: 'i1', type: 'MEDICAL', lat: 12.977, lon: 77.598, emoji: '🏥', offsetX: 30, offsetY: -40 },
  { id: 'i2', type: 'ACCIDENT', lat: 12.974, lon: 77.607, emoji: '🚗', offsetX: 80, offsetY: 40 },
  { id: 'i3', type: 'SUSPICIOUS', lat: 12.983, lon: 77.601, emoji: '👁', offsetX: -20, offsetY: -60 },
];

function latLonToXY(lat, lon) {
  const baseLat = 12.9763;
  const baseLon = 77.5929;
  const scale = 4500;
  const x = CENTER_X + (lon - baseLon) * scale;
  const y = CENTER_Y - (lat - baseLat) * scale;
  return { x, y };
}

export default function SafetyMapScreen({ navigation }) {
  const { latitude, longitude, locationName } = useLocationStore();
  const { riskScore, riskLevel, riskInfo } = useRiskStore();
  const [selectedZone, setSelectedZone] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [routeType, setRouteType] = useState('safer');
  const [nearestZone, setNearestZone] = useState(null);

  const touristPos = latLonToXY(latitude || 12.9763, longitude || 77.5929);

  useEffect(() => {
    // Find nearest risk zone
    if (latitude && longitude) {
      let closest = null;
      let minDist = Infinity;
      RISK_ZONES.forEach(zone => {
        const dx = (longitude - zone.lon) * 111000;
        const dy = (latitude - zone.lat) * 111000;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) { minDist = dist; closest = zone; }
      });
      setNearestZone(closest);
    }
  }, [latitude, longitude]);

  const touristX = Math.max(20, Math.min(MAP_SIZE - 20, touristPos.x));
  const touristY = Math.max(20, Math.min(MAP_SIZE - 20, touristPos.y));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>SAFETY MAP</Text>
          <RiskBadge score={riskScore} level={riskLevel} size="small" />
        </View>

        {/* Route Toggle */}
        <View style={styles.routeToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, routeType === 'safer' && styles.toggleBtnActive]}
            onPress={() => setRouteType('safer')}
          >
            <Text style={[styles.toggleBtnText, routeType === 'safer' && styles.toggleBtnTextActive]}>
              🛡 Safer Route
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, routeType === 'fastest' && styles.toggleBtnActive]}
            onPress={() => setRouteType('fastest')}
          >
            <Text style={[styles.toggleBtnText, routeType === 'fastest' && styles.toggleBtnTextActive]}>
              ⚡ Fastest Route
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, showRoute && { backgroundColor: 'rgba(56,189,248,0.15)' }]}
            onPress={() => setShowRoute(!showRoute)}
          >
            <Text style={styles.toggleBtnText}>{showRoute ? '🗺 Hide Route' : '🗺 Show Route'}</Text>
          </TouchableOpacity>
        </View>

        {/* Radar Map Canvas */}
        <View style={styles.mapContainer}>
          <View style={[styles.mapCanvas, { width: MAP_SIZE, height: MAP_SIZE }]}>
            {/* Grid lines */}
            {[0.2, 0.4, 0.6, 0.8].map(f => (
              <View key={f} style={[styles.gridLine, styles.gridH, { top: MAP_SIZE * f }]} />
            ))}
            {[0.2, 0.4, 0.6, 0.8].map(f => (
              <View key={f} style={[styles.gridLine, styles.gridV, { left: MAP_SIZE * f }]} />
            ))}

            {/* Risk Zone Circles */}
            {RISK_ZONES.map(zone => {
              const pos = latLonToXY(zone.lat, zone.lon);
              const x = Math.max(0, Math.min(MAP_SIZE, pos.x));
              const y = Math.max(0, Math.min(MAP_SIZE, pos.y));
              const isSelected = selectedZone?.id === zone.id;
              return (
                <TouchableOpacity
                  key={zone.id}
                  style={[
                    styles.zoneCircle,
                    {
                      width: zone.radius * 2,
                      height: zone.radius * 2,
                      borderRadius: zone.radius,
                      left: x - zone.radius,
                      top: y - zone.radius,
                      backgroundColor: zone.color + '30',
                      borderColor: zone.color + (isSelected ? 'FF' : '88'),
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  onPress={() => setSelectedZone(isSelected ? null : zone)}
                >
                  <Text style={[styles.zoneLabel, { color: zone.color }]}>{zone.name.split(' ')[0]}</Text>
                </TouchableOpacity>
              );
            })}

            {/* Incident Markers */}
            {INCIDENT_MARKERS.map(m => {
              const pos = latLonToXY(m.lat, m.lon);
              return (
                <View
                  key={m.id}
                  style={[styles.incidentMarker, {
                    left: Math.max(10, Math.min(MAP_SIZE - 30, pos.x + m.offsetX)),
                    top: Math.max(10, Math.min(MAP_SIZE - 30, pos.y + m.offsetY)),
                  }]}
                >
                  <Text style={styles.incidentEmoji}>{m.emoji}</Text>
                </View>
              );
            })}

            {/* Simulated Route */}
            {showRoute && (
              <View style={[styles.routeLine, {
                left: touristX,
                top: touristY - 5,
                width: routeType === 'safer' ? 90 : 60,
                backgroundColor: routeType === 'safer' ? '#22c55e' : '#f59e0b',
              }]} />
            )}

            {/* Tourist Marker */}
            <View style={[styles.touristMarker, { left: touristX - 16, top: touristY - 16 }]}>
              <View style={[styles.touristPulse, { borderColor: riskInfo.color }]} />
              <View style={[styles.touristDot, { backgroundColor: riskInfo.color }]}>
                <Text style={styles.touristIcon}>📍</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Zone Legend */}
        <View style={styles.legendRow}>
          {RISK_ZONES.map(zone => (
            <TouchableOpacity
              key={zone.id}
              style={[styles.legendItem, selectedZone?.id === zone.id && styles.legendItemSelected]}
              onPress={() => setSelectedZone(selectedZone?.id === zone.id ? null : zone)}
            >
              <View style={[styles.legendDot, { backgroundColor: zone.color }]} />
              <Text style={styles.legendText}>{zone.risk}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Zone Detail */}
        {selectedZone && (
          <View style={[styles.zoneDetail, { borderColor: selectedZone.color }]}>
            <View style={styles.zoneDetailHeader}>
              <Text style={styles.zoneDetailName}>{selectedZone.name}</Text>
              <View style={[styles.zoneRiskPill, { backgroundColor: selectedZone.color + '22' }]}>
                <Text style={[styles.zoneRiskPillText, { color: selectedZone.color }]}>
                  {selectedZone.risk}
                </Text>
              </View>
            </View>
            <Text style={styles.zoneDetailScore}>
              AI Risk Score: <Text style={{ color: selectedZone.color, fontWeight: '900' }}>{selectedZone.score}</Text>/100
            </Text>
            <TouchableOpacity
              style={[styles.zoneRouteBtn, { backgroundColor: selectedZone.color + '22', borderColor: selectedZone.color }]}
              onPress={() => { setShowRoute(true); setSelectedZone(null); }}
            >
              <Text style={[styles.zoneRouteBtnText, { color: selectedZone.color }]}>
                🛡 Get Safer Route Away from {selectedZone.name}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Nearest Zone Info */}
        {nearestZone && (
          <View style={styles.nearestZoneCard}>
            <Text style={styles.nearestLabel}>NEAREST RISK ZONE</Text>
            <View style={styles.nearestRow}>
              <View style={[styles.nearestDot, { backgroundColor: nearestZone.color }]} />
              <Text style={styles.nearestName}>{nearestZone.name}</Text>
              <Text style={[styles.nearestRisk, { color: nearestZone.color }]}>{nearestZone.risk}</Text>
            </View>
          </View>
        )}

        {/* Route Comparison */}
        <Text style={styles.sectionTitle}>ROUTE COMPARISON</Text>
        <View style={styles.routeCards}>
          <TouchableOpacity
            style={[styles.routeCard, routeType === 'safer' && styles.routeCardActive]}
            onPress={() => { setRouteType('safer'); setShowRoute(true); }}
          >
            <Text style={styles.routeCardEmoji}>🛡️</Text>
            <Text style={styles.routeCardTitle}>Safer Route</Text>
            <Text style={styles.routeCardDetail}>2.6 km — +8 min</Text>
            <Text style={styles.routeCardRisk}>Avoids HIGH/CRITICAL zones</Text>
            <View style={[styles.routeRiskBar, { backgroundColor: '#22c55e' }]}>
              <Text style={styles.routeRiskBarText}>LOW RISK PATH</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.routeCard, routeType === 'fastest' && styles.routeCardActive]}
            onPress={() => { setRouteType('fastest'); setShowRoute(true); }}
          >
            <Text style={styles.routeCardEmoji}>⚡</Text>
            <Text style={styles.routeCardTitle}>Fastest Route</Text>
            <Text style={styles.routeCardDetail}>2.1 km — 0 min extra</Text>
            <Text style={styles.routeCardRisk}>Passes through HIGH risk</Text>
            <View style={[styles.routeRiskBar, { backgroundColor: '#f97316' }]}>
              <Text style={styles.routeRiskBarText}>HIGH RISK PATH</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 16, paddingBottom: 80 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '900', color: '#f8fafc', letterSpacing: 1 },
  routeToggle: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  toggleBtn: { flex: 1, backgroundColor: '#0f172a', borderRadius: 10, padding: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center' },
  toggleBtnActive: { backgroundColor: 'rgba(56,189,248,0.2)', borderColor: '#38bdf8' },
  toggleBtnText: { color: '#94a3b8', fontSize: 10, fontWeight: '700' },
  toggleBtnTextActive: { color: '#38bdf8' },
  mapContainer: { borderRadius: 18, overflow: 'hidden', marginBottom: 12 },
  mapCanvas: { backgroundColor: '#0a0f1e', borderRadius: 18, position: 'relative', overflow: 'hidden' },
  gridLine: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.04)' },
  gridH: { left: 0, right: 0, height: 1 },
  gridV: { top: 0, bottom: 0, width: 1 },
  zoneCircle: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  zoneLabel: { fontSize: 9, fontWeight: '800', textAlign: 'center' },
  incidentMarker: { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 3 },
  incidentEmoji: { fontSize: 14 },
  routeLine: { position: 'absolute', height: 3, borderRadius: 2, opacity: 0.8 },
  touristMarker: { position: 'absolute', width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  touristPulse: { position: 'absolute', width: 32, height: 32, borderRadius: 16, borderWidth: 2, opacity: 0.5 },
  touristDot: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  touristIcon: { fontSize: 14 },
  legendRow: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#0f172a', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  legendItemSelected: { borderColor: '#38bdf8' },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: '#94a3b8', fontSize: 10, fontWeight: '700' },
  zoneDetail: { backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 12 },
  zoneDetailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  zoneDetailName: { fontSize: 14, fontWeight: '800', color: '#f8fafc' },
  zoneRiskPill: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  zoneRiskPillText: { fontSize: 10, fontWeight: '800' },
  zoneDetailScore: { color: '#94a3b8', fontSize: 12, marginBottom: 10 },
  zoneRouteBtn: { borderRadius: 10, padding: 10, borderWidth: 1, alignItems: 'center' },
  zoneRouteBtnText: { fontSize: 12, fontWeight: '700' },
  nearestZoneCard: { backgroundColor: '#0f172a', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 16 },
  nearestLabel: { fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: 1, marginBottom: 6 },
  nearestRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nearestDot: { width: 10, height: 10, borderRadius: 5 },
  nearestName: { flex: 1, color: '#e2e8f0', fontSize: 13, fontWeight: '700' },
  nearestRisk: { fontSize: 12, fontWeight: '800' },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 1, marginBottom: 8 },
  routeCards: { flexDirection: 'row', gap: 10 },
  routeCard: { flex: 1, backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  routeCardActive: { borderColor: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.08)' },
  routeCardEmoji: { fontSize: 22, marginBottom: 6 },
  routeCardTitle: { color: '#f8fafc', fontSize: 12, fontWeight: '800', marginBottom: 3 },
  routeCardDetail: { color: '#94a3b8', fontSize: 11, marginBottom: 3 },
  routeCardRisk: { color: '#64748b', fontSize: 10, marginBottom: 8 },
  routeRiskBar: { borderRadius: 6, padding: 4, alignItems: 'center' },
  routeRiskBarText: { color: '#fff', fontSize: 9, fontWeight: '900' },
});
