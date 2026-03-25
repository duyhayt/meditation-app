import type { LoggerService } from '@/services/di/types';

export function createLoggerService(): LoggerService {
  return {
    info: (...args: unknown[]) => {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('[INFO]', ...args);
      }
    },
    error: (...args: unknown[]) => {
      // eslint-disable-next-line no-console
      console.error('[ERROR]', ...args);
    }
  };
}
