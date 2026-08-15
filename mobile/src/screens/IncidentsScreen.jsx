import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl,
} from 'react-native';
import { useIncidentStore } from '../store/incidentStore';
import IncidentCard from '../components/IncidentCard';

export default function IncidentsScreen({ navigation }) {
  const { incidents, fetchIncidents } = useIncidentStore();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const STATUSES = ['ALL', 'NEW', 'VERIFIED', 'ASSIGNED', 'RESPONDING', 'RESOLVED'];

  useEffect(() => {
    fetchIncidents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchIncidents();
    setRefreshing(false);
  };

  const filtered = filter === 'ALL'
    ? (incidents || [])
    : (incidents || []).filter(i => i.status === filter);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38bdf8" />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>MY INCIDENTS</Text>
          <TouchableOpacity
            style={styles.reportBtn}
            onPress={() => navigation.navigate('IncidentReport')}
          >
            <Text style={styles.reportBtnText}>+ Report</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterRow}>
            {STATUSES.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.filterTab, filter === s && styles.filterTabActive]}
                onPress={() => setFilter(s)}
              >
                <Text style={[styles.filterTabText, filter === s && styles.filterTabTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {filtered.length === 0 ? (
          <View style={styles.emptyView}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No Incidents {filter !== 'ALL' ? 'with status ' + filter : ''}</Text>
            <Text style={styles.emptyDesc}>
              {filter === 'ALL' ? "You haven't reported any incidents yet." : 'No incidents match this filter.'}
            </Text>
            <TouchableOpacity
              style={styles.reportFirstBtn}
              onPress={() => navigation.navigate('IncidentReport')}
            >
              <Text style={styles.reportFirstBtnText}>+ Report Incident</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map(incident => (
            <IncidentCard
              key={incident.id || incident.incident_code}
              incident={incident}
              onPress={() => navigation.navigate('IncidentStatus', { incidentCode: incident.incident_code })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 16, paddingBottom: 80 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { fontSize: 16, fontWeight: '900', color: '#f8fafc', letterSpacing: 1 },
  reportBtn: { backgroundColor: '#38bdf8', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  reportBtnText: { color: '#020617', fontSize: 12, fontWeight: '900' },
  filterScroll: { marginBottom: 14 },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterTab: { backgroundColor: '#0f172a', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  filterTabActive: { backgroundColor: 'rgba(56,189,248,0.15)', borderColor: '#38bdf8' },
  filterTabText: { color: '#64748b', fontSize: 11, fontWeight: '700' },
  filterTabTextActive: { color: '#38bdf8' },
  emptyView: { paddingTop: 80, alignItems: 'center', gap: 10 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { color: '#94a3b8', fontSize: 15, fontWeight: '700' },
  emptyDesc: { color: '#475569', fontSize: 12, textAlign: 'center' },
  reportFirstBtn: { backgroundColor: 'rgba(56,189,248,0.15)', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1, borderColor: '#38bdf8', marginTop: 4 },
  reportFirstBtnText: { color: '#38bdf8', fontSize: 13, fontWeight: '700' },
});
