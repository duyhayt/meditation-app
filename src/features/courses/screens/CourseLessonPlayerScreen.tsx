import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { ContentBadge } from '@/components/common/ContentBadge';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { courseLessons } from '@/features/meditation/data/phase-one-content';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseLessonPlayer'>;

export function CourseLessonPlayerScreen({ navigation, route }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const lesson = courseLessons.find((item) => item.id === route.params.lessonId);

  return (
    <MeditationScreen
      title={t('courses.lessonTitle')}
      subtitle={t('courses.lessonSubtitle')}
      heroImageUri={lesson?.coverImageUri}
      heroTitle={lesson?.title ?? t('courses.lessonTitle')}
      heroSubtitle={t('courses.lessonPlayerHeroSubtitle')}
      heroEyebrow={t('courses.lessonPlayerHeroEyebrow')}
      showBackButton
    >
      <View style={styles.stack}>
        <ContentBadge label={t('common.minutesShort', { count: lesson?.durationMinutes ?? 0 })} icon="timer" />
        <AppButton
          label={t('courses.openSharedPlayer')}
          iconLeft="play"
          onPress={() =>
            navigation.navigate('AudioPlayer', {
              contentId: route.params.lessonId,
              contentType: 'course_lesson'
            })
          }
        />
      </View>
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 12
  }
});
