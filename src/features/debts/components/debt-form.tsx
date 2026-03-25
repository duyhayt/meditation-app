import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import type { ContactRecord, DebtDirection } from '@/domain/database';
import { useTheme } from '@/hooks/useTheme';

export type DebtFormValues = {
  contactId: string;
  direction: DebtDirection;
  title: string;
  description?: string;
  principalAmount: string;
  issueDate: string;
  dueDate?: string;
  note?: string;
};

type DebtFormProps = {
  contacts: ContactRecord[];
  defaultValues?: Partial<DebtFormValues>;
  submitLabel: string;
  onAddContact?: () => void;
  onSubmit: (values: DebtFormValues) => Promise<void> | void;
  loading?: boolean;
};

const directionOptions: Array<{ label: string; value: DebtDirection }> = [
  { label: 'Phải thu', value: 'lend' },
  { label: 'Phải trả', value: 'borrow' }
];

export function DebtForm({
  contacts,
  defaultValues,
  submitLabel,
  onAddContact,
  onSubmit,
  loading = false
}: DebtFormProps): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const schema = useMemo(
    () =>
      z.object({
        contactId: z.string().min(1, t('debts.validationContact')),
        direction: z.enum(['lend', 'borrow']),
        title: z.string().trim().min(2, t('debts.validationTitle')),
        description: z.string().trim().optional(),
        principalAmount: z.string().trim().min(1, t('debts.validationAmount')),
        issueDate: z.string().trim().min(1, t('debts.validationIssueDate')),
        dueDate: z.string().trim().optional(),
        note: z.string().trim().optional()
      }),
    [t]
  );
  const { control, handleSubmit } = useForm<DebtFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      contactId: defaultValues?.contactId ?? contacts[0]?.id ?? '',
      direction: defaultValues?.direction ?? 'lend',
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      principalAmount: defaultValues?.principalAmount ?? '',
      issueDate: defaultValues?.issueDate ?? new Date().toISOString().slice(0, 10),
      dueDate: defaultValues?.dueDate ?? '',
      note: defaultValues?.note ?? ''
    }
  });

  return (
    <>
      <Controller
        control={control}
        name="contactId"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <SelectField
            label={t('debts.formContact')}
            value={value ?? ""}
            onChange={onChange}
            errorMessage={error?.message}
            options={contacts.map((contact) => ({ label: contact.name, value: contact.id }))}
          />
        )}
      />
      {!contacts.length && onAddContact ? (
        <Button label={t('debts.noContactPrompt')} variant="secondary" onPress={onAddContact} />
      ) : null}
      <Controller
        control={control}
        name="direction"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <SelectField
            label={t('debts.formDirection')}
            value={value ?? ""}
            onChange={onChange}
            errorMessage={error?.message}
            options={directionOptions}
          />
        )}
      />
      <Input control={control} name="title" label={t('debts.formTitle')} placeholder={t('debts.formPlaceholderTitle')} />
      <Input control={control} name="description" label={t('debts.formDescription')} placeholder={t('debts.formPlaceholderDescription')} />
      <Input control={control} name="principalAmount" label={t('debts.formPrincipalAmount')} placeholder="5000000" />
      <Controller
        control={control}
        name="issueDate"
        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
          <TextField
            label={t('debts.formIssueDate')}
            value={value ?? ""}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="YYYY-MM-DD"
            errorMessage={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="dueDate"
        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
          <TextField
            label={t('debts.formDueDate')}
            value={value ?? ""}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="YYYY-MM-DD"
            errorMessage={error?.message}
          />
        )}
      />
      <Input control={control} name="note" label={t('debts.formNote')} placeholder={t('debts.formPlaceholderNote')} multiline />
      <View style={{ marginTop: theme.spacing.md }}>
        <Button
          label={submitLabel}
          loading={loading}
          onPress={handleSubmit(async (values) => {
            await onSubmit(values);
          })}
        />
      </View>
    </>
  );
}
