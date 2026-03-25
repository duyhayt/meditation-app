import type { DebtRecord } from '@/domain/database';
import { useTheme } from '@/hooks/useTheme';

import { AppBadge } from './AppBadge';

type StatusBadgeProps = {
  status: DebtRecord['status'];
  label: string;
};

export function StatusBadge({ status, label }: StatusBadgeProps): React.JSX.Element {
  const theme = useTheme();

  const appearance = {
    paid: {
      backgroundColor: theme.colors.settledSoft,
      color: theme.colors.settled
    },
    partial: {
      backgroundColor: theme.colors.payableSoft,
      color: theme.colors.warning
    },
    overdue: {
      backgroundColor: theme.colors.overdueSoft,
      color: theme.colors.overdue
    },
    unpaid: {
      backgroundColor: theme.colors.neutralSoft,
      color: theme.colors.neutral
    }
  }[status];

  return <AppBadge label={label} backgroundColor={appearance.backgroundColor} color={appearance.color} />;
}
