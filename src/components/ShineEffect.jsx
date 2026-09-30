import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ShineEffect({
  colors = [
    'transparent',
    'rgba(255, 255, 255, 0.01)',
    'rgba(186, 215, 255, 0.08)',
    'rgba(255, 255, 255, 0.20)',
    'rgba(215, 235, 255, 0.12)',
    'rgba(255, 255, 255, 0.01)',
    'transparent',
  ],
  duration = 2400,
  delay = 3000,
  angle = '-22deg',
  width = 160,
  outputRange = [-320, 540],
  responsive = false,
}) {
  const [animatedValue] = useState(() => new Animated.Value(0));
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const runShineAnimation = () => {
      animatedValue.setValue(0);
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: duration,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
          useNativeDriver: true,
        }),
        Animated.delay(delay),
      ]).start(() => {
        if (isMounted) {
          runShineAnimation();
        }
      });
    };

    runShineAnimation();

    return () => {
      isMounted = false;
    };
  }, [animatedValue, duration, delay]);

  const sweepWidth = responsive && containerWidth ? containerWidth * 0.62 : width;
  const responsiveRange = responsive && containerWidth
    ? [-sweepWidth, containerWidth + sweepWidth]
    : outputRange;
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: responsiveRange,
  });

  return (
    <View
      style={StyleSheet.absoluteFillObject}
      pointerEvents="none"
      onLayout={responsive
        ? ({ nativeEvent }) => setContainerWidth((current) => (
            current === nativeEvent.layout.width ? current : nativeEvent.layout.width
          ))
        : undefined}
    >
      <Animated.View
        style={[
          styles.shineContainer,
          {
            width: sweepWidth,
            transform: [{ translateX }, { rotate: angle }],
          },
        ]}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  shineContainer: {
    position: 'absolute',
    top: -120,
    bottom: -120,
    left: 0,
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
});
