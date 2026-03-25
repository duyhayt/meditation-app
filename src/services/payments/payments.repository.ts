import type { PaymentRecord } from '@/domain/database';
import { createId, getNowIsoString } from '@/services/db/db.utils';
import { upsertSyncMetadata, writeActivityLog } from '@/services/db/internal-metadata';
import type { DatabaseService, DebtsRepository, LoggerService } from '@/services/di/types';

type PaymentRow = {
  id: string;
  debt_id: string;
  amount: number;
  payment_date: string;
  note: string | null;
  created_at: string;
  updated_at: string;
};

type CreatePaymentInput = Omit<PaymentRecord, 'id' | 'createdAt' | 'updatedAt'>;

function mapPaymentRow(row: PaymentRow): PaymentRecord {
  return {
    id: row.id,
    debtId: row.debt_id,
    amount: row.amount,
    paymentDate: row.payment_date,
    note: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function createPaymentsRepository(deps: {
  databaseService: DatabaseService;
  debtsRepository: DebtsRepository;
  loggerService: LoggerService;
}) {
  return {
    listByDebtId: async (debtId: string): Promise<PaymentRecord[]> => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<PaymentRow>(
        'SELECT * FROM payments WHERE debt_id = ? ORDER BY payment_date DESC, created_at DESC',
        debtId
      );
      return rows.map(mapPaymentRow);
    },
    create: async (input: CreatePaymentInput): Promise<PaymentRecord> => {
      const database = await deps.databaseService.getDatabase();
      const id = createId('payment');
      const now = getNowIsoString();

      await database.runAsync(
        'INSERT INTO payments (id, debt_id, amount, payment_date, note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        id,
        input.debtId,
        input.amount,
        input.paymentDate,
        input.note,
        now,
        now
      );

      await deps.debtsRepository.recomputeDebtSnapshot(input.debtId);
      await writeActivityLog({ database, entityType: 'payment', entityId: id, action: 'created', payload: input });
      await upsertSyncMetadata({ database, entityType: 'payment', entityId: id });
      deps.loggerService.info('Payment created', { id, debtId: input.debtId });

      return {
        id,
        ...input,
        createdAt: now,
        updatedAt: now
      };
    }
  };
}
