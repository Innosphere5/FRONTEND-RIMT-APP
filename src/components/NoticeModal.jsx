import React, { useEffect, useState } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontFamilies, Radii, Spacing } from '../theme/tokens';

export default function NoticeModal({
  visible,
  title,
  message,
  actionLabel = 'Understood',
  secondaryLabel,
  onAction,
  onSecondaryAction,
  onDismiss,
  icon = 'verified-user',
  tone = 'brand',
  details = [],
}) {
  const [progress] = useState(() => new Animated.Value(0));
  const toneStyles = {
    brand: { gradient: [Colors.primaryContainer, Colors.primary], accent: Colors.primary, action: Colors.primary },
    success: { gradient: ['#23845A', '#17633F'], accent: Colors.verifiedGreen, action: Colors.verifiedGreen },
    warning: { gradient: ['#C18A25', '#8E6216'], accent: '#9A6915', action: '#8E6216' },
    neutral: { gradient: ['#3E6186', '#203C5A'], accent: Colors.secondary, action: Colors.secondaryNavy },
  };
  const palette = toneStyles[tone] || toneStyles.brand;

  useEffect(() => {
    if (visible) {
      Animated.spring(progress, {
        toValue: 1,
        friction: 7,
        tension: 90,
        useNativeDriver: true,
      }).start();
    } else {
      progress.setValue(0);
    }
  }, [progress, visible]);

  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <View style={styles.backdrop}>
        <Animated.View style={[styles.card, { opacity: progress, transform: [{ scale }] }]}>
          <LinearGradient
            colors={palette.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.accent}
          >
            <View style={styles.iconDisc}>
              <MaterialIcons name={icon} size={21} color={palette.accent} />
            </View>
            <Text style={styles.eyebrow}>RIMT ACADEMIC TRUST</Text>
          </LinearGradient>

          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            {details.length > 0 && (
              <View style={styles.detailsPanel}>
                {details.map((detail) => (
                  <View key={detail.label} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{detail.label}</Text>
                    <Text style={styles.detailValue} numberOfLines={2}>{detail.value}</Text>
                  </View>
                ))}
              </View>
            )}
            <TouchableOpacity
              style={[styles.action, { backgroundColor: palette.action }]}
              onPress={onAction || onDismiss}
              activeOpacity={0.82}
            >
              <Text style={styles.actionText}>{actionLabel}</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
            {secondaryLabel && (
              <TouchableOpacity
                style={styles.secondaryAction}
                onPress={onSecondaryAction || onDismiss}
                activeOpacity={0.75}
              >
                <Text style={styles.secondaryActionText}>{secondaryLabel}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(18, 38, 61, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.margin,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.72)',
    shadowColor: Colors.tertiaryDeep,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.26,
    shadowRadius: 28,
    elevation: 18,
  },
  accent: {
    minHeight: 88,
    paddingHorizontal: Spacing.spaceLg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconDisc: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontFamily: FontFamilies.sansMedium,
    color: 'rgba(255,255,255,0.82)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  content: {
    padding: Spacing.spaceLg,
  },
  title: {
    fontFamily: FontFamilies.sansMedium,
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    fontFamily: FontFamilies.sans,
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  action: {
    minHeight: 46,
    borderRadius: Radii.md,
    marginTop: Spacing.spaceLg,
    paddingHorizontal: Spacing.spaceMd,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionText: {
    fontFamily: FontFamilies.sansMedium,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryAction: {
    minHeight: 40,
    paddingHorizontal: Spacing.spaceMd,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionText: {
    fontFamily: FontFamilies.sansMedium,
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  detailsPanel: {
    marginTop: Spacing.spaceMd,
    paddingHorizontal: Spacing.spaceSm,
    backgroundColor: Colors.canvasAlt,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.spaceSm,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontFamily: FontFamilies.sansMedium,
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
    fontFamily: FontFamilies.sansMedium,
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
});