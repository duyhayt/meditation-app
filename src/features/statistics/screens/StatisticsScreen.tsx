import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { AppText } from '@/components/common/AppText';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { StatisticCard } from '@/components/statistics/StatisticCard';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { useStatisticsBreakdownQuery, useStatisticsSummaryQuery } from '@/features/home/hooks/useDashboard';

export function StatisticsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const summaryQuery = useStatisticsSummaryQuery();
  const breakdownQuery = useStatisticsBreakdownQuery();

  if (summaryQuery.isLoading || breakdownQuery.isLoading) {
    return <LoadingView label={t('common.loading')} variant="dashboard" />;
  }

  if (summaryQuery.isError || breakdownQuery.isError) {
    return (
      <ErrorState
        message={summaryQuery.error?.message ?? breakdownQuery.error?.message ?? t('statistics.unavailable')}
        onRetry={() => {
          void summaryQuery.refetch();
          void breakdownQuery.refetch();
        }}
      />
    );
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
  const breakdown = breakdownQuery.data ?? {
    unpaidCount: 0,
    partialCount: 0,
    paidCount: 0,
    overdueCount: 0
  };

  return (
    <Screen scrollable>
      <SectionHeader eyebrow={t('statistics.title')} title={t('statistics.title')} description={t('statistics.subtitle')} showBackButton={false} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <StatisticCard label={t('home.totalReceivable')} amount={summary.totalReceivable} tone="receivable" />
        <StatisticCard label={t('home.totalPayable')} amount={summary.totalPayable} tone="payable" />
        <StatisticCard label={t('debts.paid')} amount={summary.totalCollected} tone="settled" />
        <StatisticCard label={t('debts.paid')} amount={summary.totalPaid} tone="settled" />
      </View>

      <AppCard style={{ marginTop: 16 }}>
        <View style={{ gap: 8 }}>
          <AppText variant="title">{t('statistics.overview')}</AppText>
          <AppText variant="bodySmall">{t('statistics.debtCount')}: {summary.debtCount}</AppText>
          <AppText variant="bodySmall">{t('statistics.overdueCount')}: {summary.overdueCount}</AppText>
          <AppText variant="bodySmall">{t('statistics.overdueReceivable')}: {summary.overdueReceivable.toLocaleString('vi-VN')} đ</AppText>
          <AppText variant="bodySmall">{t('statistics.overduePayable')}: {summary.overduePayable.toLocaleString('vi-VN')} đ</AppText>
        </View>
      </AppCard>

      <AppCard style={{ marginTop: 16 }}>
        <View style={{ gap: 8 }}>
          <AppText variant="title">{t('statistics.statusBreakdown')}</AppText>
          <AppText variant="bodySmall">{t('statistics.unpaid')}: {breakdown.unpaidCount}</AppText>
          <AppText variant="bodySmall">{t('statistics.partial')}: {breakdown.partialCount}</AppText>
          <AppText variant="bodySmall">{t('statistics.paid')}: {breakdown.paidCount}</AppText>
          <AppText variant="bodySmall">{t('statistics.overdue')}: {breakdown.overdueCount}</AppText>
        </View>
      </AppCard>
    </Screen>
  );
}
