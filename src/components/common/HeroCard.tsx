import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import type { AppIconName } from '@/theme';

import { AppButton } from './AppButton';
import { AppIcon } from './AppIcon';
import { AppText } from './AppText';
import { ContentBadge } from './ContentBadge';
import { ImageBackgroundCard } from './ImageBackgroundCard';

type HeroCardProps = {
  imageUri: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  size?: 'default' | 'compact';
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryLabel?: string;
  icon?: AppIconName;
};

export function HeroCard({
  imageUri,
  eyebrow,
  title,
  subtitle,
  size = 'default',
  primaryActionLabel,
  onPrimaryAction,
  secondaryLabel,
  icon = 'sparkles'
}: HeroCardProps): React.JSX.Element {
  const theme = useTheme();
  const isCompact = size === 'compact';

  return (
    <ImageBackgroundCard imageUri={imageUri} minHeight={isCompact ? 212 : 248} overlayOpacity={0.42}>
      <View style={styles.header}>
        <ContentBadge label={eyebrow} icon={icon} tone="light" />
      </View>
      <View style={styles.footer}>
        <View style={styles.copy}>
          <AppText variant={isCompact ? 'heading2' : 'heading1'} color={theme.colors.white}>
            {title}
          </AppText>
          <AppText variant={isCompact ? 'bodySmall' : 'body'} color="rgba(255,255,255,0.82)">
            {subtitle}
          </AppText>
        </View>
        <View style={styles.actions}>
          {secondaryLabel ? (
            <View
              style={[
                styles.metaPill,
                {
                  backgroundColor: 'rgba(255,255,255,0.16)',
                  borderColor: 'rgba(255,255,255,0.16)',
                  borderRadius: theme.radius.pill
                }
              ]}
            >
              <AppIcon name="timer" color={theme.colors.white} size={theme.iconSize.sm} />
              <AppText variant="caption" color={theme.colors.white}>
                {secondaryLabel}
              </AppText>
            </View>
          ) : null}
          {primaryActionLabel ? (
            <AppButton
              label={primaryActionLabel}
              iconLeft="play"
              onPress={onPrimaryAction}
              fullWidth={false}
              style={styles.primaryButton}
            />
          ) : null}
        </View>
      </View>
    </ImageBackgroundCard>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-start'
  },
  footer: {
    gap: 14
  },
  copy: {
    gap: 8
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  primaryButton: {
    minWidth: 158
  }
});
