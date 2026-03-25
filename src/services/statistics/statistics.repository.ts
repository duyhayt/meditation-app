import type { DebtSummary } from '@/domain/database';
import type { DatabaseService, DebtStatusBreakdown } from '@/services/di/types';

export function createStatisticsRepository(deps: { databaseService: DatabaseService }) {
  return {
    getSummary: async (): Promise<DebtSummary> => {
      const database = await deps.databaseService.getDatabase();
      const row = await database.getFirstAsync<{
        total_receivable: number | null;
        total_payable: number | null;
        total_collected: number | null;
        total_paid: number | null;
        overdue_receivable: number | null;
        overdue_payable: number | null;
        debt_count: number | null;
        overdue_count: number | null;
      }>(
        `
          SELECT
            SUM(CASE WHEN direction = 'lend' THEN remaining_amount ELSE 0 END) as total_receivable,
            SUM(CASE WHEN direction = 'borrow' THEN remaining_amount ELSE 0 END) as total_payable,
            SUM(CASE WHEN direction = 'lend' THEN paid_amount ELSE 0 END) as total_collected,
            SUM(CASE WHEN direction = 'borrow' THEN paid_amount ELSE 0 END) as total_paid,
            SUM(CASE WHEN direction = 'lend' AND status = 'overdue' THEN remaining_amount ELSE 0 END) as overdue_receivable,
            SUM(CASE WHEN direction = 'borrow' AND status = 'overdue' THEN remaining_amount ELSE 0 END) as overdue_payable,
            COUNT(*) as debt_count,
            SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdue_count
          FROM debts
        `
      );

      return {
        totalReceivable: row?.total_receivable ?? 0,
        totalPayable: row?.total_payable ?? 0,
        totalCollected: row?.total_collected ?? 0,
        totalPaid: row?.total_paid ?? 0,
        overdueReceivable: row?.overdue_receivable ?? 0,
        overduePayable: row?.overdue_payable ?? 0,
        debtCount: row?.debt_count ?? 0,
        overdueCount: row?.overdue_count ?? 0
      };
    },
    getStatusBreakdown: async (): Promise<DebtStatusBreakdown> => {
      const database = await deps.databaseService.getDatabase();
      const row = await database.getFirstAsync<{
        unpaid_count: number | null;
        partial_count: number | null;
        paid_count: number | null;
        overdue_count: number | null;
      }>(
        `
          SELECT
            SUM(CASE WHEN status = 'unpaid' THEN 1 ELSE 0 END) as unpaid_count,
            SUM(CASE WHEN status = 'partial' THEN 1 ELSE 0 END) as partial_count,
            SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_count,
            SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdue_count
          FROM debts
        `
      );

      return {
        unpaidCount: row?.unpaid_count ?? 0,
        partialCount: row?.partial_count ?? 0,
        paidCount: row?.paid_count ?? 0,
        overdueCount: row?.overdue_count ?? 0
      };
    }
  };
}
