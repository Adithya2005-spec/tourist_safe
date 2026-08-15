import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getRiskInfo } from '../constants/riskLevels';

export default function RiskBadge({ score = 18.5, level = 'LOW', size = 'medium' }) {
  const info = getRiskInfo(score);
  const isLarge = size === 'large';

  return (
    <View
      style={[
        styles.badgeContainer,
        {
          backgroundColor: info.bgColor,
          borderColor: info.borderColor,
          paddingVertical: isLarge ? 8 : 4,
          paddingHorizontal: isLarge ? 14 : 10,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: info.color }]} />
      <Text
        style={[
          styles.badgeText,
          {
            color: info.color,
            fontSize: isLarge ? 13 : 11,
            fontWeight: '700',
          },
        ]}
      >
        {score} / 100 ({level || info.label.replace(' RISK', '')})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontFamily: 'System',
  },
});
