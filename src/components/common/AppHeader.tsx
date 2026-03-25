import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { AppIconButton } from './AppIconButton';
import { AppText } from './AppText';
import { BackButton } from './BackButton';

type AppHeaderProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  showBackButton?: boolean;
  floating?: boolean;
  rightSlot?: React.ReactNode;
};

export function AppHeader({
  title,
  eyebrow,
  subtitle,
  showBackButton,
  floating = false,
  rightSlot
}: AppHeaderProps): React.JSX.Element {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View
      style={[
        styles.wrapper,
        {
          marginBottom: theme.spacing.lg
        }
      ]}
    >
      <View style={styles.row}>
        <View style={styles.leading}>
          {showBackButton ? <BackButton onPress={() => navigation.goBack()} tint={floating ? 'light' : 'default'} /> : null}
          <View style={styles.copy}>
            {eyebrow ? (
              <AppText variant="label" color={floating ? 'rgba(255,255,255,0.72)' : theme.colors.primary}>
                {eyebrow}
              </AppText>
            ) : null}
            <AppText variant="heading2" color={floating ? theme.colors.white : theme.colors.textPrimary}>
              {title}
            </AppText>
            {subtitle ? (
              <AppText variant="bodySmall" color={floating ? 'rgba(255,255,255,0.72)' : theme.colors.textSecondary}>
                {subtitle}
              </AppText>
            ) : null}
          </View>
        </View>
        {rightSlot ?? (floating ? <AppIconButton icon="favorite" tint="light" /> : null)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10
  },
  leading: {
    flex: 1,
    flexDirection: 'row',
    gap: 12
  },
  copy: {
    flex: 1,
    gap: 3
  }
});
