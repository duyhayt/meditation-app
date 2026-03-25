import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { Button } from '@/components/ui/Button';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseLessonPlayer'>;

export function CourseLessonPlayerScreen({ navigation, route }: Props): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <MeditationScreen eyebrow="S13" title={t('courses.lessonTitle')} subtitle={t('courses.lessonSubtitle')}>
      <View style={styles.stack}>
        <AppText variant="title">{route.params.lessonId}</AppText>
        <Button
          label="Open shared player"
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
