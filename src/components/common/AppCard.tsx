import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  FadeInDown,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/useTheme';

type AppCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
  pressable?: boolean;
  onPress?: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AppCard({
  children,
  style,
  elevated = false,
  pressable = false,
  onPress
}: AppCardProps): React.JSX.Element {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.lg
    },
    elevated ? theme.shadows.medium : theme.shadows.soft,
    style
  ];

  if (!pressable && !onPress) {
    return (
      <Animated.View
        entering={FadeInDown.duration(theme.motion.duration.normal)}
        layout={Layout.springify()}
        style={cardStyle}
      >
        {children}
      </Animated.View>
    );
  }

  return (
    <AnimatedPressable
      entering={FadeInDown.duration(theme.motion.duration.normal)}
      layout={Layout.springify()}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(theme.motion.scale.pressed, { duration: theme.motion.duration.fast });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: theme.motion.duration.fast });
      }}
      style={[cardStyle, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1
  }
});
