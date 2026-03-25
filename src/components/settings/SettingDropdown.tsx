import { Pressable, View } from 'react-native';
import Animated, { Layout, LinearTransition } from 'react-native-reanimated';

import { useTheme } from '@/hooks/useTheme';
import type { AppIconName } from '@/theme';

import { AppIcon } from '../common/AppIcon';
import { AppText } from '../common/AppText';

type SettingDropdownProps = {
  icon: AppIconName;
  title: string;
  description: string;
  currentValue: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export function SettingDropdown({
  icon,
  title,
  description,
  currentValue,
  expanded,
  onToggle,
  children
}: SettingDropdownProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Animated.View layout={LinearTransition.springify()}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.md,
          borderRadius: theme.radius.xl,
          paddingVertical: theme.spacing.xs,
          opacity: pressed ? 0.88 : 1
        })}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: theme.radius.lg,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.surfaceSecondary
          }}
        >
          <AppIcon name={icon} size={theme.iconSize.md} color={theme.colors.primary} />
        </View>
        <View style={{ flex: 1, gap: theme.spacing.xs }}>
          <AppText variant="bodyStrong">{title}</AppText>
          <AppText variant="bodySmall">{description}</AppText>
        </View>
        <AppText variant="caption" color={theme.colors.textSecondary}>
          {currentValue}
        </AppText>
        <AppIcon
          name={expanded ? 'chevronDown' : 'chevronRight'}
          size={theme.iconSize.md}
          color={theme.colors.iconMuted}
        />
      </Pressable>

      {expanded ? (
        <Animated.View
          layout={Layout.springify()}
          style={{
            marginTop: theme.spacing.sm,
            marginLeft: 56,
            gap: theme.spacing.xs
          }}
        >
          {children}
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}
