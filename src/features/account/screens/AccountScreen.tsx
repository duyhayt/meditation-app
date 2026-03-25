import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/common/EmptyState';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { mediaLibrary } from '@/features/meditation/data/phase-one-content';

export function AccountScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen
      title={t('placeholders.accountTitle')}
      subtitle={t('common.placeholderDescription')}
      heroImageUri={mediaLibrary.mountainLake}
      heroTitle={t('placeholders.accountHeroTitle')}
      heroSubtitle={t('placeholders.accountHeroSubtitle')}
      heroEyebrow={t('placeholders.accountHeroEyebrow')}
      showBackButton
    >
      <EmptyState title={t('common.placeholderTitle')} description={t('common.placeholderDescription')} />
    </MeditationScreen>
  );
}
