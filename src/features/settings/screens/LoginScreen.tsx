import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/common/EmptyState';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { mediaLibrary } from '@/features/meditation/data/phase-one-content';

export function LoginScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen
      title={t('placeholders.loginTitle')}
      subtitle={t('common.placeholderDescription')}
      heroImageUri={mediaLibrary.silhouette}
      heroTitle="Login can still look intentional"
      heroSubtitle="Even placeholder screens should feel consistent with the product’s premium mood."
      heroEyebrow="Login"
      showBackButton
    >
      <EmptyState title={t('common.placeholderTitle')} description={t('common.placeholderDescription')} />
    </MeditationScreen>
  );
}
