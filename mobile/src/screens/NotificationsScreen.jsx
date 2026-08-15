import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl,
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../constants/config';

const MOCK_NOTIFICATIONS = [
  {
    id: 'n1', type: 'RISK_ALERT', title: 'High Risk Zone Nearby', time: '2 min ago',
    body: 'You are approaching Shivajinagar, a CRITICAL risk zone. Consider an alternate route.',
    emoji: '🔴', read: false, color: '#ef4444',
  },
  {
    id: 'n2', type: 'INCIDENT_UPDATE', title: 'Incident INC-2024-001 Updated', time: '8 min ago',
    body: 'Status changed: NEW → VERIFIED. Authorities are reviewing your report.',
    emoji: '📋', read: false, color: '#f59e0b',
  },
  {
    id: 'n3', type: 'GEOFENCE', title: 'Geofence Breach Detected', time: '15 min ago',
    body: 'You entered the MG Road MODERATE risk zone. Stay alert.',
    emoji: '⚠️', read: true, color: '#f97316',
  },
  {
    id: 'n4', type: 'SYSTEM', title: 'Digital Identity Verified', time: '1 hour ago',
    body: 'Your DID credential did:sih:tourist-1024:aadhaar-verified has been confirmed on-chain.',
    emoji: '🆔', read: true, color: '#22c55e',
  },
  {
    id: 'n5', type: 'INCIDENT_UPDATE', title: 'Responder Assigned', time: '2 hours ago',
    body: 'Unit Alpha-7 has been assigned to your emergency SOS. ETA: 4 minutes.',
    emoji: '🚔', read: true, color: '#38bdf8',
  },
];

export default function NotificationsScreen({ navigation }) {
  const { token } = useAuthStore();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const FILTERS = ['ALL', 'RISK_ALERT', 'INCIDENT_UPDATE', 'GEOFENCE', 'SYSTEM'];

  const filtered = filter === 'ALL'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // In production: fetch from backend /notifications
    await new Promise(r => setTimeout(r, 800));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38bdf8" />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>NOTIFICATIONS</Text>
            {unreadCount > 0 && (
              <Text style={styles.unreadCount}>{unreadCount} unread</Text>
            )}
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
              <Text style={styles.markAllText}>Mark All Read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterRow}>
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.filterTab, filter === f && styles.filterTabActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
                  {f === 'ALL' ? 'All' : f.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Notifications List */}
        {filtered.length === 0 ? (
          <View style={styles.emptyView}>
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyDesc}>You're all caught up!</Text>
          </View>
        ) : (
          filtered.map(n => (
            <TouchableOpacity
              key={n.id}
              style={[styles.notifCard, !n.read && { borderColor: n.color + '44', backgroundColor: n.color + '08' }]}
              onPress={() => markRead(n.id)}
            >
              <View style={[styles.notifIconWrap, { backgroundColor: n.color + '20' }]}>
                <Text style={styles.notifEmoji}>{n.emoji}</Text>
              </View>
              <View style={styles.notifContent}>
                <View style={styles.notifTopRow}>
                  <Text style={[styles.notifTitle, !n.read && { color: '#f8fafc' }]}>{n.title}</Text>
                  {!n.read && <View style={[styles.unreadDot, { backgroundColor: n.color }]} />}
                </View>
                <Text style={styles.notifBody}>{n.body}</Text>
                <Text style={styles.notifTime}>{n.time}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 16, paddingBottom: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  title: { fontSize: 16, fontWeight: '900', color: '#f8fafc', letterSpacing: 1 },
  unreadCount: { color: '#f59e0b', fontSize: 11, fontWeight: '700', marginTop: 2 },
  markAllBtn: { backgroundColor: '#0f172a', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  markAllText: { color: '#94a3b8', fontSize: 11, fontWeight: '700' },
  filterScroll: { marginBottom: 16 },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterTab: { backgroundColor: '#0f172a', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  filterTabActive: { backgroundColor: 'rgba(56,189,248,0.15)', borderColor: '#38bdf8' },
  filterTabText: { color: '#64748b', fontSize: 11, fontWeight: '700' },
  filterTabTextActive: { color: '#38bdf8' },
  emptyView: { paddingTop: 80, alignItems: 'center' },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: '#94a3b8', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptyDesc: { color: '#475569', fontSize: 13 },
  notifCard: { flexDirection: 'row', backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 10, gap: 12 },
  notifIconWrap: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  notifEmoji: { fontSize: 20 },
  notifContent: { flex: 1 },
  notifTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  notifTitle: { flex: 1, color: '#94a3b8', fontSize: 13, fontWeight: '700' },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  notifBody: { color: '#64748b', fontSize: 11, lineHeight: 15, marginBottom: 6 },
  notifTime: { color: '#475569', fontSize: 10 },
});
