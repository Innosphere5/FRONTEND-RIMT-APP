import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ShineEffect({
  colors = [
    'transparent',
    'rgba(255, 255, 255, 0.03)',
    'rgba(255, 235, 170, 0.25)',
    'rgba(255, 255, 255, 0.5)',
    'rgba(255, 235, 170, 0.25)',
    'rgba(255, 255, 255, 0.03)',
    'transparent',
  ],
  duration = 2400,
  delay = 2000,
  angle = '-22deg',
}) {
  const [animatedValue] = useState(() => new Animated.Value(0));

  useEffect(() => {
    let isMounted = true;

    const runShineAnimation = () => {
      animatedValue.setValue(0);
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: duration,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
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

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-250, 450],
  });

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Animated.View
        style={[
          styles.shineContainer,
          {
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
    top: -100,
    bottom: -100,
    width: 140,
    left: 0,
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
});
