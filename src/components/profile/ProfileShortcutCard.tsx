import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import type { AppIconName } from '@/theme';

import { AppIcon } from '../common/AppIcon';
import { AppText } from '../common/AppText';

type ProfileShortcutCardProps = {
  icon: AppIconName;
  title: string;
  description: string;
  meta: string;
  onPress: () => void;
};

export function ProfileShortcutCard({
  icon,
  title,
  description,
  meta,
  onPress
}: ProfileShortcutCardProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.xxl,
          opacity: pressed ? 0.94 : 1
        }
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: theme.colors.chipActive,
            borderRadius: theme.radius.xl
          }
        ]}
      >
        <AppIcon name={icon} color={theme.colors.primary} />
      </View>
      <View style={styles.copy}>
        <AppText variant="title">{title}</AppText>
        <AppText variant="bodySmall">{description}</AppText>
      </View>
      <View style={styles.trailing}>
        <AppText variant="caption" color={theme.colors.primary}>
          {meta}
        </AppText>
        <AppIcon name="chevronRight" color={theme.colors.iconMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  iconWrap: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center'
  },
  copy: {
    flex: 1,
    gap: 4
  },
  trailing: {
    alignItems: 'flex-end',
    gap: 8
  }
});
