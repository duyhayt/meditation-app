import { useTranslation } from 'react-i18next';

import { FeatureCard } from '@/components/meditation/FeatureCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';

export function PremiumScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen eyebrow="S19" title={t('placeholders.premiumTitle')} subtitle={t('common.placeholderDescription')}>
      <FeatureCard icon="premium" title={t('common.placeholderTitle')} description={t('common.placeholderDescription')} />
    </MeditationScreen>
  );
}
