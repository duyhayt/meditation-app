export const fontFamily = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System'
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700'
} as const;

export const typography = {
  display: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: fontWeight.bold,
    letterSpacing: -1
  },
  heading1: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.7
  },
  heading2: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.4
  },
  title: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.1
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: fontWeight.medium
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: fontWeight.regular
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: fontWeight.regular
  },
  caption: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: fontWeight.medium
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: fontWeight.semibold,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: fontWeight.semibold
  },
  moneyLarge: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.4
  },
  moneyMedium: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.2
  },
  size: {
    xs: 12,
    sm: 13,
    md: 15,
    lg: 19,
    xl: 24,
    xxl: 36
  },
  lineHeight: {
    xs: 17,
    sm: 19,
    md: 23,
    lg: 24,
    xl: 30,
    xxl: 42
  },
  weight: fontWeight
} as const;
