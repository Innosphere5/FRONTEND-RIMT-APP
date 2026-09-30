import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, ImageAssets, Radii } from '../theme/tokens';
import ZoomCard from './ZoomCard';

export default function Header({
  title = 'Overview',
  eyebrow = 'RIMT ACADEMIC TRUST',
  onNotificationPress,
  onProfilePress,
  hasUnreadNotifications = true,
  avatarUrl = ImageAssets.profileAvatarSecondary,
}) {
  return (
    <ZoomCard
      style={styles.container}
      scaleTo={1.03}
      raiseOnScale={false}
      disabled={!onNotificationPress && !onProfilePress}
    >
      <View style={styles.leftSection}>
        <Image
          source={{ uri: ImageAssets.universityLogoAlt }}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.titleColumn}>
          <Text style={styles.eyebrowText}>{eyebrow}</Text>
          <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <ZoomCard
          style={styles.iconButton}
          onPress={onNotificationPress}
          scaleTo={1.20}
          accessibilityLabel="Notifications"
          accessibilityRole="button"
        >
          <MaterialIcons name="notifications-none" size={24} color={Colors.secondary} />
          {hasUnreadNotifications && <View style={styles.notificationDot} />}
        </ZoomCard>

        <ZoomCard
          style={styles.avatarButton}
          onPress={onProfilePress}
          scaleTo={1.20}
          accessibilityLabel="Open profile"
          accessibilityRole="button"
        >
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatar}
          />
        </ZoomCard>
      </View>
    </ZoomCard>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.margin,
    ...Platform.select({
      ios: {
        shadowColor: '#12263D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.spaceSm,
    flex: 1,
    marginRight: Spacing.spaceSm,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: Radii.sm,
  },
  titleColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  eyebrowText: {
    ...Typography.eyebrow,
    fontSize: 9.5,
    letterSpacing: 1.1,
    color: Colors.textSecondary,
    marginBottom: 1,
  },
  titleText: {
    ...Typography.headlineSm,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.spaceXs,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});
