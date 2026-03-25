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
        <ContentBadge label={t('history.completed')} icon="success" />
        <AppText variant="title">{t('history.firstTitle')}</AppText>
        <AppText variant="bodySmall">{t('history.firstSubtitle')}</AppText>
      </AppCard>
      <AppCard elevated style={{ gap: 14 }}>
        <ContentBadge label={t('history.breathingBadge')} icon="breath" />
        <AppText variant="title">{t('history.secondTitle')}</AppText>
        <AppText variant="bodySmall">{t('history.secondSubtitle')}</AppText>
      </AppCard>
    </MeditationScreen>
  );
}
