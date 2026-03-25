import { useTranslation } from 'react-i18next';

import { FeatureCard } from '@/components/meditation/FeatureCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';

export function FavoritesScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen eyebrow="S14" title={t('favorites.title')} subtitle={t('favorites.subtitle')}>
      <FeatureCard icon="favorites" title="Favorite sessions" description="Repository and persistence will be connected in Phase 3." />
    </MeditationScreen>
  );
}
