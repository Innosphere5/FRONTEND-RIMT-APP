import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radii, Typography, Spacing } from '../theme/tokens';

export default function ActionTile({
  icon = 'school',
  iconColor = Colors.primary,
  iconBgColor = 'rgba(163, 19, 33, 0.08)',
  title = 'My Degrees',
  subtitle,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: iconBgColor }]}>
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.spaceSm,
    padding: Spacing.spaceSm,
    borderRadius: Radii.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#12263D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...Typography.labelMd,
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.codeXs,
    fontSize: 10.5,
    color: Colors.textSecondary,
    marginTop: 1,
  },
});
