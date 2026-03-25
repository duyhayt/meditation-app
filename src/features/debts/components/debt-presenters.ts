import type { DebtRecord } from '@/domain/database';
import type { AppTheme } from '@/theme';

export function formatCurrency(amount: number, currencyCode = 'VND'): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0
  }).format(amount);
}

export function getDebtStatusAppearance(theme: AppTheme, status: DebtRecord['status']) {
  switch (status) {
    case 'paid':
      return { backgroundColor: theme.colors.paid, color: theme.colors.onPrimary };
    case 'partial':
      return { backgroundColor: theme.colors.partial, color: theme.colors.onPrimary };
    case 'overdue':
      return { backgroundColor: theme.colors.overdue, color: theme.colors.onPrimary };
    case 'unpaid':
    default:
      return { backgroundColor: theme.colors.unpaid, color: theme.colors.onPrimary };
  }
}

export function getDebtDirectionTone(theme: AppTheme, direction: DebtRecord['direction']): string {
  return direction === 'lend' ? theme.colors.lend : theme.colors.borrow;
}
