import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/common/EmptyState';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';

export function FavoritesScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen
      title={t('favorites.title')}
      subtitle={t('favorites.subtitle')}
      showBackButton
      decorativeBackground={false}
    >
      <EmptyState
        title={t('favorites.title')}
        description={t('favorites.emptyDescription')}
      />
    </MeditationScreen>
  );
}
