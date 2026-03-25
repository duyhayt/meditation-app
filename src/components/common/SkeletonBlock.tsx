import { useEffect } from 'react';
import { StyleSheet, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/useTheme';

type SkeletonBlockProps = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonBlock({
  width = '100%',
  height = 16,
  radius,
  style
}: SkeletonBlockProps): React.JSX.Element {
  const theme = useTheme();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.45, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));

  return (
    <Animated.View
      style={[
        styles.block,
        {
          width,
          height,
          borderRadius: radius ?? theme.radius.md,
          backgroundColor: theme.colors.surfaceSecondary
        } as ViewStyle,
        animatedStyle,
        style
      ]}
    />
  );
}

const styles = StyleSheet.create({
  block: {
    overflow: 'hidden'
  }
});
