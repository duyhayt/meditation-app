import { type PropsWithChildren } from 'react';
import { Modal as RNModal, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { useTheme } from '@/hooks/useTheme';

type AppModalProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
}>;

export function AppModal({ visible, onClose, children }: AppModalProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <RNModal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(theme.motion.duration.fast)}
        exiting={FadeOut.duration(theme.motion.duration.fast)}
        style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View
          entering={SlideInDown.duration(theme.motion.duration.normal)}
          exiting={SlideOutDown.duration(theme.motion.duration.fast)}
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.xxl,
              padding: theme.spacing.xl
            },
            theme.shadows.floating
          ]}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16
  },
  sheet: {
    borderWidth: 1
  }
});
