import type { SQLiteDatabase } from 'expo-sqlite';

import { createPaymentsRepository } from './payments.repository';

describe('payments repository', () => {
  it('creates payment and recomputes debt snapshot', async () => {
    const runAsync = vi.fn(async () => ({ lastInsertRowId: 0, changes: 1 }));
    const fakeDatabase = {
      execAsync: vi.fn(async () => undefined),
      getFirstAsync: vi.fn(async () => null),
      getAllAsync: vi.fn(async () => []),
      runAsync
    } as unknown as SQLiteDatabase;
    const debtsRepository = {
      recomputeDebtSnapshot: vi.fn(async () => null)
    };
    const repository = createPaymentsRepository({
      databaseService: {
        initialize: async () => undefined,
        getDatabase: async () => fakeDatabase,
        getSchemaVersion: async () => 1
      },
      debtsRepository: debtsRepository as never,
      loggerService: {
        info: vi.fn(),
        error: vi.fn()
      }
    });

    const result = await repository.create({
      debtId: 'debt_1',
      amount: 500,
      paymentDate: '2026-03-24T00:00:00.000Z',
      note: 'partial payment'
    });

    expect(runAsync).toHaveBeenCalled();
    expect(debtsRepository.recomputeDebtSnapshot).toHaveBeenCalledWith('debt_1');
    expect(result.amount).toBe(500);
    expect(result.debtId).toBe('debt_1');
  });
});
