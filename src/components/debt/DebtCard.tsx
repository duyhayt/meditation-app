import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { MoneyText } from '@/components/common/MoneyText';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { ContactRecord, DebtRecord } from '@/domain/database';
import { useTheme } from '@/hooks/useTheme';

type DebtCardProps = {
  debt: DebtRecord;
  contact?: ContactRecord;
  onPress?: () => void;
};

function getProgress(debt: DebtRecord): number {
  if (debt.principalAmount <= 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, debt.paidAmount / debt.principalAmount));
}

export function DebtCard({ debt, contact, onPress }: DebtCardProps): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const progress = getProgress(debt);
  const isLend = debt.direction === 'lend';
  const toneColor = isLend ? theme.colors.receivable : theme.colors.payable;
  const toneSoft = isLend ? theme.colors.receivableSoft : theme.colors.payableSoft;

  return (
    <AppCard pressable={Boolean(onPress)} onPress={onPress} style={{ marginBottom: theme.spacing.md }}>
      <View style={{ gap: theme.spacing.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.md }}>
          <View style={{ flex: 1, flexDirection: 'row', gap: theme.spacing.md }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: theme.radius.lg,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: toneSoft
              }}
            >
              <AppIcon
                name={isLend ? 'debtLend' : 'debtBorrow'}
                size={theme.iconSize.lg}
                color={toneColor}
              />
            </View>
            <View style={{ flex: 1, gap: theme.spacing.xs }}>
              <AppText variant="title">{debt.title}</AppText>
              <AppText variant="bodySmall">{contact?.name ?? t('debts.noContact')}</AppText>
            </View>
          </View>
          <StatusBadge
            status={debt.status}
            label={
              debt.status === 'paid'
                ? t('debts.statusPaid')
                : debt.status === 'partial'
                  ? t('debts.statusPartial')
                  : debt.status === 'overdue'
                    ? t('debts.statusOverdue')
                    : t('debts.statusUnpaid')
            }
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.md }}>
          <View style={{ flex: 1, gap: theme.spacing.xs }}>
            <AppText variant="label">{isLend ? t('debts.receivable') : t('debts.payable')}</AppText>
            <MoneyText amount={debt.principalAmount} currencyCode={debt.currencyCode} color={toneColor} />
          </View>
          <View style={{ flex: 1, gap: theme.spacing.xs }}>
            <AppText variant="label">{t('debts.remaining')}</AppText>
            <MoneyText amount={debt.remainingAmount} currencyCode={debt.currencyCode} />
          </View>
        </View>

        <View style={{ gap: theme.spacing.sm }}>
          <View
            style={{
              height: 8,
              borderRadius: theme.radius.pill,
              overflow: 'hidden',
              backgroundColor: theme.colors.surfaceSecondary
            }}
          >
            <View
              style={{
                width: `${progress * 100}%`,
                height: '100%',
                borderRadius: theme.radius.pill,
                backgroundColor: toneColor
              }}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.md }}>
            <AppText variant="caption">
              {t('debts.paid')}: {new Intl.NumberFormat('vi-VN').format(debt.paidAmount)}
            </AppText>
            <AppText variant="caption">
              {t('debts.dueDate')}: {debt.dueDate ?? t('debts.noDueDate')}
            </AppText>
          </View>
        </View>
      </View>
    </AppCard>
  );
}
