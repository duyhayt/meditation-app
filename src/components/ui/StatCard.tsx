import { StatisticCard } from '@/components/statistics/StatisticCard';

type StatCardProps = {
  label: string;
  value: string;
  tone?: 'default' | 'lend' | 'borrow' | 'paid' | 'overdue';
};

export function StatCard({ label, value, tone = 'default' }: StatCardProps): React.JSX.Element {
  const mappedTone =
    tone === 'lend'
      ? 'receivable'
      : tone === 'borrow'
        ? 'payable'
        : tone === 'paid'
          ? 'settled'
          : tone === 'overdue'
            ? 'overdue'
            : 'default';

  return <StatisticCard label={label} value={value} tone={mappedTone} />;
}
