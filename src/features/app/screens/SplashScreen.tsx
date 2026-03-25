import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Screen } from '@/components/ui/Screen';
import { useTheme } from '@/hooks/useTheme';

type SplashScreenProps = {
  title: string;
  subtitle: string;
};

export function SplashScreen({ title, subtitle }: SplashScreenProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Screen centered contentStyle={styles.content}>
      <View
        style={[
          styles.mark,
          {
            backgroundColor: theme.colors.heroStart,
            borderRadius: theme.radius.xxl
          }
        ]}
      />
      <View style={styles.copy}>
        <AppText variant="label" color={theme.colors.primary}>
          Offline-first meditation
        </AppText>
        <AppText variant="display">{title}</AppText>
        <AppText variant="bodySmall">{subtitle}</AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
    justifyContent: 'center'
  },
  mark: {
    width: 104,
    height: 104
  },
  copy: {
    alignItems: 'center',
    gap: 8
  }
});
