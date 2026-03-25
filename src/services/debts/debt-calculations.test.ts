import { calculateDebtSnapshot, deriveDebtStatus } from './debt-calculations';

describe('debt calculations', () => {
  it('marks debt as paid when fully covered', () => {
    expect(
      deriveDebtStatus({
        principalAmount: 1000,
        paidAmount: 1000,
        dueDate: null,
        now: new Date('2026-03-24T00:00:00.000Z')
      })
    ).toBe('paid');
  });

  it('marks debt as overdue when unpaid past due date', () => {
    expect(
      calculateDebtSnapshot({
        principalAmount: 1000,
        paidAmount: 0,
        dueDate: '2026-03-20T00:00:00.000Z',
        now: new Date('2026-03-24T00:00:00.000Z')
      })
    ).toEqual({
      paidAmount: 0,
      remainingAmount: 1000,
      status: 'overdue'
    });
  });

  it('marks debt as partial when part of principal is paid', () => {
    expect(
      calculateDebtSnapshot({
        principalAmount: 1000,
        paidAmount: 250,
        dueDate: '2026-03-30T00:00:00.000Z',
        now: new Date('2026-03-24T00:00:00.000Z')
      })
    ).toEqual({
      paidAmount: 250,
      remainingAmount: 750,
      status: 'partial'
    });
  });
});
