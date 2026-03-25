import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import type { AppIconName } from '@/theme';

import { AppText } from '../common/AppText';
import { ContentBadge } from '../common/ContentBadge';
import { ImageBackgroundCard } from '../common/ImageBackgroundCard';

type CategoryCardProps = {
  title: string;
  subtitle: string;
  durationLabel: string;
  ambientLabel: string;
  imageUri: string;
  icon?: AppIconName;
  onPress?: () => void;
};

export function CategoryCard({
  title,
  subtitle,
  durationLabel,
  ambientLabel,
  imageUri,
  icon = 'meditate',
  onPress
}: CategoryCardProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <ImageBackgroundCard imageUri={imageUri} minHeight={196} onPress={onPress} overlayOpacity={0.38}>
      <View style={styles.top}>
        <ContentBadge label={ambientLabel} icon={icon} tone="light" />
      </View>
      <View style={styles.bottom}>
        <View style={styles.copy}>
          <AppText variant="title" color={theme.colors.white}>
            {title}
          </AppText>
          <AppText variant="bodySmall" color="rgba(255,255,255,0.78)">
            {subtitle}
          </AppText>
        </View>
        <ContentBadge label={durationLabel} icon="timer" tone="light" />
      </View>
    </ImageBackgroundCard>
  );
}

const styles = StyleSheet.create({
  top: {
    alignItems: 'flex-start'
  },
  bottom: {
    gap: 12
  },
  copy: {
    gap: 6
  }
});
