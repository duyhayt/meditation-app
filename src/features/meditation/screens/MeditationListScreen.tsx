import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { FeatureCard } from '@/components/meditation/FeatureCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import {
  getCategoryById,
  getMeditationsByCategory
} from '@/features/meditation/data/phase-one-content';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MeditationList'>;

export function MeditationListScreen({ navigation, route }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const category = getCategoryById(route.params?.categoryId);
  const items = getMeditationsByCategory(route.params?.categoryId);

  return (
    <MeditationScreen
      eyebrow={category?.title ?? 'S05'}
      title={t('meditate.listTitle')}
      subtitle={category?.subtitle ?? t('meditate.listSubtitle')}
    >
      {items.map((item) => (
        <FeatureCard
          key={item.id}
          eyebrow={`${item.durationMinutes} min • ${item.level}`}
          title={item.title}
          description={item.description}
          meta={item.teacher}
          onPress={() => navigation.navigate('MeditationDetail', { meditationId: item.id })}
        />
      ))}
    </MeditationScreen>
  );
}
