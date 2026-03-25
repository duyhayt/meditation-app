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
      heroTitle={t('placeholders.syncHeroTitle')}
      heroSubtitle={t('placeholders.syncHeroSubtitle')}
      heroEyebrow={t('placeholders.syncHeroEyebrow')}
      showBackButton
    >
      <EmptyState title={t('common.placeholderTitle')} description={t('common.placeholderDescription')} />
    </MeditationScreen>
  );
}
