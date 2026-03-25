import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { MoneyText } from '@/components/common/MoneyText';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ErrorState } from '@/components/feedback/ErrorState';
import { AppHeader } from '@/components/layout/AppHeader';
import { InfoRow } from '@/components/ui/InfoRow';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { useContactDetailQuery } from '@/features/contacts/hooks/useContacts';
import { formatCurrency } from '@/features/debts/components/debt-presenters';
import { useDebtDetailQuery, useDeleteDebtMutation, usePaymentHistoryQuery } from '@/features/debts/hooks/useDebts';
import { useTheme } from '@/hooks/useTheme';
import type { RootStackParamList } from '@/types/navigation';

export function DebtDetailScreen(): React.JSX.Element {
  const route = useRoute<RouteProp<RootStackParamList, 'DebtDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const theme = useTheme();
  const debtQuery = useDebtDetailQuery(route.params.debtId);
  const paymentsQuery = usePaymentHistoryQuery(route.params.debtId);
  const deleteMutation = useDeleteDebtMutation();
  const contactQuery = useContactDetailQuery(debtQuery.data?.contactId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const totalPayments = useMemo(
    () => (paymentsQuery.data ?? []).reduce((sum, payment) => sum + payment.amount, 0),
    [paymentsQuery.data]
  );

  if (debtQuery.isLoading) {
    return <LoadingView label={t('common.loading')} variant="detail" />;
  }

  if (debtQuery.isError || !debtQuery.data) {
    return <ErrorState message={debtQuery.error?.message ?? 'Debt not found'} onRetry={() => void debtQuery.refetch()} />;
  }

  const debt = debtQuery.data;
  const progress = debt.principalAmount > 0 ? Math.min(1, debt.paidAmount / debt.principalAmount) : 0;
  const isLend = debt.direction === 'lend';
  const toneColor = isLend ? theme.colors.receivable : theme.colors.payable;

  return (
    <Screen scrollable>
      <AppHeader
        eyebrow={t('debts.detailEyebrow')}
        title={debt.title}
        description={contactQuery.data?.name ?? t('contacts.title')}
        rightSlot={
          <StatusBadge
            status={debt.status}
            label={
              debt.status === 'paid'
                ? t('debts.statusPaid')
                : debt.status === 'partial'
                  ? t('debts.statusPartial')
                  : debt.status === 'overdue'
                    ? t('debts.statusOverdue')
                    : t('debts.statusUnpaid')
            }
          />
        }
      />

      <AppCard elevated>
        <View style={{ gap: theme.spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.md }}>
            <View style={{ flex: 1, gap: theme.spacing.xs }}>
              <AppText variant="label">{isLend ? t('debts.typeReceivable') : t('debts.typePayable')}</AppText>
              <MoneyText amount={debt.principalAmount} currencyCode={debt.currencyCode} color={toneColor} />
            </View>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: theme.radius.lg,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isLend ? theme.colors.receivableSoft : theme.colors.payableSoft
              }}
            >
              <AppIcon
                name={isLend ? 'debtLend' : 'debtBorrow'}
                color={toneColor}
                size={theme.iconSize.lg}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
            <View style={{ flex: 1, gap: theme.spacing.xs }}>
              <AppText variant="label">{t('debts.paid')}</AppText>
              <MoneyText amount={debt.paidAmount} currencyCode={debt.currencyCode} />
            </View>
            <View style={{ flex: 1, gap: theme.spacing.xs }}>
              <AppText variant="label">{t('debts.remaining')}</AppText>
              <MoneyText amount={debt.remainingAmount} currencyCode={debt.currencyCode} />
            </View>
          </View>
          <View style={{ gap: theme.spacing.sm }}>
            <View
              style={{
                height: 10,
                borderRadius: theme.radius.pill,
                overflow: 'hidden',
                backgroundColor: theme.colors.surfaceSecondary
              }}
            >
              <View
                style={{
                  width: `${progress * 100}%`,
                  height: '100%',
                  borderRadius: theme.radius.pill,
                  backgroundColor: toneColor
                }}
              />
            </View>
            <AppText variant="bodySmall">{t('debts.progressValue', { value: Math.round(progress * 100) })}</AppText>
          </View>
        </View>
      </AppCard>

      <AppCard style={{ marginTop: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.md }}>
          <InfoRow label={t('debts.debtType')} value={debt.direction === 'lend' ? t('debts.receivable') : t('debts.payable')} />
          <InfoRow label={t('debts.principalAmount')} value={formatCurrency(debt.principalAmount, debt.currencyCode)} />
          <InfoRow label={t('debts.paid')} value={formatCurrency(debt.paidAmount, debt.currencyCode)} />
          <InfoRow label={t('debts.remaining')} value={formatCurrency(debt.remainingAmount, debt.currencyCode)} />
          <InfoRow label={t('debts.issueDate')} value={debt.issueDate} />
          <InfoRow label={t('debts.dueDate')} value={debt.dueDate || t('debts.noDueDate')} />
          <InfoRow label={t('debts.note')} value={debt.note || t('common.noNote')} />
        </View>
      </AppCard>

      <AppCard style={{ marginTop: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.sm }}>
          <AppText variant="title">{t('debts.paymentHistoryTitle')}</AppText>
          <InfoRow label={t('debts.paymentCount')} value={String(paymentsQuery.data?.length ?? 0)} />
          <InfoRow label={t('debts.totalPaymentAmount')} value={formatCurrency(totalPayments, debt.currencyCode)} />
          {(paymentsQuery.data ?? []).length ? (
            (paymentsQuery.data ?? []).map((payment) => (
              <View
                key={payment.id}
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
                    width: 36,
                    height: 36,
                    borderRadius: theme.radius.md,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.colors.receivableSoft
                  }}
                >
                  <AppIcon name="payment" size={theme.iconSize.md} color={theme.colors.receivable} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyStrong">{formatCurrency(payment.amount, debt.currencyCode)}</AppText>
                  <AppText variant="bodySmall">{payment.paymentDate}</AppText>
                </View>
              </View>
            ))
          ) : (
            <AppText variant="bodySmall">{t('debts.noPaymentsYet')}</AppText>
          )}
        </View>
      </AppCard>

      <AppButton
        label={t('debts.addPaymentTitle')}
        iconLeft="payment"
        style={{ marginTop: theme.spacing.lg }}
        onPress={() => navigation.navigate('AddPayment', { debtId: debt.id })}
      />
      <AppButton
        label={t('debts.editTitle')}
        variant="secondary"
        iconLeft="edit"
        style={{ marginTop: theme.spacing.md }}
        onPress={() => navigation.navigate('EditDebt', { debtId: debt.id })}
      />
      <AppButton
        label={t('debts.paymentHistoryTitle')}
        variant="outline"
        style={{ marginTop: theme.spacing.md }}
        onPress={() => navigation.navigate('PaymentHistory', { debtId: debt.id })}
      />
      <AppButton
        label={t('reminders.title')}
        variant="outline"
        iconLeft="reminder"
        style={{ marginTop: theme.spacing.md }}
        onPress={() => navigation.navigate('ReminderCenter', { debtId: debt.id })}
      />
      <AppButton
        label={t('common.delete')}
        variant="danger"
        loading={deleteMutation.isPending}
        iconLeft="delete"
        style={{ marginTop: theme.spacing.md }}
        onPress={() => setShowDeleteDialog(true)}
      />
      <ConfirmDialog
        visible={showDeleteDialog}
        title={t('debts.deleteTitle')}
        description={t('debts.deleteDescription')}
        confirmLabel={t('debts.deleteConfirm')}
        tone="danger"
        loading={deleteMutation.isPending}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          void deleteMutation.mutateAsync(debt.id).then(() => {
            setShowDeleteDialog(false);
            navigation.goBack();
          });
        }}
      />
    </Screen>
  );
}
