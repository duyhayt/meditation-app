import { Pressable, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { AppText } from './AppText';

type SectionHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  actionLabel?: string;
  onAction?: () => void;
  rightSlot?: React.ReactNode;
};

export function SectionHeader({
  title,
  description,
  eyebrow,
  actionLabel,
  onAction,
  rightSlot
}: SectionHeaderProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <View
      style={{
        marginBottom: theme.spacing.lg,
        gap: theme.spacing.sm
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: theme.spacing.lg
        }}
      >
        <View style={{ flex: 1, gap: theme.spacing.xs }}>
          {eyebrow ? <AppText variant="label">{eyebrow}</AppText> : null}
          <AppText variant="heading2">{title}</AppText>
          {description ? <AppText variant="bodySmall">{description}</AppText> : null}
        </View>
        {actionLabel && onAction ? (
          <Pressable onPress={onAction} hitSlop={10}>
            <AppText variant="bodyStrong" color={theme.colors.primary}>
              {actionLabel}
            </AppText>
          </Pressable>
        ) : null}
        {rightSlot ? <View>{rightSlot}</View> : null}
      </View>
    </View>
  );
}
