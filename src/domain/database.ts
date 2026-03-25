export type DebtDirection = 'lend' | 'borrow';
export type DebtStatus = 'unpaid' | 'partial' | 'paid' | 'overdue';
export type ReminderStatus = 'pending' | 'sent' | 'dismissed' | 'completed';
export type SyncState = 'local_only' | 'pending_upload' | 'synced' | 'conflict';

export type ContactRecord = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  note: string | null;
  avatarUri: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DebtRecord = {
  id: string;
  contactId: string;
  direction: DebtDirection;
  title: string;
  description: string | null;
  principalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currencyCode: string;
  issueDate: string;
  dueDate: string | null;
  status: DebtStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaymentRecord = {
  id: string;
  debtId: string;
  amount: number;
  paymentDate: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReminderRecord = {
  id: string;
  debtId: string;
  remindAt: string;
  channel: 'local';
  status: ReminderStatus;
  note: string | null;
  isEnabled: boolean;
  lastTriggeredAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TagRecord = {
  id: string;
  name: string;
  color: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AppSettingRecord = {
  key: string;
  value: string;
  valueType: 'string' | 'number' | 'boolean' | 'json';
  createdAt: string;
  updatedAt: string;
};

export type DebtSummary = {
  totalReceivable: number;
  totalPayable: number;
  totalCollected: number;
  totalPaid: number;
  overdueReceivable: number;
  overduePayable: number;
  debtCount: number;
  overdueCount: number;
};
