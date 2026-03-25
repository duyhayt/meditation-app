import type { TextProps as RNTextProps } from 'react-native';

import { AppText } from '@/components/common/AppText';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'bodyStrong' | 'bodySmall' | 'caption' | 'label';

type TextProps = RNTextProps & {
  variant?: Variant;
  color?: string;
};

const variantMap = {
  display: 'display',
  title: 'title',
  heading: 'heading2',
  body: 'body',
  bodyStrong: 'bodyStrong',
  bodySmall: 'bodySmall',
  caption: 'caption',
  label: 'label'
} as const;

export function Text({ variant = 'body', color, ...props }: TextProps): React.JSX.Element {
  return <AppText variant={variantMap[variant]} color={color} {...props} />;
}
