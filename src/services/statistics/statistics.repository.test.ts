import { createStatisticsRepository } from './statistics.repository';

describe('statistics repository', () => {
  it('returns summary totals with zero fallbacks', async () => {
    const getFirstAsync = vi.fn(async (query: string) => {
      if (query.includes('total_receivable')) {
        return {
          total_receivable: 1200,
          total_payable: 900,
          total_collected: 300,
          total_paid: 250,
          overdue_receivable: 100,
          overdue_payable: 50,
          debt_count: 4,
          overdue_count: 1
        };
      }

      return {
        unpaid_count: 1,
        partial_count: 2,
        paid_count: 1,
        overdue_count: 1
      };
    });

    const repository = createStatisticsRepository({
      databaseService: {
        initialize: async () => undefined,
        getDatabase: async () =>
          ({
            getFirstAsync,
            getAllAsync: vi.fn(),
            runAsync: vi.fn(),
            execAsync: vi.fn()
          }) as never,
        getSchemaVersion: async () => 2
      }
    });

    await expect(repository.getSummary()).resolves.toEqual({
      totalReceivable: 1200,
      totalPayable: 900,
      totalCollected: 300,
      totalPaid: 250,
      overdueReceivable: 100,
      overduePayable: 50,
      debtCount: 4,
      overdueCount: 1
    });

    await expect(repository.getStatusBreakdown()).resolves.toEqual({
      unpaidCount: 1,
      partialCount: 2,
      paidCount: 1,
      overdueCount: 1
    });
  });
});
