import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';

import { usePlaybackSnapshot } from '@/features/content/hooks/use-content-queries';
import { useTheme } from '@/hooks/useTheme';
import { useAudioService } from '@/providers/ServicesProvider';

import { AppIcon } from './AppIcon';
import { AppText } from './AppText';

const routeIconMap = {
  HomeTab: 'home',
  MeditateTab: 'meditate',
  SleepTab: 'moon',
  ProfileTab: 'profile'
} as const;

function formatClockFromMillis(value: number): string {
  const totalSeconds = Math.max(0, Math.floor(value / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function AppBottomTabBar({
  state,
  descriptors,
  navigation
}: BottomTabBarProps): React.JSX.Element {
  const theme = useTheme();
  const audioService = useAudioService();
  const playback = usePlaybackSnapshot();
  const showMiniPlayer = Boolean(
    playback.contentId && playback.contentType && playback.status === 'playing'
  );
  const progressRatio =
    playback.durationMillis > 0
      ? Math.min(1, playback.positionMillis / playback.durationMillis)
      : 0;

  return (
    <View style={styles.wrapper}>
      {showMiniPlayer ? (
        <View
          style={[
            styles.miniPlayer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.xxl
            }
          ]}
        >
          <Pressable
            onPress={() =>
              playback.contentId && playback.contentType
                ? navigation.getParent()?.navigate('AudioPlayer', {
                    contentId: playback.contentId,
                    contentType: playback.contentType
                  })
                : undefined
            }
            style={({ pressed }) => [
              styles.miniPlayerMain,
              {
                opacity: pressed ? 0.92 : 1
              }
            ]}
          >
            <View style={styles.miniPlayerCopy}>
              <AppText variant="bodyStrong" numberOfLines={1}>
                {playback.title ?? 'Now playing'}
              </AppText>
              <AppText variant="caption">
                {formatClockFromMillis(playback.positionMillis)}
                {playback.durationMillis > 0
                  ? ` / ${formatClockFromMillis(playback.durationMillis)}`
                  : ''}
              </AppText>
            </View>
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={() =>
                playback.status === 'playing' ? void audioService.pause() : void audioService.play()
              }
              style={({ pressed }) => [
                styles.miniPlayerAction,
                {
                  backgroundColor: theme.colors.surfaceElevated,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.pill,
                  opacity: pressed ? 0.84 : 1
                }
              ]}
            >
              <AppIcon
                name={playback.status === 'playing' ? 'pause' : 'play'}
                color={theme.colors.primary}
                size={theme.iconSize.lg}
              />
            </Pressable>
          </Pressable>
          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor: theme.colors.divider,
                borderRadius: theme.radius.pill
              }
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.max(progressRatio * 100, 3)}%`,
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.radius.pill
                }
              ]}
            />
          </View>
        </View>
      ) : null}

      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.tabBar,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.xxxl
          }
        ]}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const descriptor = descriptors[route.key];
          const label =
            typeof descriptor.options.tabBarLabel === 'string'
              ? descriptor.options.tabBarLabel
              : typeof descriptor.options.title === 'string'
                ? descriptor.options.title
                : route.name;

          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={({ pressed }) => [
                styles.tab,
                {
                  backgroundColor: focused ? theme.colors.surfaceElevated : 'transparent',
                  borderRadius: theme.radius.xxl,
                  opacity: pressed ? 0.88 : 1
                }
              ]}
            >
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: focused ? theme.colors.chipActive : 'transparent',
                    borderRadius: theme.radius.pill
                  }
                ]}
              >
                <AppIcon
                  name={routeIconMap[route.name as keyof typeof routeIconMap]}
                  color={focused ? theme.colors.primary : theme.colors.iconMuted}
                  size={theme.iconSize.md}
                />
              </View>
              <AppText
                variant="caption"
                color={focused ? theme.colors.primary : theme.colors.textMuted}
              >
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    gap: 10
  },
  miniPlayer: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    gap: 10
  },
  miniPlayerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  miniPlayerCopy: {
    flex: 1,
    gap: 2
  },
  miniPlayerAction: {
    width: 42,
    height: 42,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressTrack: {
    height: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%'
  },
  container: {
    flexDirection: 'row',
    padding: 4,
    borderWidth: 1
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 62,
    paddingVertical: 6
  },
  iconWrap: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
