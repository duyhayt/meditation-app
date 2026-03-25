import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/common/EmptyState';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { mediaLibrary } from '@/features/meditation/data/phase-one-content';

type PlaceholderScreenProps = {
  code: string;
  titleKey: string;
  description: string;
};

export function PlaceholderScreen({ code, titleKey, description }: PlaceholderScreenProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen
      title={t(titleKey)}
      subtitle={description}
      heroImageUri={mediaLibrary.clouds}
      heroTitle={t(titleKey)}
      heroSubtitle={description}
      heroEyebrow={code}
      showBackButton
    >
      <EmptyState title={t('common.placeholderTitle')} description={description} />
    </MeditationScreen>
  );
}
