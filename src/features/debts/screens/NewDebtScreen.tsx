import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AppCard } from '@/components/common/AppCard';
import { ErrorState } from '@/components/feedback/ErrorState';
import { AppHeader } from '@/components/layout/AppHeader';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { useContactsQuery } from '@/features/contacts/hooks/useContacts';
import { DebtForm } from '@/features/debts/components/debt-form';
import { useCreateDebtMutation } from '@/features/debts/hooks/useDebts';
import { usePreferencesStore } from '@/state/preferences.store';
import type { RootStackParamList } from '@/types/navigation';

export function NewDebtScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddDebt'>>();
  const contactsQuery = useContactsQuery();
  const createMutation = useCreateDebtMutation();
  const currencyCode = usePreferencesStore((state) => state.currencyCode);

  const defaultValues = useMemo(
    () => ({ contactId: route.params?.contactId ?? contactsQuery.data?.[0]?.id ?? '' }),
    [contactsQuery.data, route.params?.contactId]
  );

  if (contactsQuery.isLoading) {
    return <LoadingView label={t('common.loading')} variant="form" />;
  }

  if (contactsQuery.isError) {
    return <ErrorState message={contactsQuery.error.message} onRetry={() => void contactsQuery.refetch()} />;
  }

  return (
    <Screen scrollable>
      <AppHeader
        eyebrow={t('debts.addEyebrow')}
        title={t('debts.addTitle')}
        description={t('debts.addDescription')}
      />
      <AppCard elevated>
        <DebtForm
          contacts={contactsQuery.data ?? []}
          defaultValues={defaultValues}
          submitLabel={t('common.save')}
          loading={createMutation.isPending}
          onAddContact={() => navigation.navigate('AddContact', { redirectTo: 'AddDebt' })}
          onSubmit={async (values) => {
            const debt = await createMutation.mutateAsync({
              contactId: values.contactId,
              direction: values.direction,
              title: values.title,
              description: values.description || null,
              principalAmount: Number(values.principalAmount),
              currencyCode,
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
