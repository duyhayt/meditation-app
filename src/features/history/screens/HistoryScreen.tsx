import { useTranslation } from 'react-i18next';

import { FeatureCard } from '@/components/meditation/FeatureCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';

export function HistoryScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen eyebrow="S16" title={t('history.title')} subtitle={t('history.subtitle')}>
      <FeatureCard icon="history" title="Recent sessions" description="Session history table and restore logic come in later phases." />
    </MeditationScreen>
  );
}
