import { File } from 'expo-file-system';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Screen } from '@/components/ui/Screen';
import { useContactsQuery } from '@/features/contacts/hooks/useContacts';
import { useDebtsQuery } from '@/features/debts/hooks/useDebts';
import { useAppSettingsQuery, useExportBackupMutation, useImportBackupMutation } from '@/features/settings/hooks/useSettingsData';
import { useTheme } from '@/hooks/useTheme';
import { useLanguageService } from '@/providers/ServicesProvider';
import { usePreferencesStore } from '@/state/preferences.store';

function readRestoredSetting(
  rows: Array<Record<string, string | number | null>>,
  key: string
): string | null {
  const row = rows.find((item) => item.key === key);
  return typeof row?.value === 'string' ? row.value : null;
}

export function BackupRestoreScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const languageService = useLanguageService();
  const setThemePreference = usePreferencesStore((state) => state.setThemePreference);
  const setCurrencyCode = usePreferencesStore((state) => state.setCurrencyCode);
  const completeOnboarding = usePreferencesStore((state) => state.completeOnboarding);
  const resetOnboarding = usePreferencesStore((state) => state.resetOnboarding);
  const exportMutation = useExportBackupMutation();
  const importMutation = useImportBackupMutation();
  const contactsQuery = useContactsQuery();
  const debtsQuery = useDebtsQuery();
  const settingsQuery = useAppSettingsQuery();
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const snapshotInfo = useMemo(
    () => ({
      contacts: contactsQuery.data?.length ?? 0,
      debts: debtsQuery.data?.length ?? 0,
      settings: settingsQuery.data?.length ?? 0
    }),
    [contactsQuery.data, debtsQuery.data, settingsQuery.data]
  );

  return (
    <Screen scrollable>
      <SectionHeader eyebrow={t('backup.title')} title={t('backup.title')} description={t('backup.subtitle')} />

      <AppCard>
        <View style={{ gap: theme.spacing.sm }}>
          <AppText variant="title">{t('backup.snapshotTitle')}</AppText>
          <AppText variant="bodySmall">{t('backup.contacts')}: {snapshotInfo.contacts}</AppText>
          <AppText variant="bodySmall">{t('backup.debts')}: {snapshotInfo.debts}</AppText>
          <AppText variant="bodySmall">{t('backup.settings')}: {snapshotInfo.settings}</AppText>
        </View>
      </AppCard>

      <AppCard style={{ marginTop: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.md }}>
          <AppButton
            label={t('backup.exportFile')}
            iconLeft="backup"
            loading={exportMutation.isPending}
            onPress={() => {
              void exportMutation.mutateAsync().then((result) => {
                setLastMessage(t('backup.exportedMessage', { fileName: result.fileName }));
              });
            }}
          />
          <AppButton
            label={t('backup.importFile')}
            variant="secondary"
            iconLeft="restore"
            loading={importMutation.isPending}
            onPress={() => {
              void File.pickFileAsync(undefined, 'application/json').then((picked) => {
                const selected = Array.isArray(picked) ? picked[0] : picked;
                return importMutation.mutateAsync(selected.uri);
              }).then((result) => {
                const restoredLanguage = readRestoredSetting(result.restoredSettings, 'language');
                const restoredTheme = readRestoredSetting(result.restoredSettings, 'theme_preference');
                const restoredCurrency = readRestoredSetting(result.restoredSettings, 'currency_code');
                const restoredOnboarding = readRestoredSetting(result.restoredSettings, 'has_completed_onboarding');

                if (restoredLanguage === 'vi' || restoredLanguage === 'en') {
                  void languageService.setLanguage(restoredLanguage);
                }
                if (restoredTheme === 'system' || restoredTheme === 'light' || restoredTheme === 'dark') {
                  setThemePreference(restoredTheme);
                }
                if (restoredCurrency) {
                  setCurrencyCode(restoredCurrency);
                }
                if (restoredOnboarding === 'true') {
                  completeOnboarding();
                }
                if (restoredOnboarding === 'false') {
                  resetOnboarding();
                }

                setLastMessage(t('backup.importedMessage', { fileName: result.fileName }));
              }).catch((error: unknown) => {
                setLastMessage(error instanceof Error ? error.message : t('backup.importFailed'));
              });
            }}
          />
        </View>
      </AppCard>

      {exportMutation.data ? (
        <AppCard style={{ marginTop: theme.spacing.lg }}>
          <View style={{ gap: theme.spacing.sm }}>
            <AppText variant="title">{t('backup.lastExport')}</AppText>
            <AppText variant="bodySmall">{t('backup.file')}: {exportMutation.data.fileName}</AppText>
            <AppText variant="bodySmall">{t('backup.uri')}: {exportMutation.data.uri}</AppText>
            <AppText variant="bodySmall">{t('backup.exportedAt')}: {exportMutation.data.exportedAt}</AppText>
          </View>
        </AppCard>
      ) : null}

      {lastMessage ? (
        <AppCard style={{ marginTop: theme.spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
            <AppIcon name="success" color={theme.colors.success} />
            <AppText variant="bodySmall">{lastMessage}</AppText>
          </View>
        </AppCard>
      ) : null}
    </Screen>
  );
}
