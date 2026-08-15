import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const STEPS = [
  { key: 'NEW', label: 'Incident Created' },
  { key: 'VERIFIED', label: 'Verified by Operator' },
  { key: 'ASSIGNED', label: 'Unit Assigned' },
  { key: 'RESPONDING', label: 'Responder Dispatched' },
  { key: 'RESOLVED', label: 'Incident Resolved' },
];

export default function StatusTimeline({ currentStatus = 'NEW' }) {
  const currentIdx = STEPS.findIndex((s) => s.key === currentStatus);
  const activeStep = currentIdx >= 0 ? currentIdx : 0;

  return (
    <View style={styles.container}>
      {STEPS.map((step, idx) => {
        const isPassed = idx <= activeStep;
        const isCurrent = idx === activeStep;

        return (
          <View key={step.key} style={styles.stepRow}>
            {/* Left Circle & Line */}
            <View style={styles.leftCol}>
              <View
                style={[
                  styles.circle,
                  isPassed && styles.circlePassed,
                  isCurrent && styles.circleCurrent,
                ]}
              >
                {isPassed ? (
                  <Text style={styles.checkText}>✓</Text>
                ) : (
                  <View style={styles.dotPending} />
                )}
              </View>
              {idx < STEPS.length - 1 && (
                <View
                  style={[
                    styles.line,
                    idx < activeStep ? styles.linePassed : styles.linePending,
                  ]}
                />
              )}
            </View>

            {/* Right Label & Subtext */}
            <View style={styles.rightCol}>
              <Text
                style={[
                  styles.label,
                  isPassed && styles.labelPassed,
                  isCurrent && styles.labelCurrent,
                ]}
              >
                {step.label}
              </Text>
              {isCurrent && (
                <Text style={styles.statusBadge}>[ACTIVE STAGE]</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftCol: {
    alignItems: 'center',
    width: 28,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#475569',
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  circlePassed: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  circleCurrent: {
    backgroundColor: '#0369a1',
    borderColor: '#38bdf8',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  checkText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  dotPending: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#64748b',
  },
  line: {
    width: 2,
    height: 24,
    marginVertical: 2,
  },
  linePassed: {
    backgroundColor: '#0284c7',
  },
  linePending: {
    backgroundColor: '#334155',
  },
  rightCol: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 16,
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  labelPassed: {
    color: '#cbd5e1',
    fontWeight: '600',
  },
  labelCurrent: {
    color: '#38bdf8',
    fontWeight: '800',
  },
  statusBadge: {
    fontSize: 10,
    color: '#38bdf8',
    fontWeight: '700',
    marginTop: 2,
  },
});
