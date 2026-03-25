import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { AppCard } from '@/components/common/AppCard';
import { ErrorState } from '@/components/feedback/ErrorState';
import { AppHeader } from '@/components/layout/AppHeader';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { PaymentForm } from '@/features/debts/components/payment-form';
import { useCreatePaymentMutation, useDebtDetailQuery } from '@/features/debts/hooks/useDebts';
import type { RootStackParamList } from '@/types/navigation';

export function AddPaymentScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddPayment'>>();
  const debtQuery = useDebtDetailQuery(route.params.debtId);
  const createPaymentMutation = useCreatePaymentMutation();

  if (debtQuery.isLoading) {
    return <LoadingView label={t('common.loading')} variant="form" />;
  }

  if (debtQuery.isError || !debtQuery.data) {
    return <ErrorState message={debtQuery.error?.message ?? t('debts.notFound')} onRetry={() => void debtQuery.refetch()} />;
  }

  return (
    <Screen scrollable>
      <AppHeader eyebrow={t('debts.paymentEyebrow')} title={t('debts.addPaymentTitle')} description={debtQuery.data.title} />
      <AppCard elevated>
        <PaymentForm
          loading={createPaymentMutation.isPending}
          onSubmit={async (values) => {
            await createPaymentMutation.mutateAsync({
              debtId: route.params.debtId,
              amount: Number(values.amount),
              paymentDate: values.paymentDate,
              note: values.note || null
            });
            navigation.replace('DebtDetail', { debtId: route.params.debtId });
          }}
        />
      </AppCard>
    </Screen>
  );
}
