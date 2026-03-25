import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { FeatureCard } from '@/components/meditation/FeatureCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { meditationCategories } from '@/features/meditation/data/phase-one-content';
import type { RootStackParamList } from '@/types/navigation';

export function CategoryListScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <MeditationScreen
      eyebrow="S04"
      title={t('meditate.categoryTitle')}
      subtitle={t('meditate.categorySubtitle')}
    >
      {meditationCategories.map((category) => (
        <FeatureCard
          key={category.id}
          eyebrow={category.durationLabel}
          title={category.title}
          description={category.subtitle}
          meta="Guided meditations"
          onPress={() => navigation.navigate('MeditationList', { categoryId: category.id })}
        />
      ))}
      <FeatureCard
        icon="breath"
        title="Breathing exercises"
        description="Box breathing, calming rhythms, and short resets."
        meta="Open flow"
        onPress={() => navigation.navigate('BreathingList')}
      />
      <FeatureCard
        icon="course"
        title="Meditation courses"
        description="Structured lessons for building a steady habit."
        meta="Open courses"
        onPress={() => navigation.navigate('CourseList')}
      />
    </MeditationScreen>
  );
}
