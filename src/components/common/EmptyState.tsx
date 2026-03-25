import { View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { AppButton } from './AppButton';
import { AppIcon } from './AppIcon';
import { AppText } from './AppText';
import { ImageBackgroundCard } from './ImageBackgroundCard';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

const EMPTY_IMAGE =
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80';

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <ImageBackgroundCard imageUri={EMPTY_IMAGE} minHeight={240} overlayOpacity={0.5}>
      <View />
      <View style={{ gap: theme.spacing.md }}>
        <View style={{ gap: theme.spacing.sm }}>
          <AppIcon name="sparkles" color={theme.colors.white} size={theme.iconSize.xl} />
          <AppText variant="heading2" color={theme.colors.white}>
            {title}
          </AppText>
          <AppText variant="bodySmall" color="rgba(255,255,255,0.78)">
            {description}
          </AppText>
        </View>
        {actionLabel && onAction ? (
          <AppButton label={actionLabel} onPress={onAction} fullWidth={false} />
        ) : null}
      </View>
    </ImageBackgroundCard>
  );
}
