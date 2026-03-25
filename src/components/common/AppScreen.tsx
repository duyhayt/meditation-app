import { type PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  type StyleProp,
  type ViewStyle
} from 'react-native';
import Animated, { FadeIn, Layout, SlideInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';

type AppScreenProps = PropsWithChildren<{
  centered?: boolean;
  scrollable?: boolean;
  keyboardAware?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  safeAreaEdges?: Array<'top' | 'right' | 'bottom' | 'left'>;
}>;

export function AppScreen({
  children,
  centered = false,
  scrollable = false,
  keyboardAware = true,
  contentStyle,
  safeAreaEdges = ['top', 'left', 'right']
}: AppScreenProps): React.JSX.Element {
  const theme = useTheme();
  const contentStyles = [
    styles.content,
    {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl + 72
    },
    centered ? styles.centered : null,
    contentStyle
  ];

  const body = scrollable ? (
    <ScrollView
      contentContainerStyle={contentStyles}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn.duration(theme.motion.duration.normal)} layout={Layout.springify()}>
        {children}
      </Animated.View>
    </ScrollView>
  ) : (
    <Animated.View
      entering={SlideInUp.duration(theme.motion.duration.normal)}
      layout={Layout.springify()}
      style={contentStyles}
    >
      {children}
    </Animated.View>
  );

  return (
    <SafeAreaView edges={safeAreaEdges} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      {keyboardAware ? (
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  keyboardAvoidingView: {
    flex: 1
  },
  content: {
    flexGrow: 1
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
