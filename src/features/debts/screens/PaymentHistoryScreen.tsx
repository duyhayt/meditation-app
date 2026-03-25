import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View, type ListRenderItem } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import type { PaymentRecord } from '@/domain/database';
import { formatCurrency } from '@/features/debts/components/debt-presenters';
import { useDebtDetailQuery, usePaymentHistoryQuery } from '@/features/debts/hooks/useDebts';
import { useTheme } from '@/hooks/useTheme';
import type { RootStackParamList } from '@/types/navigation';

export function PaymentHistoryScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const route = useRoute<RouteProp<RootStackParamList, 'PaymentHistory'>>();
  const debtQuery = useDebtDetailQuery(route.params.debtId);
  const paymentsQuery = usePaymentHistoryQuery(route.params.debtId);

  const renderItem = useCallback<ListRenderItem<PaymentRecord>>(
    ({ item }) => (
      <AppCard style={{ marginBottom: theme.spacing.md }}>
        <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: theme.radius.lg,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.receivableSoft
            }}
          >
            <AppIcon name="payment" color={theme.colors.receivable} />
          </View>
          <View style={{ flex: 1, gap: theme.spacing.xs }}>
            <AppText variant="title">{formatCurrency(item.amount, debtQuery.data?.currencyCode ?? 'VND')}</AppText>
            <AppText variant="bodySmall">{item.paymentDate}</AppText>
            <AppText variant="bodySmall">{item.note || 'Không có ghi chú'}</AppText>
          </View>
        </View>
      </AppCard>
    ),
    [
      debtQuery.data?.currencyCode,
      theme.colors.receivable,
      theme.colors.receivableSoft,
      theme.radius.lg,
      theme.spacing.md,
      theme.spacing.xs
    ]
  );

  if (debtQuery.isLoading || paymentsQuery.isLoading) {
    return <LoadingView label={t('common.loading')} />;
  }

  if (debtQuery.isError || paymentsQuery.isError || !debtQuery.data) {
    return (
      <ErrorState
        message={debtQuery.error?.message ?? paymentsQuery.error?.message ?? 'Payment history unavailable'}
        onRetry={() => void paymentsQuery.refetch()}
      />
    );
  }

  const debt = debtQuery.data;

  return (
    <Screen>
      <SectionHeader eyebrow="Thanh toán" title={t('debts.paymentHistoryTitle')} description={debt.title} />
      {!paymentsQuery.data?.length ? (
        <EmptyState
          title={t('debts.paymentHistoryTitle')}
          description="Khoản nợ này chưa có lịch sử thanh toán nào."
        />
      ) : (
        <FlatList
          data={paymentsQuery.data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={10}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </Screen>
  );
}
