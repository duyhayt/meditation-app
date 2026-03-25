import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/hooks/useTheme';

export type ContactFormValues = {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
};

type ContactFormProps = {
  defaultValues?: Partial<ContactFormValues>;
  submitLabel: string;
  onSubmit: (values: ContactFormValues) => Promise<void> | void;
  loading?: boolean;
};

export function ContactForm({ defaultValues, submitLabel, onSubmit, loading = false }: ContactFormProps): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t('contacts.validationName')),
        phone: z.string().trim().optional(),
        email: z.union([z.string().trim().email(t('contacts.validationEmail')), z.literal('')]).optional(),
        address: z.string().trim().optional(),
        note: z.string().trim().optional()
      }),
    [t]
  );
  const { control, handleSubmit } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      phone: defaultValues?.phone ?? '',
      email: defaultValues?.email ?? '',
      address: defaultValues?.address ?? '',
      note: defaultValues?.note ?? ''
    }
  });

  return (
    <>
      <Input control={control} name="name" label={t('contacts.formName')} placeholder={t('contacts.formPlaceholderName')} />
      <Input control={control} name="phone" label={t('contacts.formPhone')} placeholder={t('contacts.formPlaceholderPhone')} />
      <Input control={control} name="email" label={t('contacts.email')} placeholder="name@example.com" />
      <Input control={control} name="address" label={t('contacts.formAddress')} placeholder={t('contacts.formPlaceholderAddress')} />
      <Input control={control} name="note" label={t('contacts.formNote')} placeholder={t('contacts.formPlaceholderNote')} multiline />
      <Button
        label={submitLabel}
        loading={loading}
        style={{ marginTop: theme.spacing.md }}
        onPress={handleSubmit(async (values) => {
          await onSubmit(values);
        })}
      />
    </>
  );
}
