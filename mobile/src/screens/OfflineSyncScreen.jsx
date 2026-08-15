import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { useIncidentStore } from '../store/incidentStore';
import { useNetworkStore } from '../store/networkStore';

export default function OfflineSyncScreen({ navigation }) {
  const { offlineQueue, syncOfflineQueue } = useIncidentStore();
  const { isOnline } = useNetworkStore();
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const handleSync = async () => {
    if (!isOnline) {
      setSyncResult({ success: false, message: 'No internet connection. Cannot sync.' });
      return;
    }
    setSyncing(true);
    setSyncResult(null);
    try {
      await syncOfflineQueue();
      setSyncResult({ success: true, message: 'All offline incidents synced to server successfully!' });
    } catch (e) {
      setSyncResult({ success: false, message: 'Sync failed. Please try again.' });
    } finally {
      setSyncing(false);
    }
  };

  const TYPE_EMOJIS = {
    SOS: '🚨', MEDICAL: '🏥', ACCIDENT: '🚗', UNSAFE_AREA: '⚠️',
    SUSPICIOUS: '👁', LOST_TOURIST: '🧭', THEFT: '🔓', OTHER: '📋',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>OFFLINE SYNC QUEUE</Text>
        </View>

        {/* Status Banner */}
        <View style={[
          styles.statusBanner,
          { backgroundColor: isOnline ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' },
        ]}>
          <Text style={styles.statusIcon}>{isOnline ? '📶' : '📵'}</Text>
          <View>
            <Text style={[styles.statusTitle, { color: isOnline ? '#22c55e' : '#ef4444' }]}>
              {isOnline ? 'ONLINE — SYNC AVAILABLE' : 'OFFLINE — QUEUE MODE'}
            </Text>
            <Text style={styles.statusDesc}>
              {isOnline
                ? 'Connected. Click Sync Now to push pending incidents to the server.'
                : 'No internet detected. Incidents are queued locally and will sync when connection is restored.'}
            </Text>
          </View>
        </View>

        {/* How it works */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📱 How Offline Mode Works</Text>
          <Text style={styles.infoText}>
            When you have no internet connection:{'\n'}
            1. SOS alerts and incident reports are saved to your device's local storage.{'\n'}
            2. Each offline entry is marked as PENDING.{'\n'}
            3. When connectivity is restored, you can tap "Sync Now" to transmit all pending data.{'\n'}
            4. The backend processes them in order and assigns incident codes.
          </Text>
        </View>

        {/* Sync Result */}
        {syncResult && (
          <View style={[
            styles.syncResult,
            { borderColor: syncResult.success ? '#22c55e' : '#ef4444', backgroundColor: syncResult.success ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' },
          ]}>
            <Text style={[styles.syncResultText, { color: syncResult.success ? '#22c55e' : '#ef4444' }]}>
              {syncResult.success ? '✅ ' : '❌ '}{syncResult.message}
            </Text>
          </View>
        )}

        {/* Queue Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{(offlineQueue || []).length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: '#22c55e' }]}>
              {(offlineQueue || []).filter(i => i.status === 'SYNCED').length}
            </Text>
            <Text style={styles.statLabel}>Synced</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: '#ef4444' }]}>
              {(offlineQueue || []).filter(i => i.type === 'SOS').length}
            </Text>
            <Text style={styles.statLabel}>SOS Events</Text>
          </View>
        </View>

        {/* Sync Button */}
        <TouchableOpacity
          style={[
            styles.syncBtn,
            (!isOnline || !(offlineQueue || []).length) && styles.syncBtnDisabled,
          ]}
          onPress={handleSync}
          disabled={!isOnline || syncing || !(offlineQueue || []).length}
        >
          {syncing ? (
            <ActivityIndicator color="#020617" />
          ) : (
            <Text style={styles.syncBtnText}>
              {!(offlineQueue || []).length ? '✅ No Pending Items' : '⬆️ SYNC NOW'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Queue List */}
        <Text style={styles.sectionTitle}>
          PENDING QUEUE ({(offlineQueue || []).length} items)
        </Text>

        {(!offlineQueue || offlineQueue.length === 0) ? (
          <View style={styles.emptyView}>
            <Text style={styles.emptyEmoji}>📥</Text>
            <Text style={styles.emptyTitle}>Queue is Empty</Text>
            <Text style={styles.emptyDesc}>
              All incidents have been synced. Nothing pending.
            </Text>
          </View>
        ) : (
          (offlineQueue || []).map((item, i) => (
            <View key={i} style={styles.queueItem}>
              <View style={styles.queueItemLeft}>
                <Text style={styles.queueEmoji}>{TYPE_EMOJIS[item.incident_type] || TYPE_EMOJIS[item.type] || '📋'}</Text>
              </View>
              <View style={styles.queueItemInfo}>
                <Text style={styles.queueItemType}>{item.incident_type || item.type || 'INCIDENT'}</Text>
                <Text style={styles.queueItemDesc}>{item.description || 'No description'}</Text>
                <Text style={styles.queueItemTime}>
                  {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Just now'}
                </Text>
              </View>
              <View style={[
                styles.queueStatusBadge,
                { backgroundColor: item.status === 'SYNCED' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)' },
              ]}>
                <Text style={[styles.queueStatusText, { color: item.status === 'SYNCED' ? '#22c55e' : '#f59e0b' }]}>
                  {item.status || 'PENDING'}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 16, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  backText: { color: '#38bdf8', fontSize: 13, fontWeight: '700' },
  title: { fontSize: 14, fontWeight: '900', color: '#f8fafc', letterSpacing: 1 },
  statusBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 14 },
  statusIcon: { fontSize: 24 },
  statusTitle: { fontSize: 12, fontWeight: '800', marginBottom: 4 },
  statusDesc: { color: '#64748b', fontSize: 11, lineHeight: 15 },
  infoCard: { backgroundColor: 'rgba(56,189,248,0.06)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(56,189,248,0.15)', marginBottom: 14 },
  infoTitle: { color: '#38bdf8', fontSize: 12, fontWeight: '800', marginBottom: 6 },
  infoText: { color: '#64748b', fontSize: 11, lineHeight: 17 },
  syncResult: { borderRadius: 12, padding: 12, borderWidth: 1, marginBottom: 12 },
  syncResultText: { fontSize: 12, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#0f172a', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', alignItems: 'center' },
  statNum: { fontSize: 28, fontWeight: '900', color: '#f59e0b', marginBottom: 4 },
  statLabel: { color: '#64748b', fontSize: 10, fontWeight: '700' },
  syncBtn: { backgroundColor: '#38bdf8', borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 20 },
  syncBtnDisabled: { opacity: 0.4 },
  syncBtnText: { color: '#020617', fontSize: 15, fontWeight: '900' },
  sectionTitle: { fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: 1, marginBottom: 10 },
  emptyView: { paddingTop: 40, alignItems: 'center', gap: 8 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { color: '#94a3b8', fontSize: 15, fontWeight: '700' },
  emptyDesc: { color: '#475569', fontSize: 12, textAlign: 'center' },
  queueItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 8, gap: 12 },
  queueItemLeft: { width: 36, height: 36, backgroundColor: '#1e293b', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  queueEmoji: { fontSize: 18 },
  queueItemInfo: { flex: 1 },
  queueItemType: { color: '#e2e8f0', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  queueItemDesc: { color: '#64748b', fontSize: 10, marginBottom: 3 },
  queueItemTime: { color: '#475569', fontSize: 9 },
  queueStatusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  queueStatusText: { fontSize: 9, fontWeight: '900' },
});
