import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { MeditationCard } from '@/components/meditation/MeditationCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { useFavoriteContentQuery } from '@/features/content/hooks/use-content-queries';
import type { RootStackParamList } from '@/types/navigation';

export function FavoritesScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const favoritesQuery = useFavoriteContentQuery();
  const favorites = favoritesQuery.data ?? [];

  return (
    <MeditationScreen
      title={t('favorites.title')}
      subtitle={t('favorites.subtitle')}
      showBackButton
      decorativeBackground={false}
    >
      {favoritesQuery.isLoading ? <LoadingState label={t('common.loadingFavorites')} /> : null}
      {favoritesQuery.isError ? (
        <EmptyState
          title={t('favorites.title')}
          description={t('common.contentLoadError')}
          actionLabel={t('common.retry')}
          onAction={() => void favoritesQuery.refetch()}
        />
      ) : null}
      {!favoritesQuery.isLoading && !favoritesQuery.isError && favorites.length === 0 ? (
        <EmptyState
          title={t('favorites.title')}
          description={t('favorites.emptyDescription')}
        />
      ) : null}
      {!favoritesQuery.isLoading && !favoritesQuery.isError && favorites.length > 0
        ? favorites.map((item) => (
            <MeditationCard
              key={`${item.contentType}:${item.contentId}`}
              title={item.title}
              subtitle={
                item.contentType === 'course_lesson'
                  ? t('audio.contentTypeCourseLesson')
                  : item.contentType === 'sleep_sound'
                    ? t('audio.contentTypeSleepSound')
                    : t('audio.contentTypeMeditation')
              }
              durationLabel={
                item.durationSeconds
                  ? t('common.minutesShort', { count: Math.max(1, Math.round(item.durationSeconds / 60)) })
                  : t('audio.loopLabel')
              }
              metaLabel={item.isAvailableOffline ? t('common.downloaded') : t('common.streaming')}
              imageUri={item.artworkUri}
              tone={item.contentType === 'course_lesson' ? 'course' : 'meditation'}
              onPress={() => {
                if (item.contentType === 'course_lesson') {
                  navigation.navigate('AudioPlayer', {
                    contentId: item.contentId,
                    contentType: item.contentType
                  });
                  return;
                }

                if (item.contentType === 'sleep_sound') {
                  navigation.navigate('AudioPlayer', {
                    contentId: item.contentId,
                    contentType: item.contentType
                  });
                  return;
                }

                navigation.navigate('MeditationDetail', { meditationId: item.contentId });
              }}
            />
          ))
        : null}
    </MeditationScreen>
  );
}
