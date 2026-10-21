import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, Radii } from '../theme/tokens';
import { useNotifications } from '../context/NotificationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function NotificationBanner({ onNavigate }) {
  const { recentAlert, dismissAlert } = useNotifications();
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (recentAlert) {
      // Reset values
      translateY.setValue(-120);
      opacity.setValue(0);
      progressAnim.setValue(1);

      // Slide down spring animation
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 7,
          speed: 12,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate progress bar depleting over 6 seconds
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: 6200,
        useNativeDriver: false,
      }).start();
    } else {
      // Slide up hide animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -120,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [recentAlert, translateY, opacity, progressAnim]);

  if (!recentAlert) return null;

  const isInternship = recentAlert.type === 'internship';
  const isDrive = recentAlert.type === 'drive';

  // Theming based on type
  const theme = isInternship
    ? {
        gradient: ['#1C162E', '#161324', '#0F0D18'],
        tagColor: '#D8B4FE',
        tagBg: 'rgba(168, 85, 247, 0.22)',
        tagBorder: 'rgba(192, 132, 252, 0.4)',
        borderColor: 'rgba(168, 85, 247, 0.35)',
        icon: 'work',
        iconColor: '#C084FC',
        tagText: 'INTERNSHIP ALERT',
        accentBadge: recentAlert.data?.stipend_amount
          ? `₹${Number(recentAlert.data.stipend_amount).toLocaleString('en-IN')}/mo`
          : 'Corporate Role',
      }
    : {
        gradient: ['#231518', '#1A1012', '#100B0D'],
        tagColor: '#FDE68A',
        tagBg: 'rgba(217, 119, 6, 0.24)',
        tagBorder: 'rgba(253, 230, 138, 0.45)',
        borderColor: 'rgba(239, 68, 68, 0.35)',
        icon: 'rocket-launch',
        iconColor: '#FBBF24',
        tagText: 'PLACEMENT DRIVE',
        accentBadge: recentAlert.data?.package_min
          ? `${recentAlert.data.package_min}${recentAlert.data.package_max ? ` - ${recentAlert.data.package_max}` : ''} LPA`
          : 'Campus Drive',
      };

  const handlePress = () => {
    dismissAlert();
    if (onNavigate) {
      onNavigate('notifications');
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={handlePress}
        style={styles.touchableCard}
      >
        <LinearGradient
          colors={theme.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderColor: theme.borderColor }]}
        >
          {/* Subtle Ambient Glow */}
          <View style={[styles.ambientGlow, { backgroundColor: theme.iconColor }]} />

          {/* Top meta row */}
          <View style={styles.topRow}>
            <View style={[styles.tagBadge, { backgroundColor: theme.tagBg, borderColor: theme.tagBorder }]}>
              <View style={[styles.pulseDot, { backgroundColor: theme.tagColor }]} />
              <MaterialIcons name={theme.icon} size={13} color={theme.tagColor} style={styles.tagIcon} />
              <Text style={[styles.tagText, { color: theme.tagColor }]}>{theme.tagText}</Text>
            </View>

            <View style={styles.rightPills}>
              {Boolean(theme.accentBadge) && (
                <View style={styles.compensationPill}>
                  <Text style={styles.compensationText}>{theme.accentBadge}</Text>
                </View>
              )}
              <TouchableOpacity
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                onPress={dismissAlert}
                style={styles.closeBtn}
              >
                <MaterialIcons name="close" size={16} color="rgba(255, 255, 255, 0.65)" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content section */}
          <View style={styles.contentRow}>
            <View style={styles.iconCircle}>
              <MaterialIcons name={theme.icon} size={20} color={theme.iconColor} />
            </View>
            <View style={styles.textColumn}>
              <Text style={styles.titleText} numberOfLines={1}>
                {recentAlert.title || 'New Announcement'}
              </Text>
              <Text style={styles.messageText} numberOfLines={2}>
                {recentAlert.message || 'Tap to view details.'}
              </Text>
            </View>
          </View>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <Text style={styles.hintText}>Just now · T&P Division</Text>
            <View style={styles.viewDetailsBtn}>
              <Text style={styles.viewDetailsText}>View Notification</Text>
              <MaterialIcons name="arrow-forward" size={13} color="#ffffff" />
            </View>
          </View>

          {/* Animated Auto-dismiss Progress Bar */}
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  backgroundColor: theme.iconColor,
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 20,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
    paddingHorizontal: Spacing.marginMobile,
  },
  touchableCard: {
    width: '100%',
    maxWidth: 520,
  },
  card: {
    borderRadius: Radii.lg,
    borderWidth: 1.2,
    padding: Spacing.spaceSm,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  ambientGlow: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    opacity: 0.16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.space2xs,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
    borderWidth: 0.8,
  },
  pulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 5,
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    ...Typography.eyebrow,
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  rightPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.spaceXs,
  },
  compensationPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  compensationText: {
    ...Typography.codeXs,
    color: '#ffffff',
    fontSize: 10.5,
    fontWeight: '700',
  },
  closeBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.spaceSm,
    marginTop: 4,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  textColumn: {
    flex: 1,
  },
  titleText: {
    ...Typography.titleFormal,
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  messageText: {
    ...Typography.bodySm,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.78)',
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.spaceXs,
    paddingTop: 6,
    borderTopWidth: 0.6,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  hintText: {
    ...Typography.bodySm,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  viewDetailsText: {
    ...Typography.labelButton,
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  progressTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  progressBar: {
    height: '100%',
  },
});
