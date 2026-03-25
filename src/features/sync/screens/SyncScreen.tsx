import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/common/EmptyState';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { mediaLibrary } from '@/features/meditation/data/phase-one-content';

export function SyncScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen
      title={t('placeholders.syncTitle')}
      subtitle={t('common.placeholderDescription')}
      heroImageUri={mediaLibrary.clouds}
      heroTitle="Sync placeholder, polished"
      heroSubtitle="Future-facing routes are now visually aligned with the rest of the experience."
      heroEyebrow="Sync"
      showBackButton
    >
      <EmptyState title={t('common.placeholderTitle')} description={t('common.placeholderDescription')} />
    </MeditationScreen>
  );
}
