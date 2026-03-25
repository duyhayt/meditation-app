import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/common/EmptyState';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { mediaLibrary } from '@/features/meditation/data/phase-one-content';

export function PremiumScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen
      title={t('placeholders.premiumTitle')}
      subtitle={t('common.placeholderDescription')}
      heroImageUri={mediaLibrary.moonSky}
      heroTitle={t('placeholders.premiumHeroTitle')}
      heroSubtitle={t('placeholders.premiumHeroSubtitle')}
      heroEyebrow={t('placeholders.premiumHeroEyebrow')}
      showBackButton
    >
      <EmptyState title={t('common.placeholderTitle')} description={t('common.placeholderDescription')} />
    </MeditationScreen>
  );
}
