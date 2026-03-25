import type { DebtDirection, DebtStatus } from '@/domain/database';

export function deriveDebtStatus(params: {
  principalAmount: number;
  paidAmount: number;
  dueDate: string | null;
  now?: Date;
}): DebtStatus {
  const { principalAmount, paidAmount, dueDate, now = new Date() } = params;
  const normalizedPaid = Math.max(0, paidAmount);
  const remainingAmount = Math.max(principalAmount - normalizedPaid, 0);

  if (remainingAmount <= 0) {
    return 'paid';
  }

  if (normalizedPaid > 0) {
    return 'partial';
  }

  if (dueDate && new Date(dueDate).getTime() < now.getTime()) {
    return 'overdue';
  }

  return 'unpaid';
}

export function calculateDebtSnapshot(params: {
  principalAmount: number;
  paidAmount: number;
  dueDate: string | null;
  now?: Date;
}): Pick<{ paidAmount: number; remainingAmount: number; status: DebtStatus }, 'paidAmount' | 'remainingAmount' | 'status'> {
  const normalizedPaid = Math.max(0, params.paidAmount);
  const remainingAmount = Math.max(params.principalAmount - normalizedPaid, 0);

  return {
    paidAmount: normalizedPaid,
    remainingAmount,
    status: deriveDebtStatus({
      principalAmount: params.principalAmount,
      paidAmount: normalizedPaid,
      dueDate: params.dueDate,
      now: params.now
    })
  };
}

export function summarizeDebtDirection(direction: DebtDirection, amount: number): number {
  return direction === 'lend' ? amount : -amount;
}
