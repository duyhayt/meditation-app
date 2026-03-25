import {
  Text as RNText,
  StyleSheet,
  type TextProps as RNTextProps,
  type TextStyle
} from 'react-native';

import { useTheme } from '@/hooks/useTheme';

type AppTextVariant =
  | 'display'
  | 'heading1'
  | 'heading2'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodyStrong'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'button'
  | 'moneyLarge'
  | 'moneyMedium';

type AppTextProps = RNTextProps & {
  variant?: AppTextVariant;
  color?: string;
};

export function AppText({
  variant = 'body',
  color,
  style,
  ...props
}: AppTextProps): React.JSX.Element {
  const theme = useTheme();

  const variants: Record<AppTextVariant, TextStyle> = {
    display: {
      ...theme.typography.display,
      color: theme.colors.textPrimary
    },
    heading1: {
      ...theme.typography.heading1,
      color: theme.colors.textPrimary
    },
    heading2: {
      ...theme.typography.heading2,
      color: theme.colors.textPrimary
    },
    title: {
      ...theme.typography.title,
      color: theme.colors.textPrimary
    },
    subtitle: {
      ...theme.typography.subtitle,
      color: theme.colors.textSecondary
    },
    body: {
      ...theme.typography.body,
      color: theme.colors.textPrimary
    },
    bodyStrong: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      fontWeight: theme.typography.weight.semibold
    },
    bodySmall: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary
    },
    caption: {
      ...theme.typography.caption,
      color: theme.colors.textMuted
    },
    label: {
      ...theme.typography.label,
      color: theme.colors.textMuted
    },
    button: {
      ...theme.typography.button,
      color: theme.colors.textOnPrimary
    },
    moneyLarge: {
      ...theme.typography.moneyLarge,
      color: theme.colors.textPrimary
    },
    moneyMedium: {
      ...theme.typography.moneyMedium,
      color: theme.colors.textPrimary
    }
  };

  return <RNText style={[styles.base, variants[variant], color ? { color } : null, style]} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false
  }
});
