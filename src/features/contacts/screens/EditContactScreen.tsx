import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { AppCard } from '@/components/common/AppCard';
import { ErrorState } from '@/components/feedback/ErrorState';
import { AppHeader } from '@/components/layout/AppHeader';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { ContactForm } from '@/features/contacts/components/contact-form';
import { useContactDetailQuery, useUpdateContactMutation } from '@/features/contacts/hooks/useContacts';
import type { RootStackParamList } from '@/types/navigation';

export function EditContactScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EditContact'>>();
  const { data: contact, isLoading, isError, error, refetch } = useContactDetailQuery(route.params.contactId);
  const updateMutation = useUpdateContactMutation(route.params.contactId);

  if (isLoading) {
    return <LoadingView label={t('common.loading')} />;
  }

  if (isError || !contact) {
    return <ErrorState message={error?.message ?? 'Contact not found'} onRetry={() => void refetch()} />;
  }

  return (
    <Screen scrollable>
      <AppHeader eyebrow="Chỉnh sửa" title={t('contacts.editTitle')} description={contact.name} />
      <AppCard elevated>
        <ContactForm
          submitLabel={t('common.save')}
          loading={updateMutation.isPending}
          defaultValues={{
            name: contact.name,
            phone: contact.phone ?? '',
            email: contact.email ?? '',
            address: contact.address ?? '',
            note: contact.note ?? ''
          }}
          onSubmit={async (values) => {
            await updateMutation.mutateAsync({
              name: values.name,
              phone: values.phone || null,
              email: values.email || null,
              address: values.address || null,
              note: values.note || null
            });
            navigation.replace('ContactDetail', { contactId: route.params.contactId });
          }}
        />
      </AppCard>
    </Screen>
  );
}
