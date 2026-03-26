import {
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType
} from 'react-native';

import { resolveAppImageSource } from '@/assets/image-registry';
import { useTheme } from '@/hooks/useTheme';

type ImageBackgroundCardProps = {
  imageUri: string | null | undefined;
  minHeight?: number;
  onPress?: () => void;
  children: React.ReactNode;
  overlayOpacity?: number;
  imageStyle?: ImageSourcePropType;
};

export function ImageBackgroundCard({
  imageUri,
  minHeight = 196,
  onPress,
  children,
  overlayOpacity = 0.34
}: ImageBackgroundCardProps): React.JSX.Element {
  const theme = useTheme();
  const source = resolveAppImageSource(imageUri);

  if (!source) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.wrapper,
          {
            minHeight,
            borderRadius: theme.radius.xxxl,
            backgroundColor: theme.colors.surfaceElevated,
            opacity: pressed ? 0.94 : 1
          }
        ]}
      >
        <View
          style={[
            styles.content,
            {
              borderRadius: theme.radius.xxxl,
              padding: theme.spacing.xl
            }
          ]}
        >
          {children}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrapper,
        {
          minHeight,
          borderRadius: theme.radius.xxxl,
          opacity: pressed ? 0.94 : 1
        }
      ]}
    >
      <ImageBackground
        source={source}
        resizeMode="cover"
        style={styles.image}
        imageStyle={{ borderRadius: theme.radius.xxxl }}
      >
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: theme.colors.overlayStrong,
              opacity: overlayOpacity,
              borderRadius: theme.radius.xxxl
            }
          ]}
        />
        <View
          style={[
            styles.content,
            {
              borderRadius: theme.radius.xxxl,
              padding: theme.spacing.xl
            }
          ]}
        >
          {children}
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden'
  },
  image: {
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: 'space-between'
  }
});
