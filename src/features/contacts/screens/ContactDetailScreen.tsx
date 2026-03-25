import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppText } from '@/components/common/AppText';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ErrorState } from '@/components/feedback/ErrorState';
import { AppHeader } from '@/components/layout/AppHeader';
import { InfoRow } from '@/components/ui/InfoRow';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { useDeleteContactMutation, useContactDetailQuery } from '@/features/contacts/hooks/useContacts';
import { formatCurrency } from '@/features/debts/components/debt-presenters';
import { useDebtsQuery } from '@/features/debts/hooks/useDebts';
import { useTheme } from '@/hooks/useTheme';
import type { RootStackParamList } from '@/types/navigation';

export function ContactDetailScreen(): React.JSX.Element {
  const route = useRoute<RouteProp<RootStackParamList, 'ContactDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const theme = useTheme();
  const { data: contact, isLoading, isError, error, refetch } = useContactDetailQuery(route.params.contactId);
  const { data: debts } = useDebtsQuery();
  const deleteMutation = useDeleteContactMutation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const contactDebts = useMemo(
    () => (debts ?? []).filter((debt) => debt.contactId === route.params.contactId),
    [debts, route.params.contactId]
  );

  if (isLoading) {
    return <LoadingView label={t('common.loading')} variant="detail" />;
  }

  if (isError || !contact) {
    return <ErrorState message={error?.message ?? 'Contact not found'} onRetry={() => void refetch()} />;
  }

  return (
    <Screen scrollable>
      <AppHeader eyebrow={t('contacts.detailEyebrow')} title={contact.name} description={t('contacts.detailTitle')} />
      <AppCard>
        <View style={{ gap: theme.spacing.md }}>
          <InfoRow label={t('contacts.phone')} value={contact.phone || t('common.notUpdated')} />
          <InfoRow label={t('contacts.email')} value={contact.email || t('common.notUpdated')} />
          <InfoRow label={t('contacts.address')} value={contact.address || t('common.notUpdated')} />
          <InfoRow label={t('contacts.note')} value={contact.note || t('common.noNote')} />
        </View>
      </AppCard>

      <AppCard style={{ marginTop: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.sm }}>
          <AppText variant="title">{t('contacts.relatedSummary')}</AppText>
          <InfoRow label={t('contacts.debtCount')} value={String(contactDebts.length)} />
          <InfoRow
            label={t('contacts.outstanding')}
            value={formatCurrency(contactDebts.reduce((sum, item) => sum + item.remainingAmount, 0))}
          />
        </View>
      </AppCard>

      <AppButton
        label={t('contacts.editTitle')}
        iconLeft="edit"
        style={{ marginTop: theme.spacing.lg }}
        onPress={() => navigation.navigate('EditContact', { contactId: contact.id })}
      />
      <AppButton
        label={t('debts.title')}
        variant="secondary"
        iconLeft="debts"
        style={{ marginTop: theme.spacing.md }}
        onPress={() => navigation.navigate('MainTabs', { screen: 'DebtsTab' })}
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
        title={t('contacts.deleteTitle')}
        description={t('contacts.deleteDescription')}
        confirmLabel={t('contacts.deleteConfirm')}
        tone="danger"
        loading={deleteMutation.isPending}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          void deleteMutation.mutateAsync(contact.id).then(() => {
            setShowDeleteDialog(false);
            navigation.goBack();
          });
        }}
      />
    </Screen>
  );
}
