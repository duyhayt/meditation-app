import { useTranslation } from 'react-i18next';

import { AppCard } from '@/components/common/AppCard';
import { AppText } from '@/components/common/AppText';
import { ContentBadge } from '@/components/common/ContentBadge';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';

export function HistoryScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen
      title={t('history.title')}
      subtitle={t('history.subtitle')}
      showBackButton
      decorativeBackground={false}
    >
      <AppCard elevated style={{ gap: 14 }}>
        <ContentBadge label="Completed" icon="success" />
        <AppText variant="title">Sleepy Body Scan</AppText>
        <AppText variant="bodySmall">Last played tonight at 21:40</AppText>
      </AppCard>
      <AppCard elevated style={{ gap: 14 }}>
        <ContentBadge label="Breathing" icon="breath" />
        <AppText variant="title">Box Breathing</AppText>
        <AppText variant="bodySmall">Practiced this morning before work</AppText>
      </AppCard>
    </MeditationScreen>
  );
}
