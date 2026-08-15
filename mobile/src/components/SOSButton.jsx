import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';

export default function SOSButton({ onPress, isTriggered = false }) {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.pulseRing} />
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[styles.button, isTriggered && styles.buttonActive]}
      >
        <Text style={styles.sosEmoji}>🚨</Text>
        <Text style={styles.buttonText}>SOS</Text>
        <Text style={styles.subText}>PRESS FOR EMERGENCY</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  pulseRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  button: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#fca5a5',
  },
  buttonActive: {
    backgroundColor: '#991b1b',
  },
  sosEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
  },
  subText: {
    color: '#fecaca',
    fontSize: 8,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
