import { useTranslation } from 'react-i18next';

import { FeatureCard } from '@/components/meditation/FeatureCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';

export function ProgressScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen eyebrow="S15" title={t('progress.title')} subtitle={t('progress.subtitle')}>
      <FeatureCard icon="progress" title="Daily streak" description="1 day minimum after Phase 6 data flow lands." meta="5 min threshold planned" />
      <FeatureCard icon="timer" title="Mindful minutes" description="Daily progress and completion rules are scaffolded for next phases." />
    </MeditationScreen>
  );
}
