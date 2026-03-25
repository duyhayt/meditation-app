import { memo } from 'react';

import { ContactCard } from '@/components/contact/ContactCard';
import type { ContactRecord } from '@/domain/database';

type ContactListItemProps = {
  contact: ContactRecord;
  onPress: (contactId: string) => void;
};

function ContactListItemComponent({ contact, onPress }: ContactListItemProps): React.JSX.Element {
  return <ContactCard contact={contact} onPress={() => onPress(contact.id)} />;
}

export const ContactListItem = memo(ContactListItemComponent);
