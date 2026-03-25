import type { DebtDirection, DebtRecord } from '@/domain/database';
import { createId, getNowIsoString } from '@/services/db/db.utils';
import { upsertSyncMetadata, writeActivityLog } from '@/services/db/internal-metadata';
import type { DatabaseService, LoggerService } from '@/services/di/types';

import { calculateDebtSnapshot } from './debt-calculations';

type DebtRow = {
  id: string;
  contact_id: string;
  direction: DebtDirection;
  title: string;
  description: string | null;
  principal_amount: number;
  paid_amount: number;
  remaining_amount: number;
  currency_code: string;
  issue_date: string;
  due_date: string | null;
  status: DebtRecord['status'];
  note: string | null;
  created_at: string;
  updated_at: string;
};

type CreateDebtInput = Omit<DebtRecord, 'id' | 'paidAmount' | 'remainingAmount' | 'status' | 'createdAt' | 'updatedAt'> & {
  paidAmount?: number;
};
type UpdateDebtInput = Partial<CreateDebtInput>;

function mapDebtRow(row: DebtRow): DebtRecord {
  return {
    id: row.id,
    contactId: row.contact_id,
    direction: row.direction,
    title: row.title,
    description: row.description,
    principalAmount: row.principal_amount,
    paidAmount: row.paid_amount,
    remainingAmount: row.remaining_amount,
    currencyCode: row.currency_code,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    status: row.status,
    note: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function createDebtsRepository(deps: {
  databaseService: DatabaseService;
  loggerService: LoggerService;
}) {
  return {
    list: async (): Promise<DebtRecord[]> => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<DebtRow>(
        'SELECT * FROM debts ORDER BY due_date IS NULL ASC, due_date ASC, updated_at DESC'
      );
      return rows.map(mapDebtRow);
    },
    getById: async (id: string): Promise<DebtRecord | null> => {
      const database = await deps.databaseService.getDatabase();
      const row = await database.getFirstAsync<DebtRow>('SELECT * FROM debts WHERE id = ?', id);
      return row ? mapDebtRow(row) : null;
    },
    create: async (input: CreateDebtInput): Promise<DebtRecord> => {
      const database = await deps.databaseService.getDatabase();
      const id = createId('debt');
      const now = getNowIsoString();
      const snapshot = calculateDebtSnapshot({
        principalAmount: input.principalAmount,
        paidAmount: input.paidAmount ?? 0,
        dueDate: input.dueDate
      });

      await database.runAsync(
        'INSERT INTO debts (id, contact_id, direction, title, description, principal_amount, paid_amount, remaining_amount, currency_code, issue_date, due_date, status, note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        id,
        input.contactId,
        input.direction,
        input.title,
        input.description,
        input.principalAmount,
        snapshot.paidAmount,
        snapshot.remainingAmount,
        input.currencyCode,
        input.issueDate,
        input.dueDate,
        snapshot.status,
        input.note,
        now,
        now
      );

      await writeActivityLog({ database, entityType: 'debt', entityId: id, action: 'created', payload: input });
      await upsertSyncMetadata({ database, entityType: 'debt', entityId: id });
      deps.loggerService.info('Debt created', { id });

      return {
        id,
        ...input,
        paidAmount: snapshot.paidAmount,
        remainingAmount: snapshot.remainingAmount,
        status: snapshot.status,
        createdAt: now,
        updatedAt: now
      };
    },
    update: async (id: string, input: UpdateDebtInput): Promise<DebtRecord | null> => {
      const database = await deps.databaseService.getDatabase();
      const current = await database.getFirstAsync<DebtRow>('SELECT * FROM debts WHERE id = ?', id);

      if (!current) {
        return null;
      }

      const base = mapDebtRow(current);
      const nextBase = {
        ...base,
        ...input,
        paidAmount: input.paidAmount ?? base.paidAmount
      };
      const snapshot = calculateDebtSnapshot({
        principalAmount: nextBase.principalAmount,
        paidAmount: nextBase.paidAmount,
        dueDate: nextBase.dueDate
      });
      const updatedAt = getNowIsoString();

      await database.runAsync(
        'UPDATE debts SET contact_id = ?, direction = ?, title = ?, description = ?, principal_amount = ?, paid_amount = ?, remaining_amount = ?, currency_code = ?, issue_date = ?, due_date = ?, status = ?, note = ?, updated_at = ? WHERE id = ?',
        nextBase.contactId,
        nextBase.direction,
        nextBase.title,
        nextBase.description,
        nextBase.principalAmount,
        snapshot.paidAmount,
        snapshot.remainingAmount,
        nextBase.currencyCode,
        nextBase.issueDate,
        nextBase.dueDate,
        snapshot.status,
        nextBase.note,
        updatedAt,
        id
      );

      await writeActivityLog({ database, entityType: 'debt', entityId: id, action: 'updated', payload: input });
      await upsertSyncMetadata({ database, entityType: 'debt', entityId: id });

      return {
        ...nextBase,
        id,
        paidAmount: snapshot.paidAmount,
        remainingAmount: snapshot.remainingAmount,
        status: snapshot.status,
        createdAt: base.createdAt,
        updatedAt
      };
    },
    remove: async (id: string): Promise<void> => {
      const database = await deps.databaseService.getDatabase();
      await database.runAsync('DELETE FROM debts WHERE id = ?', id);
      await writeActivityLog({ database, entityType: 'debt', entityId: id, action: 'deleted' });
      await upsertSyncMetadata({ database, entityType: 'debt', entityId: id });
    },
    recomputeDebtSnapshot: async (debtId: string): Promise<DebtRecord | null> => {
      const database = await deps.databaseService.getDatabase();
      const debt = await database.getFirstAsync<DebtRow>('SELECT * FROM debts WHERE id = ?', debtId);

      if (!debt) {
        return null;
      }

      const paymentTotalRow = await database.getFirstAsync<{ total: number | null }>(
        'SELECT SUM(amount) as total FROM payments WHERE debt_id = ?',
        debtId
      );
      const snapshot = calculateDebtSnapshot({
        principalAmount: debt.principal_amount,
        paidAmount: paymentTotalRow?.total ?? 0,
        dueDate: debt.due_date
      });
      const updatedAt = getNowIsoString();

      await database.runAsync(
        'UPDATE debts SET paid_amount = ?, remaining_amount = ?, status = ?, updated_at = ? WHERE id = ?',
        snapshot.paidAmount,
        snapshot.remainingAmount,
        snapshot.status,
        updatedAt,
        debtId
      );

      return {
        ...mapDebtRow(debt),
        paidAmount: snapshot.paidAmount,
        remainingAmount: snapshot.remainingAmount,
        status: snapshot.status,
        updatedAt
      };
    }
  };
}
