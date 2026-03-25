import { useTranslation } from 'react-i18next';

import { FeatureCard } from '@/components/meditation/FeatureCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';

export function SyncScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen eyebrow="S21" title={t('placeholders.syncTitle')} subtitle={t('common.placeholderDescription')}>
      <FeatureCard icon="sync" title={t('common.placeholderTitle')} description={t('common.placeholderDescription')} />
    </MeditationScreen>
  );
}
