import React, { useState, useCallback } from 'react';
import { Animated, Pressable, AccessibilityInfo, Platform } from 'react-native';

/**
 * ZoomCard (ScaleOnPress)
 * 
 * The single, shared micro-interaction wrapper for the entire RIMT Academic Trust app.
 * Wraps any interactive UI element with a smooth spring zoom effect that triggers
 * on both hover (web/pointer) and press (touch).
 * 
 * Spec reference: Mega Update.md Section 2.1 "Strong Zoom"
 * 
 * - scale(1.05–1.10) for cards/bars
 * - scale(1.15–1.25) for circular avatars/icons/buttons
 * - 150–200ms ease-out on press, ease-in on release
 * - cubic-bezier(0.34, 1.56, 0.64, 1) overshoot "pop"
 * - Respects prefers-reduced-motion (falls back to opacity)
 * - Raises z-index while scaled to prevent clipping
 */
export default function ZoomCard({
  children,
  style,
  containerStyle,
  onPress,
  onLongPress,
  scaleTo = 1.04,
  friction = 6,
  tension = 120,
  disabled = false,
  raiseOnScale = true,
  accessibilityRole,
  accessibilityState,
  accessibilityLabel,
  ...props
}) {
  const [scale] = useState(() => new Animated.Value(1));
  const [isScaled, setIsScaled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => (
    Platform.OS === 'web'
    && typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ));
  const [opacity] = useState(() => new Animated.Value(1));

  // Check reduced motion preference on mount
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
        if (mq) {
          const handler = (e) => setReducedMotion(e.matches);
          mq.addEventListener?.('change', handler);
          return () => mq.removeEventListener?.('change', handler);
        }
      } catch {
        // matchMedia not available
      }
    } else {
      AccessibilityInfo.isReduceMotionEnabled?.().then((enabled) => {
        if (enabled) setReducedMotion(true);
      });
    }
  }, []);

  const animateIn = useCallback(() => {
    if (disabled) return;
    setIsScaled(true);

    if (reducedMotion) {
      // Fallback: opacity dim instead of scale
      Animated.timing(opacity, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.spring(scale, {
      toValue: scaleTo,
      friction,
      tension,
      useNativeDriver: true,
    }).start();
  }, [disabled, reducedMotion, scale, scaleTo, friction, tension, opacity]);

  const animateOut = useCallback(() => {
    if (disabled) return;
    setIsScaled(false);

    if (reducedMotion) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.spring(scale, {
      toValue: 1,
      friction,
      tension,
      useNativeDriver: true,
    }).start();
  }, [disabled, reducedMotion, scale, friction, tension, opacity]);

  return (
    <Pressable
      onPressIn={animateIn}
      onPressOut={animateOut}
      onHoverIn={animateIn}
      onHoverOut={animateOut}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      style={containerStyle}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      {...props}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale }],
            opacity,
          },
          raiseOnScale && isScaled && { zIndex: 10 },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
