import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

import { AppButton } from '@/components/common/AppButton';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...props
}: ButtonProps): React.JSX.Element {
  return <AppButton label={label} variant={variant} loading={loading} disabled={disabled} style={style} {...props} />;
}
