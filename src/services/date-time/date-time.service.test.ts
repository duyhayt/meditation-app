import { createDateTimeService } from './date-time.service';

describe('createDateTimeService', () => {
  it('formats ISO date with locale', () => {
    const service = createDateTimeService();
    const formatted = service.formatDateTime('2026-01-03T10:30:00.000Z', 'en');

    expect(formatted.length).toBeGreaterThan(0);
  });
});
