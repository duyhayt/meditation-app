import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useTheme } from '@/hooks/useTheme';

import { AppIcon } from './AppIcon';
import { AppText } from './AppText';

type FloatingActionButtonProps = {
  label: string;
  onPress: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingActionButton({
  label,
  onPress
}: FloatingActionButtonProps): React.JSX.Element {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <View pointerEvents="box-none" style={styles.container}>
      <AnimatedPressable
        accessibilityRole="button"
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(theme.motion.scale.floating);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.fab,
            borderRadius: theme.radius.pill,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md
          },
          theme.shadows.floating,
          animatedStyle
        ]}
      >
        <AppIcon name="addDebt" size={theme.iconSize.md} color={theme.colors.onFab} />
        <AppText variant="button" color={theme.colors.onFab}>
          {label}
        </AppText>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 96
  },
  button: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  }
});
