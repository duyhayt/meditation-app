import { usePreferencesStore } from '@/state/preferences.store';

import { AppText } from './AppText';

type MoneyTextProps = {
  amount: number;
  currencyCode?: string;
  variant?: 'moneyLarge' | 'moneyMedium' | 'title';
  color?: string;
};

export function formatMoney(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0
  }).format(amount);
}

export function MoneyText({
  amount,
  currencyCode,
  variant = 'moneyMedium',
  color
}: MoneyTextProps): React.JSX.Element {
  const fallbackCurrencyCode = usePreferencesStore((state) => state.currencyCode);

  return (
    <AppText variant={variant} color={color}>
      {formatMoney(amount, currencyCode ?? fallbackCurrencyCode)}
    </AppText>
  );
}
