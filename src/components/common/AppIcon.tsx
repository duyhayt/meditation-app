import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/useTheme';
import { appIconMap, type AppIconName } from '@/theme';

type AppIconProps = {
  name: AppIconName;
  size?: number;
  color?: string;
};

export function AppIcon({ name, size, color }: AppIconProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <MaterialCommunityIcons
      name={appIconMap[name]}
      size={size ?? theme.iconSize.md}
      color={color ?? theme.colors.icon}
    />
  );
}
