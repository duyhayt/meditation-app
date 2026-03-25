import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { MoneyText } from '@/components/common/MoneyText';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { QuickActionCard } from '@/components/home/QuickActionCard';
import { StatisticCard } from '@/components/statistics/StatisticCard';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { useContactsQuery } from '@/features/contacts/hooks/useContacts';
import { formatCurrency } from '@/features/debts/components/debt-presenters';
import { useDebtsQuery } from '@/features/debts/hooks/useDebts';
import { useStatisticsSummaryQuery, useUpcomingRemindersQuery } from '@/features/home/hooks/useDashboard';
import { useTheme } from '@/hooks/useTheme';
import type { RootStackParamList } from '@/types/navigation';

export function HomeScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const summaryQuery = useStatisticsSummaryQuery();
  const remindersQuery = useUpcomingRemindersQuery();
  const debtsQuery = useDebtsQuery();
  const contactsQuery = useContactsQuery();

  if (summaryQuery.isLoading || remindersQuery.isLoading || debtsQuery.isLoading || contactsQuery.isLoading) {
    return <LoadingView label={t('common.loading')} variant="dashboard" />;
  }

  if (summaryQuery.isError) {
    return <ErrorState message={summaryQuery.error.message} onRetry={() => void summaryQuery.refetch()} />;
  }

  const summary = summaryQuery.data ?? {
    totalReceivable: 0,
    totalPayable: 0,
    totalCollected: 0,
    totalPaid: 0,
    overdueReceivable: 0,
    overduePayable: 0,
    debtCount: 0,
    overdueCount: 0
  };
  const recentDebts = (debtsQuery.data ?? []).slice(0, 3);

  return (
    <Screen scrollable>
      <SectionHeader eyebrow={t('home.heroEyebrow')} title={t('home.title')} description={t('home.subtitle')} showBackButton={false} />
      <AppCard elevated style={{ marginBottom: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.lg }}>
          <View style={{ gap: theme.spacing.xs }}>
            <AppText variant="label">{t('home.todaySummary')}</AppText>
            <AppText variant="heading1">{t('home.heroTitle')}</AppText>
            <AppText variant="bodySmall">{t('home.heroDescription')}</AppText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.md }}>
            <View style={{ flex: 1 }}>
              <AppText variant="label">{t('home.totalReceivable')}</AppText>
              <MoneyText amount={summary.totalReceivable} color={theme.colors.receivable} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="label">{t('home.totalPayable')}</AppText>
              <MoneyText amount={summary.totalPayable} color={theme.colors.payable} />
            </View>
          </View>
        </View>
      </AppCard>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md }}>
        <StatisticCard label={t('home.totalReceivable')} amount={summary.totalReceivable} tone="receivable" />
        <StatisticCard label={t('home.totalPayable')} amount={summary.totalPayable} tone="payable" />
        <StatisticCard label={t('home.overdueDebts')} value={String(summary.overdueCount)} tone="overdue" />
        <StatisticCard label={t('home.contactsCount')} value={String(contactsQuery.data?.length ?? 0)} />
      </View>

      <SectionHeader title={t('home.quickActions')} description={t('home.quickActionsDescription')} showBackButton={false} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md }}>
        <QuickActionCard
          icon="addDebt"
          title={t('common.fabAddDebt')}
          subtitle={t('debts.addDescription')}
          onPress={() => navigation.navigate('AddDebt')}
        />
        <QuickActionCard
          icon="addContact"
          title={t('home.addContact')}
          subtitle={t('contacts.addDescription')}
          onPress={() => navigation.navigate('AddContact')}
        />
        <QuickActionCard
          icon="reminder"
          title={t('home.openReminders')}
          subtitle={t('reminders.subtitle')}
          onPress={() => navigation.navigate('ReminderCenter')}
        />
      </View>

      <AppCard style={{ marginTop: theme.spacing.xl }}>
        <View style={{ gap: theme.spacing.md }}>
          <SectionHeader
            title={t('home.upcomingReminders')}
            description={t('home.upcomingDescription')}
            showBackButton={false}
          />
          {remindersQuery.data?.length ? (
            remindersQuery.data.map((reminder) => (
              <View
                key={reminder.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: theme.spacing.md,
                  borderTopWidth: 1,
                  borderTopColor: theme.colors.divider,
                  paddingTop: theme.spacing.md
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: theme.radius.lg,
                    backgroundColor: theme.colors.payableSoft,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <AppIcon name="reminder" color={theme.colors.payable} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyStrong">{reminder.remindAt}</AppText>
                  <AppText variant="bodySmall">{t('home.upcomingHint')}</AppText>
                </View>
              </View>
            ))
          ) : (
            <AppText variant="bodySmall">{t('common.emptyDescription')}</AppText>
          )}
        </View>
      </AppCard>

      <AppCard style={{ marginTop: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.sm }}>
          <SectionHeader title={t('home.recentActivity')} description={t('home.recentDescription')} showBackButton={false} />
          {recentDebts.length ? (
            recentDebts.map((debt) => (
              <View
                key={debt.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: theme.spacing.md,
                  borderTopWidth: 1,
                  borderTopColor: theme.colors.divider,
                  paddingTop: theme.spacing.md
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: theme.radius.lg,
                    backgroundColor:
                      debt.direction === 'lend' ? theme.colors.receivableSoft : theme.colors.payableSoft,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <AppIcon
                    name={debt.direction === 'lend' ? 'debtLend' : 'debtBorrow'}
                    color={debt.direction === 'lend' ? theme.colors.receivable : theme.colors.payable}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyStrong">{debt.title}</AppText>
                  <AppText variant="bodySmall">
                    {formatCurrency(debt.remainingAmount, debt.currencyCode)} {t('home.remainingSuffix')}
                  </AppText>
                </View>
              </View>
            ))
          ) : (
            <AppText variant="bodySmall">{t('common.emptyDescription')}</AppText>
          )}
        </View>
      </AppCard>
    </Screen>
  );
}
