import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStore } from '../store/networkStore';

export default function NetworkStatus() {
  const { isOnline, isSimulatedOffline } = useNetworkStore();

  return (
    <View
      style={[
        styles.container,
        isOnline ? styles.onlineContainer : styles.offlineContainer,
      ]}
    >
      <View
        style={[
          styles.indicatorDot,
          { backgroundColor: isOnline ? '#10b981' : '#f87171' },
        ]}
      />
      <Text
        style={[
          styles.statusText,
          { color: isOnline ? '#34d399' : '#fca5a5' },
        ]}
      >
        {isOnline ? 'ONLINE' : 'OFFLINE (EDGE MODE)'}
      </Text>
      {isSimulatedOffline && (
        <Text style={styles.simText}>[SIMULATED]</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  onlineContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  offlineContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  simText: {
    fontSize: 9,
    color: '#fbbf24',
    marginLeft: 4,
    fontWeight: '700',
  },
});
