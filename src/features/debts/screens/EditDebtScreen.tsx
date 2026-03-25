import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { AppCard } from '@/components/common/AppCard';
import { ErrorState } from '@/components/feedback/ErrorState';
import { AppHeader } from '@/components/layout/AppHeader';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { useContactsQuery } from '@/features/contacts/hooks/useContacts';
import { DebtForm } from '@/features/debts/components/debt-form';
import { useDebtDetailQuery, useUpdateDebtMutation } from '@/features/debts/hooks/useDebts';
import type { RootStackParamList } from '@/types/navigation';

export function EditDebtScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EditDebt'>>();
  const debtQuery = useDebtDetailQuery(route.params.debtId);
  const contactsQuery = useContactsQuery();
  const updateMutation = useUpdateDebtMutation(route.params.debtId);

  if (debtQuery.isLoading || contactsQuery.isLoading) {
    return <LoadingView label={t('common.loading')} variant="form" />;
  }

  if (debtQuery.isError || contactsQuery.isError || !debtQuery.data) {
    return <ErrorState message={debtQuery.error?.message ?? contactsQuery.error?.message ?? 'Debt not found'} onRetry={() => void debtQuery.refetch()} />;
  }

  const debt = debtQuery.data;

  return (
    <Screen scrollable>
      <AppHeader eyebrow="Chỉnh sửa" title={t('debts.editTitle')} description={debt.title} />
      <AppCard elevated>
        <DebtForm
          contacts={contactsQuery.data ?? []}
          defaultValues={{
            contactId: debt.contactId,
            direction: debt.direction,
            title: debt.title,
            description: debt.description ?? '',
            principalAmount: String(debt.principalAmount),
            issueDate: debt.issueDate,
            dueDate: debt.dueDate ?? '',
            note: debt.note ?? ''
          }}
          submitLabel={t('common.save')}
          loading={updateMutation.isPending}
          onSubmit={async (values) => {
            await updateMutation.mutateAsync({
              contactId: values.contactId,
              direction: values.direction,
              title: values.title,
              description: values.description || null,
              principalAmount: Number(values.principalAmount),
              issueDate: values.issueDate,
              dueDate: values.dueDate || null,
              note: values.note || null
            });
            navigation.replace('DebtDetail', { debtId: debt.id });
          }}
        />
      </AppCard>
    </Screen>
  );
}
