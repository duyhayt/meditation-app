import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, type ListRenderItem } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import type { ContactRecord } from '@/domain/database';
import { ContactListItem } from '@/features/contacts/components/ContactListItem';
import { useContactsQuery } from '@/features/contacts/hooks/useContacts';
import type { RootStackParamList } from '@/types/navigation';

export function ContactListScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data, isLoading, isError, error, refetch } = useContactsQuery();

  const handleContactPress = useCallback(
    (contactId: string) => {
      navigation.navigate('ContactDetail', { contactId });
    },
    [navigation]
  );

  const renderItem = useCallback<ListRenderItem<ContactRecord>>(
    ({ item }) => <ContactListItem contact={item} onPress={handleContactPress} />,
    [handleContactPress]
  );

  if (isLoading) {
    return <LoadingView label={t('common.loading')} variant="list" />;
  }

  if (isError) {
    return <ErrorState message={error.message} onRetry={() => void refetch()} />;
  }

  return (
    <Screen>
      <SectionHeader
        eyebrow={t('contacts.listEyebrow')}
        title={t('contacts.title')}
        description={t('contacts.listDescription', { count: data?.length ?? 0 })}
        showBackButton={false}
      />
      {!data?.length ? (
        <EmptyState
          title={t('contacts.title')}
          description={t('common.emptyDescription')}
          actionLabel={t('contacts.addTitle')}
          onAction={() => navigation.navigate('AddContact')}
        />
      ) : (
        <FlatList
          data={data}
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
        label={t('contacts.addTitle')}
        iconLeft="addContact"
        style={{ marginTop: 16 }}
        onPress={() => navigation.navigate('AddContact')}
      />
    </Screen>
  );
}
