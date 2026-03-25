import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View, type ListRenderItem } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { StatisticCard } from '@/components/statistics/StatisticCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import type { DebtRecord } from '@/domain/database';
import { useContactsQuery } from '@/features/contacts/hooks/useContacts';
import { formatCurrency } from '@/features/debts/components/debt-presenters';
import { DebtListItem } from '@/features/debts/components/DebtListItem';
import { useDebtsQuery } from '@/features/debts/hooks/useDebts';
import { useStatisticsSummaryQuery } from '@/features/home/hooks/useDashboard';
import type { RootStackParamList } from '@/types/navigation';

export function DebtListScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const debtsQuery = useDebtsQuery();
  const contactsQuery = useContactsQuery();
  const summaryQuery = useStatisticsSummaryQuery();

  const contactsMap = useMemo(
    () => new Map((contactsQuery.data ?? []).map((contact) => [contact.id, contact])),
    [contactsQuery.data]
  );

  const handleDebtPress = useCallback(
    (debtId: string) => {
      navigation.navigate('DebtDetail', { debtId });
    },
    [navigation]
  );

  const renderItem = useCallback<ListRenderItem<DebtRecord>>(
    ({ item }) => (
      <DebtListItem debt={item} contact={contactsMap.get(item.contactId)} onPress={handleDebtPress} />
    ),
    [contactsMap, handleDebtPress]
  );

  if (debtsQuery.isLoading || contactsQuery.isLoading) {
    return <LoadingView label={t('common.loading')} variant="list" />;
  }

  if (debtsQuery.isError) {
    return <ErrorState message={debtsQuery.error.message} onRetry={() => void debtsQuery.refetch()} />;
  }

  return (
    <Screen>
      <SectionHeader
        eyebrow={t('debts.tabEyebrow')}
        title={t('debts.title')}
        description={t('debts.tabDescription', { count: debtsQuery.data?.length ?? 0 })}
        showBackButton={false}
      />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <StatisticCard
          label={t('debts.receivable')}
          value={formatCurrency(summaryQuery.data?.totalReceivable ?? 0)}
          tone="receivable"
        />
        <StatisticCard
          label={t('debts.payable')}
          value={formatCurrency(summaryQuery.data?.totalPayable ?? 0)}
          tone="payable"
        />
      </View>
      {!debtsQuery.data?.length ? (
        <EmptyState
          title={t('debts.emptyTitle')}
          description={t('debts.emptyDescription')}
          actionLabel={t('common.fabAddDebt')}
          onAction={() => navigation.navigate('AddDebt')}
        />
      ) : (
        <FlatList
          data={debtsQuery.data}
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
      <AppButton
        label={t('common.fabAddDebt')}
        iconLeft="addDebt"
        style={{ marginTop: 16 }}
        onPress={() => navigation.navigate('AddDebt')}
      />
    </Screen>
  );
}
