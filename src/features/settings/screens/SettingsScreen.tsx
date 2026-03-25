import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { FeatureCard } from '@/components/meditation/FeatureCard';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { useTheme } from '@/hooks/useTheme';
import { usePreferencesStore, type ThemePreference } from '@/state/preferences.store';

const themeOptions: ThemePreference[] = ['system', 'light', 'dark'];

export function SettingsScreen({ navigation }: { navigation: { navigate: (name: 'Premium' | 'Login' | 'Sync' | 'Account') => void } }): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const language = usePreferencesStore((state) => state.language);
  const themePreference = usePreferencesStore((state) => state.themePreference);
  const reduceMotionEnabled = usePreferencesStore((state) => state.reduceMotionEnabled);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const setThemePreference = usePreferencesStore((state) => state.setThemePreference);
  const setReduceMotionEnabled = usePreferencesStore((state) => state.setReduceMotionEnabled);

  return (
    <MeditationScreen eyebrow="S18" title={t('settings.title')} subtitle={t('settings.subtitle')}>
      <View style={styles.section}>
        <AppText variant="title">{t('common.language')}</AppText>
        <View style={styles.row}>
          {(['vi', 'en'] as const).map((item) => (
            <Pressable
              key={item}
              onPress={() => setLanguage(item)}
              style={[
                styles.chip,
                {
                  backgroundColor: language === item ? theme.colors.chipActive : theme.colors.chip,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.pill
                }
              ]}
            >
              <AppText variant="bodyStrong">{item.toUpperCase()}</AppText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="title">{t('common.theme')}</AppText>
        <View style={styles.row}>
          {themeOptions.map((item) => (
            <Pressable
              key={item}
              onPress={() => setThemePreference(item)}
              style={[
                styles.chip,
                {
                  backgroundColor: themePreference === item ? theme.colors.chipActive : theme.colors.chip,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.pill
                }
              ]}
            >
              <AppText variant="bodyStrong">{t(`common.theme${item.charAt(0).toUpperCase()}${item.slice(1)}`)}</AppText>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable
        onPress={() => setReduceMotionEnabled(!reduceMotionEnabled)}
        style={[
          styles.toggle,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.xl
          }
        ]}
      >
        <AppText variant="title">{t('common.reduceMotion')}</AppText>
        <AppText variant="bodySmall">{reduceMotionEnabled ? 'On' : 'Off'}</AppText>
      </Pressable>

      <FeatureCard icon="premium" title={t('settings.premium')} description={t('common.placeholderDescription')} onPress={() => navigation.navigate('Premium')} />
      <FeatureCard icon="account" title={t('settings.login')} description={t('common.placeholderDescription')} onPress={() => navigation.navigate('Login')} />
      <FeatureCard icon="sync" title={t('settings.sync')} description={t('common.placeholderDescription')} onPress={() => navigation.navigate('Sync')} />
      <FeatureCard icon="profile" title={t('settings.account')} description={t('common.placeholderDescription')} onPress={() => navigation.navigate('Account')} />
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  toggle: {
    borderWidth: 1,
    padding: 16,
    gap: 4
  }
});
