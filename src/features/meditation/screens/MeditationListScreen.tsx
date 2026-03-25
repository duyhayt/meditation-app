import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { SectionHeader } from '@/components/common/SectionHeader';
import { MeditationCard } from '@/components/meditation/MeditationCard';
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
      title={t('meditate.listTitle')}
      subtitle={category?.subtitle ?? t('meditate.listSubtitle')}
      heroImageUri={category?.coverImageUri}
      heroTitle={category?.title ?? t('meditate.listTitle')}
      heroSubtitle={category?.subtitle ?? t('meditate.listSubtitle')}
      heroEyebrow={category?.ambientLabel ?? 'Guided'}
      showBackButton
    >
      <SectionHeader title="Featured sessions" description="Designed to feel easy to browse, save, and start." />
      {items.map((item) => (
        <MeditationCard
          key={item.id}
          title={item.title}
          subtitle={item.description}
          durationLabel={`${item.durationMinutes} min`}
          metaLabel={`${item.teacher} • ${item.level}`}
          imageUri={item.coverImageUri}
          tone={item.tone === 'sleep' ? 'course' : 'meditation'}
          onPress={() => navigation.navigate('MeditationDetail', { meditationId: item.id })}
        />
      ))}
    </MeditationScreen>
  );
}
