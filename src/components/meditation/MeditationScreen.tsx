import { type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { useTheme } from '@/hooks/useTheme';

import { AppText } from '../common/AppText';

type MeditationScreenProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  subtitle: string;
  scrollable?: boolean;
}>;

export function MeditationScreen({
  children,
  eyebrow,
  title,
  subtitle,
  scrollable = true
}: MeditationScreenProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Screen scrollable={scrollable} contentStyle={styles.content}>
      <View
        style={[
          styles.backdropOne,
          { backgroundColor: theme.colors.heroStart, borderRadius: theme.radius.pill }
        ]}
      />
      <View
        style={[
          styles.backdropTwo,
          { backgroundColor: theme.colors.heroEnd, borderRadius: theme.radius.pill }
        ]}
      />
      <View
        style={[
          styles.hero,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.xxl,
            padding: theme.spacing.xxl
          }
        ]}
      >
        {eyebrow ? (
          <AppText variant="label" color={theme.colors.primary}>
            {eyebrow}
          </AppText>
        ) : null}
        <AppText variant="heading1">{title}</AppText>
        <AppText variant="bodySmall">{subtitle}</AppText>
      </View>
      <View style={styles.body}>{children}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20
  },
  hero: {
    borderWidth: 1,
    overflow: 'hidden'
  },
  body: {
    gap: 16
  },
  backdropOne: {
    position: 'absolute',
    top: 40,
    right: 12,
    width: 120,
    height: 120,
    opacity: 0.35
  },
  backdropTwo: {
    position: 'absolute',
    top: 120,
    left: 20,
    width: 88,
    height: 88,
    opacity: 0.25
  }
});
