import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useLocationStore } from '../store/locationStore';
import { useRiskStore } from '../store/riskStore';
import { useNetworkStore } from '../store/networkStore';
import { useIncidentStore } from '../store/incidentStore';

export default function DemoController() {
  const [modalVisible, setModalVisible] = useState(false);

  const { setLocation, syncLocationToServer } = useLocationStore();
  const { setDynamicRisk, predictSituationalRisk } = useRiskStore();
  const { isOnline, toggleSimulatedOffline } = useNetworkStore();
  const { reportSOS, syncOfflineQueue, updateIncidentStatusLocal } = useIncidentStore();

  const handleTeleport = async (name, lat, lon, score, level) => {
    setLocation(lat, lon, name);
    setDynamicRisk(score, level, {
      historical_risk_weight: (score * 0.28).toFixed(1),
      recent_hazards_weight: (score * 0.35).toFixed(1),
      night_density_weight: (score * 0.15).toFixed(1),
    });
    await syncLocationToServer();
    setModalVisible(false);
  };

  const handleSimulateSOS = async () => {
    await reportSOS({ latitude: 12.9820, longitude: 77.6080 }, 68.4, 'HIGH', isOnline);
    setModalVisible(false);
  };

  const handleSimulateResolution = () => {
    updateIncidentStatusLocal('INC-1024', 'RESOLVED', 'Officer K. Sharma', 0);
    setDynamicRisk(14.0, 'LOW');
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
        style={styles.floatingButton}
      >
        <Text style={styles.floatingText}>🎮 DEMO HUD</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>SIH Jury Presentation Controller</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionLabel}>GEOGRAPHICAL TELEPORT & GEOFENCING</Text>
              
              <TouchableOpacity
                style={[styles.scenarioBtn, styles.greenBtn]}
                onPress={() => handleTeleport('Cubbon Park Heritage Area (Safe Zone)', 12.9763, 77.5929, 14.0, 'LOW')}
              >
                <Text style={styles.btnTitle}>🟢 1. SAFE ZONE (Cubbon Park)</Text>
                <Text style={styles.btnDesc}>Risk: 14.0 / LOW | Standard Tourist Perimeter</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.scenarioBtn, styles.amberBtn]}
                onPress={() => handleTeleport('MG Road High Density Transit Hub', 12.9756, 77.6066, 38.5, 'MODERATE')}
              >
                <Text style={styles.btnTitle}>🟡 2. MODERATE RISK (MG Road Metro)</Text>
                <Text style={styles.btnDesc}>Risk: 38.5 / MODERATE | High Crowd Density</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.scenarioBtn, styles.orangeBtn]}
                onPress={() => handleTeleport('Commercial Street Narrow Alleyways', 12.9822, 77.6083, 68.4, 'HIGH')}
              >
                <Text style={styles.btnTitle}>🟠 3. HIGH RISK (Commercial Street)</Text>
                <Text style={styles.btnDesc}>Risk: 68.4 / HIGH | Triggers Geofence Warning & Safer Route</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.scenarioBtn, styles.redBtn]}
                onPress={() => handleTeleport('Shivajinagar Stormwater Canal Zone', 12.9860, 77.6015, 88.2, 'CRITICAL')}
              >
                <Text style={styles.btnTitle}>🔴 4. CRITICAL RISK (Shivajinagar Canal)</Text>
                <Text style={styles.btnDesc}>Risk: 88.2 / CRITICAL | Immediate Hazard Zone</Text>
              </TouchableOpacity>

              <Text style={styles.sectionLabel}>NETWORK RESILIENCE & OFFLINE QUEUE</Text>
              
              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.smallBtn, isOnline ? styles.offlineToggleBtn : styles.onlineToggleBtn]}
                  onPress={toggleSimulatedOffline}
                >
                  <Text style={styles.smallBtnText}>
                    {isOnline ? '📴 NETWORK OFF' : '📶 RESTORE NETWORK'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.smallBtn, styles.syncBtn]}
                  onPress={async () => {
                    await syncOfflineQueue();
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.smallBtnText}>🔄 SYNC QUEUE</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionLabel}>INCIDENT LIFECYCLE SIMULATION</Text>

              <TouchableOpacity
                style={[styles.scenarioBtn, styles.sosBtn]}
                onPress={handleSimulateSOS}
              >
                <Text style={styles.btnTitle}>🚨 TRIGGER EMERGENCY SOS</Text>
                <Text style={styles.btnDesc}>Dispatches distress packet with GPS coordinates & Risk Score</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.scenarioBtn, styles.resolveBtn]}
                onPress={handleSimulateResolution}
              >
                <Text style={styles.btnTitle}>✅ RESOLVE INCIDENT (INC-1024)</Text>
                <Text style={styles.btnDesc}>Advances state to RESOLVED & restores safe status</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 84,
    right: 16,
    backgroundColor: '#0284c7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: '#38bdf8',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 99,
  },
  floatingText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 12,
  },
  modalTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800',
  },
  closeText: {
    color: '#94a3b8',
    fontSize: 18,
    padding: 4,
  },
  sectionLabel: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 8,
  },
  scenarioBtn: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
  },
  greenBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: '#059669',
  },
  amberBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: '#d97706',
  },
  orangeBtn: {
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    borderColor: '#ea580c',
  },
  redBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#dc2626',
  },
  sosBtn: {
    backgroundColor: 'rgba(220, 38, 38, 0.25)',
    borderColor: '#ef4444',
  },
  resolveBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981',
  },
  btnTitle: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  btnDesc: {
    color: '#94a3b8',
    fontSize: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  smallBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  offlineToggleBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#f87171',
  },
  onlineToggleBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#34d399',
  },
  syncBtn: {
    backgroundColor: 'rgba(14, 165, 233, 0.2)',
    borderColor: '#38bdf8',
  },
  smallBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
