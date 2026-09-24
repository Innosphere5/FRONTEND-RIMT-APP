import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radii, Typography, Spacing } from '../theme/tokens';

export default function MetricCard({
  icon = 'school',
  iconColor = Colors.primary,
  iconBgColor = 'rgba(163, 19, 33, 0.08)',
  iconBorderColor = 'rgba(163, 19, 33, 0.15)',
  badgeText = 'Valid',
  badgeIcon = 'check-circle',
  badgeBgColor = 'rgba(46, 125, 79, 0.1)',
  badgeTextColor = Colors.verifiedGreen,
  value = '3',
  label = 'Verified Degrees',
  isProgress = false,
  cardBg = '#ffffff',
  borderColor = Colors.border,
}) {
  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
      <View style={styles.topRow}>
        <View style={[styles.iconWrapper, { backgroundColor: iconBgColor, borderColor: iconBorderColor }]}>
          <MaterialIcons name={icon} size={20} color={iconColor} />
        </View>

        <View style={[styles.badge, { backgroundColor: badgeBgColor }]}>
          <Text style={[styles.badgeText, { color: badgeTextColor }]}>{badgeText}</Text>
          {badgeIcon && (
            <MaterialIcons name={badgeIcon} size={13} color={badgeTextColor} />
          )}
        </View>
      </View>

      <View style={styles.bottomContent}>
        <Text style={styles.valueText}>{value}</Text>
        <Text style={styles.labelText} numberOfLines={1}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 128,
    borderRadius: Radii.lg,
    padding: Spacing.spaceMd,
    borderWidth: 1,
    justifyContent: 'space-between',
    shadowColor: '#12263D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: Radii.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
  },
  badgeText: {
    ...Typography.labelSm,
    fontSize: 11,
    fontWeight: '600',
  },
  bottomContent: {
    marginTop: 'auto',
  },
  valueText: {
    ...Typography.headlineLg,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  labelText: {
    ...Typography.labelSm,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
