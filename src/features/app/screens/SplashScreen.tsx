import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { HeroCard } from '@/components/common/HeroCard';
import { Screen } from '@/components/ui/Screen';
import { mediaLibrary } from '@/features/meditation/data/phase-one-content';
import { useTheme } from '@/hooks/useTheme';

type SplashScreenProps = {
  title: string;
  subtitle: string;
};

export function SplashScreen({ title, subtitle }: SplashScreenProps): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Screen centered contentStyle={styles.content}>
      <View style={styles.stack}>
        <AppText variant="label" color={theme.colors.primary}>
          {t('splash.label')}
        </AppText>
        <HeroCard
          imageUri={mediaLibrary.sunriseMeditation}
          eyebrow={t('splash.eyebrow')}
          title={title}
          subtitle={subtitle}
          secondaryLabel={t('splash.secondaryLabel')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center'
  },
  stack: {
    gap: 16,
    width: '100%'
  }
});
