import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { AppText } from '@/components/common/AppText';
import { SectionHeader } from '@/components/common/SectionHeader';
import { SettingDropdown } from '@/components/settings/SettingDropdown';
import { SettingItem } from '@/components/settings/SettingItem';
import { Screen } from '@/components/ui/Screen';
import { useAppSettingsQuery } from '@/features/settings/hooks/useSettingsData';
import { useLanguageService } from '@/providers/ServicesProvider';
import { type ThemePreference, usePreferencesStore } from '@/state/preferences.store';
import type { RootStackParamList } from '@/types/navigation';

const currencyOptions = ['VND', 'USD', 'EUR'] as const;

export function SettingsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [expandedSection, setExpandedSection] = useState<'localization' | 'appearance' | 'local' | null>(null);
  const language = usePreferencesStore((state) => state.language);
  const themePreference = usePreferencesStore((state) => state.themePreference);
  const currencyCode = usePreferencesStore((state) => state.currencyCode);
  const hasCompletedOnboarding = usePreferencesStore((state) => state.hasCompletedOnboarding);
  const setThemePreference = usePreferencesStore((state) => state.setThemePreference);
  const setCurrencyCode = usePreferencesStore((state) => state.setCurrencyCode);
  const resetOnboarding = usePreferencesStore((state) => state.resetOnboarding);
  const completeOnboarding = usePreferencesStore((state) => state.completeOnboarding);
  const languageService = useLanguageService();
  const appSettingsQuery = useAppSettingsQuery();

  const themeOptions: Array<{ key: ThemePreference; label: string }> = [
    { key: 'system', label: t('common.themeSystem') },
    { key: 'light', label: t('common.themeLight') },
    { key: 'dark', label: t('common.themeDark') }
  ];

  const currentThemeLabel = themeOptions.find((option) => option.key === themePreference)?.label ?? t('common.themeSystem');
  const currentLanguageLabel = language === 'vi' ? t('settings.languageVi') : t('settings.languageEn');

  function toggleSection(section: 'localization' | 'appearance' | 'local') {
    setExpandedSection((current) => (current === section ? null : section));
  }

  return (
    <Screen scrollable>
      <SectionHeader eyebrow={t('settings.title')} title={t('settings.title')} description={t('settings.subtitle')} showBackButton={false} />

      <AppCard>
        <View>
          <SettingDropdown
            icon="notification"
            title={t('settings.sectionLocalization')}
            description={t('common.language')}
            currentValue={currentLanguageLabel}
            expanded={expandedSection === 'localization'}
            onToggle={() => toggleSection('localization')}
          >
            <SettingItem
              icon="notification"
              title={t('settings.languageVi')}
              trailingText={language === 'vi' ? t('settings.using') : ''}
              onPress={() => {
                void languageService.setLanguage('vi');
                setExpandedSection(null);
              }}
            />
            <SettingItem
              icon="notification"
              title={t('settings.languageEn')}
              trailingText={language === 'en' ? t('settings.using') : ''}
              onPress={() => {
                void languageService.setLanguage('en');
                setExpandedSection(null);
              }}
            />
          </SettingDropdown>
        </View>
      </AppCard>

      <AppCard style={{ marginTop: 16 }}>
        <View>
          <SettingDropdown
            icon="settings"
            title={t('settings.sectionAppearance')}
            description={t('common.theme')}
            currentValue={currentThemeLabel}
            expanded={expandedSection === 'appearance'}
            onToggle={() => toggleSection('appearance')}
          >
            {themeOptions.map((option) => (
              <SettingItem
                key={option.key}
                icon="settings"
                title={option.label}
                trailingText={themePreference === option.key ? t('settings.using') : ''}
                onPress={() => {
                  setThemePreference(option.key);
                  setExpandedSection(null);
                }}
              />
            ))}
          </SettingDropdown>
        </View>
      </AppCard>

      <AppCard style={{ marginTop: 16 }}>
        <View>
          <SettingDropdown
            icon="payment"
            title={t('settings.localOptions')}
            description={t('common.currency')}
            currentValue={currencyCode}
            expanded={expandedSection === 'local'}
            onToggle={() => toggleSection('local')}
          >
            {currencyOptions.map((option) => (
              <SettingItem
                key={option}
                icon="payment"
                title={option}
                trailingText={currencyCode === option ? t('settings.using') : ''}
                onPress={() => {
                  setCurrencyCode(option);
                  setExpandedSection(null);
                }}
              />
            ))}
            <SettingItem
              icon="home"
              title={hasCompletedOnboarding ? t('settings.replayOnboarding') : t('settings.finishOnboarding')}
              description={t('onboarding.title')}
              onPress={() => {
                if (hasCompletedOnboarding) {
                  resetOnboarding();
                } else {
                  completeOnboarding();
                }
                setExpandedSection(null);
              }}
            />
          </SettingDropdown>
        </View>
      </AppCard>

      <AppCard style={{ marginTop: 16 }}>
        <View>
          <AppText variant="title">{t('settings.sectionData')}</AppText>
          <AppText variant="bodySmall">{t('settings.persistedSettings', { count: appSettingsQuery.data?.length ?? 0 })}</AppText>
          <SettingItem
            icon="backup"
            title={t('settings.backupRestore')}
            description={t('backup.subtitle')}
            onPress={() => navigation.navigate('BackupRestore')}
          />
          <SettingItem
            icon="premium"
            title={t('settings.premium')}
            description={t('placeholders.premium')}
            onPress={() => navigation.navigate('Premium')}
          />
          <SettingItem
            icon="account"
            title={t('settings.login')}
            description={t('placeholders.login')}
            onPress={() => navigation.navigate('Login')}
          />
          <SettingItem
            icon="sync"
            title={t('settings.sync')}
            description={t('placeholders.sync')}
            onPress={() => navigation.navigate('Sync')}
          />
          <SettingItem
            icon="account"
            title={t('settings.account')}
            description={t('placeholders.account')}
            onPress={() => navigation.navigate('Account')}
          />
        </View>
      </AppCard>
    </Screen>
  );
}
