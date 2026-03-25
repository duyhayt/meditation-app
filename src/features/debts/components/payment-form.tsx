import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/hooks/useTheme';

export type PaymentFormValues = {
  amount: string;
  paymentDate: string;
  note?: string;
};

type PaymentFormProps = {
  onSubmit: (values: PaymentFormValues) => Promise<void> | void;
  loading?: boolean;
};

export function PaymentForm({ onSubmit, loading = false }: PaymentFormProps): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const schema = useMemo(
    () =>
      z.object({
        amount: z.string().trim().min(1, t('debts.validationPaymentAmount')),
        paymentDate: z.string().trim().min(1, t('debts.validationPaymentDate')),
        note: z.string().trim().optional()
      }),
    [t]
  );
  const { control, handleSubmit } = useForm<PaymentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: '',
      paymentDate: new Date().toISOString().slice(0, 10),
      note: ''
    }
  });

  return (
    <>
      <Input control={control} name="amount" label={t('debts.paymentFormAmount')} placeholder="1000000" />
      <Input control={control} name="paymentDate" label={t('debts.paymentFormDate')} placeholder="YYYY-MM-DD" />
      <Input control={control} name="note" label={t('debts.paymentFormNote')} placeholder={t('debts.paymentFormPlaceholderNote')} multiline />
      <Button
        label={t('debts.paymentFormSave')}
        loading={loading}
        style={{ marginTop: theme.spacing.md }}
        onPress={handleSubmit(async (values) => {
          await onSubmit(values);
        })}
      />
    </>
  );
}
