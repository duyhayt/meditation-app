import type { DateTimeService } from '@/services/di/types';

const formatters = new Map<string, Intl.DateTimeFormat>();

function getFormatter(locale: string): Intl.DateTimeFormat {
  const formatter = formatters.get(locale);

  if (formatter) {
    return formatter;
  }

  const nextFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  formatters.set(locale, nextFormatter);
  return nextFormatter;
}

export function createDateTimeService(): DateTimeService {
  return {
    formatDateTime: (value: string, locale = 'en') => getFormatter(locale).format(new Date(value))
  };
}
