import { AppError } from './errors';

describe('AppError', () => {
  it('keeps code and status metadata', () => {
    const error = new AppError('Request failed', 'HTTP_ERROR', 500);

    expect(error.message).toBe('Request failed');
    expect(error.code).toBe('HTTP_ERROR');
    expect(error.status).toBe(500);
  });
});
