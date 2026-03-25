import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { AppIcon } from '../common/AppIcon';
import { AppText } from '../common/AppText';

type FeatureCardProps = {
  eyebrow?: string;
  title: string;
  description: string;
  meta?: string;
  icon?: Parameters<typeof AppIcon>[0]['name'];
  onPress?: () => void;
};

export function FeatureCard({
  eyebrow,
  title,
  description,
  meta,
  icon = 'category',
  onPress
}: FeatureCardProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.xl,
          padding: theme.spacing.lg
        }
      ]}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: theme.colors.chip,
              borderRadius: theme.radius.lg
            }
          ]}
        >
          <AppIcon name={icon} color={theme.colors.primary} />
        </View>
        <View style={styles.content}>
          {eyebrow ? (
            <AppText variant="label" color={theme.colors.textMuted}>
              {eyebrow}
            </AppText>
          ) : null}
          <AppText variant="title">{title}</AppText>
          <AppText variant="bodySmall">{description}</AppText>
          {meta ? (
            <AppText variant="caption" color={theme.colors.primary}>
              {meta}
            </AppText>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1
  },
  row: {
    flexDirection: 'row',
    gap: 14
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    flex: 1,
    gap: 4
  }
});
