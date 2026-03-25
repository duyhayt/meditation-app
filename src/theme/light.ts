import { lightColors } from './colors';
import { iconSize } from './icon';
import { motion } from './motion';
import { radius } from './radius';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';

export const lightTheme = {
  mode: 'light',
  colors: lightColors,
  spacing,
  radius,
  typography,
  shadows,
  iconSize,
  motion
} as const;
