import { Image, Pressable, StyleSheet, View } from 'react-native';

import { resolveAppImageSource } from '@/assets/image-registry';
import { useTheme } from '@/hooks/useTheme';

import { AppIcon } from './AppIcon';
import { AppText } from './AppText';
import { ContentBadge } from './ContentBadge';

type ContinueSessionCardProps = {
  imageUri: string;
  title: string;
  subtitle: string;
  progressLabel: string;
  onPress: () => void;
};

export function ContinueSessionCard({
  imageUri,
  title,
  subtitle,
  progressLabel,
  onPress
}: ContinueSessionCardProps): React.JSX.Element {
  const theme = useTheme();
  const source = resolveAppImageSource(imageUri);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surfaceElevated,
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
        <ContentBadge label={progressLabel} icon="continue" />
        <AppText variant="title">{title}</AppText>
        <AppText variant="bodySmall">{subtitle}</AppText>
        <View style={styles.row}>
          <AppIcon name="play" color={theme.colors.primary} />
          <AppText variant="bodyStrong" color={theme.colors.primary}>
            Continue listening
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    gap: 12
  },
  image: {
    width: 92,
    minHeight: 116
  },
  content: {
    flex: 1,
    gap: 6,
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  }
});
