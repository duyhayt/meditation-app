import { View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { MoneyText } from '@/components/common/MoneyText';
import { useTheme } from '@/hooks/useTheme';

type StatisticCardProps = {
  label: string;
  amount?: number;
  value?: string;
  tone?: 'default' | 'receivable' | 'payable' | 'settled' | 'overdue';
};

export function StatisticCard({
  label,
  amount,
  value,
  tone = 'default'
}: StatisticCardProps): React.JSX.Element {
  const theme = useTheme();

  const toneStyles = {
    default: {
      backgroundColor: theme.colors.surfaceSecondary,
      color: theme.colors.icon
    },
    receivable: {
      backgroundColor: theme.colors.receivableSoft,
      color: theme.colors.receivable
    },
    payable: {
      backgroundColor: theme.colors.payableSoft,
      color: theme.colors.payable
    },
    settled: {
      backgroundColor: theme.colors.settledSoft,
      color: theme.colors.settled
    },
    overdue: {
      backgroundColor: theme.colors.overdueSoft,
      color: theme.colors.overdue
    }
  }[tone];

  return (
    <AppCard style={{ flex: 1, minWidth: 158 }}>
      <View style={{ gap: theme.spacing.md }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: theme.radius.lg,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: toneStyles.backgroundColor
          }}
        >
          <AppIcon
            name={
              tone === 'receivable'
                ? 'debtLend'
                : tone === 'payable'
                  ? 'debtBorrow'
                  : tone === 'overdue'
                    ? 'overdue'
                    : 'statistics'
            }
            color={toneStyles.color}
          />
        </View>
        <View style={{ gap: theme.spacing.xs }}>
          <AppText variant="label">{label}</AppText>
          {typeof amount === 'number' ? (
            <MoneyText amount={amount} variant="moneyMedium" color={toneStyles.color} />
          ) : (
            <AppText variant="heading2" color={toneStyles.color}>
              {value ?? '-'}
            </AppText>
          )}
        </View>
      </View>
    </AppCard>
  );
}
