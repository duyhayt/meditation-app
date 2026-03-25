import { View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

type InfoRowProps = {
  label: string;
  value: string;
  tone?: string;
};

export function InfoRow({ label, value, tone }: InfoRowProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <Text variant="label">{label}</Text>
      <Text variant="bodyStrong" color={tone ?? theme.colors.text}>
        {value}
      </Text>
    </View>
  );
}
