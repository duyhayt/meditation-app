import { ActivityIndicator, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { AppText } from './AppText';
import { ImageBackgroundCard } from './ImageBackgroundCard';

const LOADING_IMAGE =
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80';

type LoadingStateProps = {
  label?: string;
  variant?: 'spinner' | 'dashboard' | 'list' | 'detail' | 'form';
};

export function LoadingState({ label }: LoadingStateProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <ImageBackgroundCard imageUri={LOADING_IMAGE} minHeight={220} overlayOpacity={0.55}>
      <View />
      <View style={{ alignItems: 'center', gap: theme.spacing.md }}>
        <ActivityIndicator color={theme.colors.white} size="large" />
        {label ? (
          <AppText variant="bodySmall" color="rgba(255,255,255,0.82)">
            {label}
          </AppText>
        ) : null}
      </View>
    </ImageBackgroundCard>
  );
}
