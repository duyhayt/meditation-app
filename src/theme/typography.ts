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
    fontSize: 32,
    lineHeight: 40,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.8
  },
  heading1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.5
  },
  heading2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.3
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.1
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: fontWeight.medium
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: fontWeight.regular
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: fontWeight.regular
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeight.medium
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const
  },
  button: {
    fontSize: 15,
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
    lg: 18,
    xl: 22,
    xxl: 32
  },
  lineHeight: {
    xs: 16,
    sm: 18,
    md: 22,
    lg: 24,
    xl: 28,
    xxl: 40
  },
  weight: fontWeight
} as const;
