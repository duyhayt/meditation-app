import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { AppText } from '@/components/common/AppText';
import { SectionHeader } from '@/components/common/SectionHeader';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { ProfileShortcutCard } from '@/components/profile/ProfileShortcutCard';
import { useTheme } from '@/hooks/useTheme';
import type { RootStackParamList } from '@/types/navigation';

export function ProfileScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <MeditationScreen
      title="Profile"
      subtitle="A quieter place for your progress, saved sessions, and preferences."
      decorativeBackground={false}
    >
      <AppCard elevated style={{ padding: theme.spacing.xxl }}>
        <View style={styles.summary}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: theme.colors.chipActive,
                borderRadius: theme.radius.xxl
              }
            ]}
          >
            <AppText variant="heading2" color={theme.colors.primary}>
              T
            </AppText>
          </View>
          <View style={styles.copy}>
            <AppText variant="heading2">Tonight feels lighter</AppText>
            <AppText variant="bodySmall">
              Your personal space for favorites, progress, reminders, and settings.
            </AppText>
          </View>
        </View>
      </AppCard>

      <SectionHeader title="Library & progress" description="Core areas you visit often should feel fast and clear." />
      <ProfileShortcutCard
        icon="favorites"
        title={t('favorites.title')}
        description={t('favorites.subtitle')}
        meta="Saved"
        onPress={() => navigation.navigate('Favorites')}
      />
      <ProfileShortcutCard
        icon="progress"
        title={t('progress.title')}
        description={t('progress.subtitle')}
        meta="Insights"
        onPress={() => navigation.navigate('Progress')}
      />
      <ProfileShortcutCard
        icon="history"
        title={t('history.title')}
        description={t('history.subtitle')}
        meta="Recent"
        onPress={() => navigation.navigate('History')}
      />

      <SectionHeader title="Preferences" description="Utilities stay more compact and less decorative here." />
      <ProfileShortcutCard
        icon="reminder"
        title={t('reminders.title')}
        description={t('reminders.subtitle')}
        meta="Daily"
        onPress={() => navigation.navigate('ReminderCenter')}
      />
      <ProfileShortcutCard
        icon="settings"
        title={t('settings.title')}
        description={t('settings.subtitle')}
        meta="Local"
        onPress={() => navigation.navigate('Settings')}
      />
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  avatar: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center'
  },
  copy: {
    flex: 1,
    gap: 6
  }
});
