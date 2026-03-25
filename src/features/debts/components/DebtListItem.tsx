import { memo } from 'react';

import { DebtCard } from '@/components/debt/DebtCard';
import type { ContactRecord, DebtRecord } from '@/domain/database';

type DebtListItemProps = {
  debt: DebtRecord;
  contact?: ContactRecord;
  onPress: (debtId: string) => void;
};

function DebtListItemComponent({ debt, contact, onPress }: DebtListItemProps): React.JSX.Element {
  return <DebtCard debt={debt} contact={contact} onPress={() => onPress(debt.id)} />;
}

export const DebtListItem = memo(DebtListItemComponent);
