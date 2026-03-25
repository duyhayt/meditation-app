import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { MeditationCard } from '@/components/meditation/MeditationCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import {
  useCategoriesQuery,
  useMeditationsQuery
} from '@/features/content/hooks/use-content-queries';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MeditationList'>;

export function MeditationListScreen({ navigation, route }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const categoriesQuery = useCategoriesQuery();
  const meditationsQuery = useMeditationsQuery(route.params?.categoryId);
  const category = (categoriesQuery.data ?? []).find((item) => item.id === route.params?.categoryId);
  const items = meditationsQuery.data ?? [];

  return (
    <MeditationScreen
      title={t('meditate.listTitle')}
      subtitle={category?.subtitle ?? t('meditate.listSubtitle')}
      heroImageUri={category?.coverImageUri}
      heroTitle={category?.title ?? t('meditate.listTitle')}
      heroSubtitle={category?.subtitle ?? t('meditate.listSubtitle')}
      heroEyebrow={category?.ambientLabel ?? t('common.guided')}
      showBackButton
    >
      {meditationsQuery.isLoading ? <LoadingState label={t('common.loadingSessions')} /> : null}
      {meditationsQuery.isError ? (
        <EmptyState
          title={t('meditate.listTitle')}
          description={t('common.contentLoadError')}
          actionLabel={t('common.retry')}
          onAction={() => void meditationsQuery.refetch()}
        />
      ) : null}
      {!meditationsQuery.isLoading && !meditationsQuery.isError ? (
        <>
          <SectionHeader title={t('meditate.featuredSessionsTitle')} description={t('meditate.featuredSessionsDescription')} />
          {items.map((item) => (
            <MeditationCard
              key={item.id}
              title={item.title}
              subtitle={item.description}
              durationLabel={t('common.minutesShort', { count: item.durationMinutes })}
              metaLabel={`${item.teacher} • ${item.level}`}
              imageUri={item.coverImageUri}
              tone={item.tone === 'sleep' ? 'course' : 'meditation'}
              onPress={() => navigation.navigate('MeditationDetail', { meditationId: item.id })}
            />
          ))}
        </>
      ) : null}
    </MeditationScreen>
  );
}
