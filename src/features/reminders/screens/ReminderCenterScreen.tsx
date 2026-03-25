import { useTranslation } from 'react-i18next';

import { FeatureCard } from '@/components/meditation/FeatureCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';

export function ReminderCenterScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen eyebrow="S17" title={t('reminders.title')} subtitle={t('reminders.subtitle')}>
      <FeatureCard icon="reminder" title="Daily morning reminder" description="07:00 • Local schedule placeholder for Phase 5." meta="Enabled" />
      <FeatureCard icon="calendar" title="Evening wind-down reminder" description="21:30 • Data model and scheduling abstraction next." meta="Planned" />
    </MeditationScreen>
  );
}
