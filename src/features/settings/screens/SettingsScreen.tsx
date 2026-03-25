import { useTranslation } from 'react-i18next';
import { StyleSheet, View, Pressable } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { AppText } from '@/components/common/AppText';
import { SectionHeader } from '@/components/common/SectionHeader';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { SettingItem } from '@/components/settings/SettingItem';
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
    <MeditationScreen
      title={t('settings.title')}
      subtitle={t('settings.subtitle')}
      showBackButton
      decorativeBackground={false}
    >
      <SectionHeader title={t('settings.appearance')} description="Compact controls fit this screen better than large media cards." />
      <AppCard elevated style={{ gap: theme.spacing.lg }}>
        <View style={styles.group}>
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

        <View style={styles.group}>
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

        <SettingItem
          icon="sparkles"
          title={t('common.reduceMotion')}
          description="Reduce motion in transitions and decorative animations."
          trailingText={reduceMotionEnabled ? 'On' : 'Off'}
          onPress={() => setReduceMotionEnabled(!reduceMotionEnabled)}
        />
      </AppCard>

      <SectionHeader title={t('settings.accountSection')} description="Placeholder routes stay available, but the layout is now more practical." />
      <AppCard elevated style={{ gap: 2 }}>
        <SettingItem icon="premium" title={t('settings.premium')} description={t('common.placeholderDescription')} onPress={() => navigation.navigate('Premium')} />
        <SettingItem icon="account" title={t('settings.login')} description={t('common.placeholderDescription')} onPress={() => navigation.navigate('Login')} />
        <SettingItem icon="sync" title={t('settings.sync')} description={t('common.placeholderDescription')} onPress={() => navigation.navigate('Sync')} />
        <SettingItem icon="profile" title={t('settings.account')} description={t('common.placeholderDescription')} onPress={() => navigation.navigate('Account')} />
      </AppCard>
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  group: {
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
  }
});
