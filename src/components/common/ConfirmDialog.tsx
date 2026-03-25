import { View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { AppButton } from './AppButton';
import { AppModal } from './AppModal';
import { AppText } from './AppText';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Hủy',
  tone = 'default',
  loading = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <AppModal visible={visible} onClose={onCancel}>
      <View style={{ gap: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.sm }}>
          <AppText variant="heading2">{title}</AppText>
          <AppText variant="bodySmall">{description}</AppText>
        </View>
        <View style={{ gap: theme.spacing.sm }}>
          <AppButton
            label={confirmLabel}
            variant={tone === 'danger' ? 'danger' : 'primary'}
            loading={loading}
            onPress={onConfirm}
          />
          <AppButton label={cancelLabel} variant="outline" onPress={onCancel} />
        </View>
      </View>
    </AppModal>
  );
}
