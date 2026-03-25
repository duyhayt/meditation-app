import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/layout/AppHeader';
import { Screen } from '@/components/ui/Screen';
import { ContactForm } from '@/features/contacts/components/contact-form';
import { useCreateContactMutation } from '@/features/contacts/hooks/useContacts';
import type { RootStackParamList } from '@/types/navigation';

export function NewContactScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddContact'>>();
  const createMutation = useCreateContactMutation();

  return (
    <Screen scrollable>
      <AppHeader
        eyebrow="Tạo mới"
        title={t('contacts.addTitle')}
        description="Tạo liên hệ dùng lại cho các khoản nợ và nhắc nợ."
      />
      <AppCard elevated>
        <ContactForm
          submitLabel={t('common.save')}
          loading={createMutation.isPending}
          onSubmit={async (values) => {
            const contact = await createMutation.mutateAsync({
              name: values.name,
              phone: values.phone || null,
              email: values.email || null,
              address: values.address || null,
              note: values.note || null,
              avatarUri: null,
              isArchived: false
            });

            if (route.params?.redirectTo === 'AddDebt') {
              navigation.replace('AddDebt', { contactId: contact.id });
              return;
            }

            navigation.replace('ContactDetail', { contactId: contact.id });
          }}
        />
      </AppCard>
    </Screen>
  );
}
