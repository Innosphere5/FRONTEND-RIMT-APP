import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radii, Typography, Spacing } from '../theme/tokens';

export default function DocumentCard({
  icon = 'workspace-premium',
  iconColor = Colors.primary,
  iconBgColor = 'rgba(163, 19, 33, 0.08)',
  statusBadge = 'Verified',
  statusBadgeColor = Colors.verifiedGreen,
  statusBadgeBg = 'rgba(46, 125, 79, 0.1)',
  fileMeta = 'PDF · 2.4 MB',
  title = 'Bachelor of Technology (CSE)',
  verificationLabel = 'Digitally Signed',
  verificationIcon = 'lock',
  onDownloadPress,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.leftRow}>
        <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
          <MaterialIcons name={icon} size={24} color={iconColor} />
        </View>

        <View style={styles.contentColumn}>
          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: statusBadgeBg }]}>
              <Text style={[styles.badgeText, { color: statusBadgeColor }]}>{statusBadge}</Text>
            </View>
            <Text style={styles.fileMetaText}>{fileMeta}</Text>
          </View>

          <Text style={styles.titleText} numberOfLines={1}>{title}</Text>

          <View style={styles.verificationRow}>
            <MaterialIcons name={verificationIcon} size={13} color={Colors.verifiedGreen} />
            <Text style={styles.verificationText}>{verificationLabel}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={onDownloadPress}
        activeOpacity={0.7}
        accessibilityLabel="Download Document"
      >
        <MaterialIcons name="download" size={20} color={Colors.textPrimary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: Radii.lg,
    padding: Spacing.spaceMd,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.spaceXs,
    shadowColor: '#12263D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.spaceSm,
    flex: 1,
    marginRight: Spacing.spaceSm,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: Radii.full,
  },
  badgeText: {
    ...Typography.labelSm,
    fontSize: 10.5,
    fontWeight: '600',
  },
  fileMetaText: {
    ...Typography.codeXs,
    fontSize: 10.5,
    color: Colors.textSecondary,
  },
  titleText: {
    ...Typography.titleFormal,
    fontSize: 14.5,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  verificationText: {
    ...Typography.labelSm,
    fontSize: 11,
    color: Colors.verifiedGreen,
    fontWeight: '500',
  },
  downloadButton: {
    width: 38,
    height: 38,
    borderRadius: Radii.sm,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
