import { type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/common/AppHeader';
import { HeroCard } from '@/components/common/HeroCard';
import { Screen } from '@/components/ui/Screen';
import { useTheme } from '@/hooks/useTheme';

type MeditationScreenProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  scrollable?: boolean;
  showBackButton?: boolean;
  heroImageUri?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroEyebrow?: string;
  heroPrimaryActionLabel?: string;
  heroSecondaryLabel?: string;
  onHeroPrimaryAction?: () => void;
  decorativeBackground?: boolean;
  heroSize?: 'default' | 'compact';
}>;

export function MeditationScreen({
  children,
  eyebrow,
  title,
  subtitle,
  scrollable = true,
  showBackButton = false,
  heroImageUri,
  heroTitle,
  heroSubtitle,
  heroEyebrow,
  heroPrimaryActionLabel,
  heroSecondaryLabel,
  onHeroPrimaryAction,
  decorativeBackground = true,
  heroSize = 'default'
}: MeditationScreenProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Screen scrollable={scrollable} contentStyle={styles.content} safeAreaEdges={['top', 'left', 'right', 'bottom']}>
      {decorativeBackground ? (
        <>
          <View
            style={[
              styles.backdropOne,
              { backgroundColor: theme.colors.heroGlow, borderRadius: theme.radius.pill }
            ]}
          />
          <View
            style={[
              styles.backdropTwo,
              { backgroundColor: theme.colors.heroAccent, borderRadius: theme.radius.pill }
            ]}
          />
        </>
      ) : null}

      <AppHeader title={title} eyebrow={eyebrow} subtitle={subtitle} showBackButton={showBackButton} />

      {heroImageUri && heroTitle && heroSubtitle ? (
        <HeroCard
          imageUri={heroImageUri}
          eyebrow={heroEyebrow ?? eyebrow ?? title}
          title={heroTitle}
          subtitle={heroSubtitle}
          size={heroSize}
          primaryActionLabel={heroPrimaryActionLabel}
          secondaryLabel={heroSecondaryLabel}
          onPrimaryAction={onHeroPrimaryAction}
        />
      ) : null}

      <View style={styles.body}>{children}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16
  },
  body: {
    gap: 14
  },
  backdropOne: {
    position: 'absolute',
    top: 20,
    right: -12,
    width: 120,
    height: 120,
    opacity: 0.32
  },
  backdropTwo: {
    position: 'absolute',
    top: 140,
    left: -18,
    width: 100,
    height: 100,
    opacity: 0.24
  }
});
