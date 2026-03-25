import { useTranslation } from 'react-i18next';

import { FeatureCard } from '@/components/meditation/FeatureCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';

export function AccountScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen eyebrow="S22" title={t('placeholders.accountTitle')} subtitle={t('common.placeholderDescription')}>
      <FeatureCard icon="profile" title={t('common.placeholderTitle')} description={t('common.placeholderDescription')} />
    </MeditationScreen>
  );
}
