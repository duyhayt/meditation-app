import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/hooks/useTheme';

import { AppIcon } from './AppIcon';
import { AppText } from './AppText';

type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';

type AppButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: AppButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: Parameters<typeof AppIcon>[0]['name'];
  style?: StyleProp<ViewStyle>;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AppButton({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  fullWidth = true,
  iconLeft,
  style,
  ...props
}: AppButtonProps): React.JSX.Element {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const isDisabled = disabled || loading;

  const variants: Record<AppButtonVariant, { backgroundColor: string; borderColor: string; textColor: string }> = {
    primary: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      textColor: theme.colors.textOnPrimary
    },
    secondary: {
      backgroundColor: theme.colors.surfaceSecondary,
      borderColor: theme.colors.surfaceSecondary,
      textColor: theme.colors.textPrimary
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: theme.colors.textPrimary
    },
    outline: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      textColor: theme.colors.textPrimary
    },
    danger: {
      backgroundColor: theme.colors.danger,
      borderColor: theme.colors.danger,
      textColor: theme.colors.textOnPrimary
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: isDisabled ? 0.55 : 1
  }));

  const currentVariant = variants[variant];

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPressIn={() => {
        scale.value = withTiming(theme.motion.scale.pressed, { duration: theme.motion.duration.fast });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: theme.motion.duration.fast });
      }}
      style={[
        styles.button,
        {
          backgroundColor: currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
          borderRadius: theme.radius.lg,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md
        },
        animatedStyle,
        style
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={currentVariant.textColor} />
      ) : (
        <View style={styles.content}>
          {iconLeft ? <AppIcon name={iconLeft} size={theme.iconSize.md} color={currentVariant.textColor} /> : null}
          <AppText variant="button" color={currentVariant.textColor}>
            {label}
          </AppText>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  }
});
