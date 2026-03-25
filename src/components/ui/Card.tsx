import { type PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { AppCard } from '@/components/common/AppCard';

type CardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
}>;

export function Card({ children, style, elevated = false }: CardProps): React.JSX.Element {
  return (
    <AppCard style={style} elevated={elevated}>
      {children}
    </AppCard>
  );
}
