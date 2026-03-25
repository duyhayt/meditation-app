import { ActivityIndicator, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { Screen } from '@/components/ui/Screen';
import { useTheme } from '@/hooks/useTheme';

type SplashScreenProps = {
  title: string;
  subtitle: string;
};

export function SplashScreen({ title, subtitle }: SplashScreenProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Screen centered>
      <View style={{ alignItems: 'center', gap: theme.spacing.lg }}>
        <View
          style={{
            width: 84,
            height: 84,
            borderRadius: theme.radius.xxl,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.receivableSoft
          }}
        >
          <AppIcon name="debts" size={theme.iconSize.xl} color={theme.colors.receivable} />
        </View>
        <AppText variant="display" style={{ textAlign: 'center' }}>
          {title}
        </AppText>
        <AppText variant="bodySmall" style={{ textAlign: 'center', maxWidth: 280 }}>
          {subtitle}
        </AppText>
        <ActivityIndicator color={theme.colors.primary} style={{ marginTop: theme.spacing.sm }} />
      </View>
    </Screen>
  );
}
