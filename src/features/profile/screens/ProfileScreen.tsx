import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { FeatureCard } from '@/components/meditation/FeatureCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import type { RootStackParamList } from '@/types/navigation';

export function ProfileScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <MeditationScreen eyebrow="Profile" title={t('settings.title')} subtitle={t('settings.subtitle')}>
      <FeatureCard icon="favorites" title={t('favorites.title')} description={t('favorites.subtitle')} onPress={() => navigation.navigate('Favorites')} />
      <FeatureCard icon="progress" title={t('progress.title')} description={t('progress.subtitle')} onPress={() => navigation.navigate('Progress')} />
      <FeatureCard icon="history" title={t('history.title')} description={t('history.subtitle')} onPress={() => navigation.navigate('History')} />
      <FeatureCard icon="reminder" title={t('reminders.title')} description={t('reminders.subtitle')} onPress={() => navigation.navigate('ReminderCenter')} />
      <FeatureCard icon="settings" title={t('settings.title')} description={t('settings.subtitle')} onPress={() => navigation.navigate('Settings')} />
    </MeditationScreen>
  );
}
