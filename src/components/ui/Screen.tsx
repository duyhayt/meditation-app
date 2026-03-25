import { type PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { AppScreen } from '@/components/common/AppScreen';

type ScreenProps = PropsWithChildren<{
  centered?: boolean;
  scrollable?: boolean;
  keyboardAware?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  safeAreaEdges?: Array<'top' | 'right' | 'bottom' | 'left'>;
}>;

export function Screen({
  children,
  centered = false,
  scrollable = false,
  keyboardAware = true,
  contentStyle,
  safeAreaEdges
}: ScreenProps): React.JSX.Element {
  return (
    <AppScreen
      centered={centered}
      scrollable={scrollable}
      keyboardAware={keyboardAware}
      contentStyle={contentStyle}
      safeAreaEdges={safeAreaEdges}
    >
      {children}
    </AppScreen>
  );
}
