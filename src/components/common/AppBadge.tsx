import { View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { AppText } from './AppText';

type AppBadgeProps = {
  label: string;
  backgroundColor: string;
  color: string;
};

export function AppBadge({ label, backgroundColor, color }: AppBadgeProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        borderRadius: theme.radius.pill,
        paddingHorizontal: theme.spacing.sm + 2,
        paddingVertical: theme.spacing.xs + 2,
        backgroundColor
      }}
    >
      <AppText variant="caption" color={color}>
        {label}
      </AppText>
    </View>
  );
}
