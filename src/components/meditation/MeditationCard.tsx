import { Image, Pressable, StyleSheet, View } from 'react-native';

import { resolveAppImageSource } from '@/assets/image-registry';
import { useTheme } from '@/hooks/useTheme';

import { AppText } from '../common/AppText';
import { ContentBadge } from '../common/ContentBadge';

type MeditationCardProps = {
  title: string;
  subtitle: string;
  durationLabel: string;
  metaLabel: string;
  imageUri: string;
  tone?: 'meditation' | 'course' | 'breathing';
  onPress?: () => void;
};

export function MeditationCard({
  title,
  subtitle,
  durationLabel,
  metaLabel,
  imageUri,
  tone = 'meditation',
  onPress
}: MeditationCardProps): React.JSX.Element {
  const theme = useTheme();
  const source = resolveAppImageSource(imageUri);
  const backgroundColor =
    tone === 'breathing'
      ? theme.colors.breathingTint
      : tone === 'course'
        ? theme.colors.courseTint
        : theme.colors.meditationTint;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.xxl,
          opacity: pressed ? 0.94 : 1
        }
      ]}
    >
      {source ? (
        <Image
          source={source}
          resizeMode="cover"
          style={[styles.image, { borderRadius: theme.radius.xl }]}
        />
      ) : null}
      <View style={styles.content}>
        <View style={styles.badges}>
          <ContentBadge label={durationLabel} icon="timer" />
          <ContentBadge label={metaLabel} icon="sparkles" />
        </View>
        <View style={styles.copy}>
          <AppText variant="title">{title}</AppText>
          <AppText variant="bodySmall">{subtitle}</AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 10,
    gap: 10
  },
  image: {
    width: '100%',
    height: 128
  },
  content: {
    gap: 8
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  copy: {
    gap: 6
  }
});
