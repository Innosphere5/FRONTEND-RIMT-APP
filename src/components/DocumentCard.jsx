import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radii, Typography, Spacing } from '../theme/tokens';
import ZoomCard from './ZoomCard';

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
  viewMode = 'list',
}) {
  return (
    <ZoomCard
      containerStyle={viewMode === 'grid' ? styles.gridWrapper : undefined}
      style={[styles.card, viewMode === 'grid' && styles.gridCard]}
      onPress={onPress}
    >
      <View style={[styles.leftRow, viewMode === 'grid' && styles.gridLeftRow]}>
        <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
          <MaterialIcons name={icon} size={24} color={iconColor} />
        </View>

        <View style={[styles.contentColumn, viewMode === 'grid' && styles.gridContentColumn]}>
          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: statusBadgeBg }]}>
              <Text style={[styles.badgeText, { color: statusBadgeColor }]}>{statusBadge}</Text>
            </View>
            <Text
              style={[styles.fileMetaText, viewMode === 'grid' && styles.gridFileMetaText]}
              numberOfLines={viewMode === 'grid' ? 2 : 1}
            >
              {fileMeta}
            </Text>
          </View>

          <Text style={styles.titleText} numberOfLines={2}>{title}</Text>

          <View style={[styles.verificationRow, viewMode === 'grid' && styles.gridVerificationRow]}>
            <MaterialIcons name={verificationIcon} size={14} color={Colors.verifiedGreen} />
            <Text
              style={[styles.verificationText, viewMode === 'grid' && styles.gridVerificationText]}
              numberOfLines={viewMode === 'grid' ? 2 : 1}
            >
              {verificationLabel}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={onDownloadPress}
        activeOpacity={0.7}
        accessibilityLabel="Download Document"
      >
        <MaterialIcons name="download" size={20} color="#1E293B" />
      </TouchableOpacity>
    </ZoomCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.spaceSm,
    shadowColor: '#12263D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  gridCard: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  gridWrapper: {
    width: '48%',
    marginBottom: Spacing.spaceSm,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.spaceSm,
    flex: 1,
    marginRight: Spacing.spaceSm,
  },
  gridLeftRow: {
    marginRight: 0,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  gridContentColumn: {
    width: '100%',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
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
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  badgeText: {
    ...Typography.credentialBadge,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  fileMetaText: {
    ...Typography.credentialMeta,
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  gridFileMetaText: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  titleText: {
    ...Typography.credentialTitle,
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.25,
    lineHeight: 19.5,
    color: '#0F172A',
    marginVertical: 2,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  gridVerificationRow: {
    alignItems: 'flex-start',
  },
  verificationText: {
    ...Typography.credentialVerification,
    fontSize: 11.5,
    fontWeight: '500',
    color: '#2E7D4F',
    letterSpacing: -0.1,
  },
  gridVerificationText: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  downloadButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});
