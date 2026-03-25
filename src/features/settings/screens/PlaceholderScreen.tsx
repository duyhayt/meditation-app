import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Screen } from '@/components/ui/Screen';
import { useTheme } from '@/hooks/useTheme';

type PlaceholderScreenProps = {
  code: string;
  titleKey: string;
  description: string;
};

export function PlaceholderScreen({ code, titleKey, description }: PlaceholderScreenProps): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Screen>
      <SectionHeader eyebrow={code} title={t(titleKey)} description={description} />
      <AppCard elevated>
        <View style={{ gap: theme.spacing.md, alignItems: 'center' }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: theme.radius.xl,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.surfaceSecondary
            }}
          >
            <AppIcon name="premium" color={theme.colors.primary} size={theme.iconSize.xl} />
          </View>
          <View style={{ gap: theme.spacing.xs, alignItems: 'center' }}>
            <AppText variant="title">{t('common.comingSoon')}</AppText>
            <AppText variant="bodySmall" style={{ textAlign: 'center' }}>
              {description}
            </AppText>
          </View>
        </View>
      </AppCard>
    </Screen>
  );
}
