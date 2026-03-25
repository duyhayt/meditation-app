import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { AppText } from '../common/AppText';
import { ContentBadge } from '../common/ContentBadge';
import { ImageBackgroundCard } from '../common/ImageBackgroundCard';

type SleepCardProps = {
  title: string;
  subtitle: string;
  durationLabel: string;
  imageUri: string;
  onPress?: () => void;
};

export function SleepCard({
  title,
  subtitle,
  durationLabel,
  imageUri,
  onPress
}: SleepCardProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <ImageBackgroundCard imageUri={imageUri} minHeight={184} onPress={onPress} overlayOpacity={0.48}>
      <View style={styles.header}>
        <ContentBadge label="Sleep" icon="moon" tone="light" />
      </View>
      <View style={styles.footer}>
        <View style={styles.copy}>
          <AppText variant="title" color={theme.colors.white}>
            {title}
          </AppText>
          <AppText variant="bodySmall" color="rgba(255,255,255,0.78)">
            {subtitle}
          </AppText>
        </View>
        <ContentBadge label={durationLabel} icon="headphones" tone="light" />
      </View>
    </ImageBackgroundCard>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-start'
  },
  footer: {
    gap: 10
  },
  copy: {
    gap: 4
  }
});
