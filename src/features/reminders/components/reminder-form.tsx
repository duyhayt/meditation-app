import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type Control, type Resolver } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SelectField } from '@/components/ui/SelectField';
import type { DebtRecord } from '@/domain/database';
import { useTheme } from '@/hooks/useTheme';

export type ReminderFormValues = {
  debtId: string;
  remindAt: string;
  note: string;
  status: 'pending' | 'sent' | 'dismissed' | 'completed';
  isEnabled: 'enabled' | 'disabled';
};

const ReminderFormSchema = z.object({
  debtId: z.string().min(1, 'Vui lòng chọn khoản nợ'),
  remindAt: z.string().trim().min(1, 'Vui lòng nhập thời gian nhắc'),
  note: z.string().trim(),
  status: z.enum(['pending', 'sent', 'dismissed', 'completed']),
  isEnabled: z.enum(['enabled', 'disabled'])
});

type ReminderFormProps = {
  debts: DebtRecord[];
  defaultValues?: Partial<ReminderFormValues>;
  submitLabel: string;
  onSubmit: (values: ReminderFormValues) => Promise<void> | void;
  loading?: boolean;
};

export function ReminderForm({
  debts,
  defaultValues,
  submitLabel,
  onSubmit,
  loading = false
}: ReminderFormProps): React.JSX.Element {
  const theme = useTheme();
  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(ReminderFormSchema) as Resolver<ReminderFormValues>,
    defaultValues: {
      debtId: defaultValues?.debtId ?? debts[0]?.id ?? '',
      remindAt: defaultValues?.remindAt ?? new Date().toISOString().slice(0, 16),
      note: defaultValues?.note ?? '',
      status: defaultValues?.status ?? 'pending',
      isEnabled: defaultValues?.isEnabled ?? 'enabled'
    }
  });
  const control = form.control as Control<ReminderFormValues>;

  return (
    <>
      <Controller
        control={control}
        name="debtId"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <SelectField
            label="Khoản nợ"
            value={value}
            onChange={onChange}
            errorMessage={error?.message}
            options={debts.map((debt) => ({ label: debt.title, value: debt.id }))}
          />
        )}
      />
      <Input control={control} name="remindAt" label="Nhắc vào lúc" placeholder="YYYY-MM-DDTHH:mm" />
      <Input control={control} name="note" label="Ghi chú" placeholder="Nội dung nhắc nợ" multiline />
      <Controller
        control={control}
        name="isEnabled"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <SelectField
            label="Trạng thái"
            value={value}
            onChange={onChange}
            errorMessage={error?.message}
            options={[
              { label: 'Đang bật', value: 'enabled' },
              { label: 'Đang tắt', value: 'disabled' }
            ]}
          />
        )}
      />
      <Button
        label={submitLabel}
        loading={loading}
        style={{ marginTop: theme.spacing.md }}
        onPress={form.handleSubmit(async (values) => {
          await onSubmit(values);
        })}
      />
    </>
  );
}
