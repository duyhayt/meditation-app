import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { ContentBadge } from '@/components/common/ContentBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import {
  useBreathingExercisesQuery,
  useCompleteBreathingSessionMutation
} from '@/features/content/hooks/use-content-queries';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'BreathingSession'>;

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function BreathingSessionScreen({ navigation, route }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const breathingQuery = useBreathingExercisesQuery();
  const completeSessionMutation = useCompleteBreathingSessionMutation();
  const exercise = (breathingQuery.data ?? []).find((item) => item.id === route.params.exerciseId);
  const totalSeconds = exercise?.durationSeconds ?? 0;
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const startedAtRef = useRef<string | null>(null);

  useEffect(() => {
    setRemainingSeconds(totalSeconds);
    setIsRunning(false);
    startedAtRef.current = null;
  }, [totalSeconds]);

  useEffect(() => {
    if (!isRunning || remainingSeconds <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, remainingSeconds]);

  useEffect(() => {
    if (remainingSeconds === 0 && isRunning && exercise) {
      setIsRunning(false);

      const startedAt = startedAtRef.current ?? new Date().toISOString();
      void completeSessionMutation.mutateAsync({
        exerciseId: exercise.id,
        durationSeconds: exercise.durationSeconds,
        completionRatio: 1,
        startedAt
      });
    }
  }, [completeSessionMutation, exercise, isRunning, remainingSeconds]);

  const elapsedSeconds = useMemo(
    () => Math.max(0, totalSeconds - remainingSeconds),
    [remainingSeconds, totalSeconds]
  );
  const completionPercent = totalSeconds > 0 ? Math.round((elapsedSeconds / totalSeconds) * 100) : 0;

  const handleStart = () => {
    if (!startedAtRef.current) {
      startedAtRef.current = new Date().toISOString();
    }

    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    startedAtRef.current = null;
    setRemainingSeconds(totalSeconds);
  };

  return (
    <MeditationScreen
      title={t('breathing.sessionTitle')}
      subtitle={t('breathing.sessionSubtitle')}
      heroImageUri={exercise?.coverImageUri}
      heroTitle={exercise?.title ?? t('breathing.sessionTitle')}
      heroSubtitle={exercise?.pattern ?? t('breathing.sessionSubtitle')}
      heroEyebrow={t('breathing.sessionHeroEyebrow')}
      showBackButton
    >
      {breathingQuery.isLoading ? <LoadingState label={t('common.loadingBreathing')} /> : null}
      {breathingQuery.isError || !exercise ? (
        <EmptyState
          title={t('breathing.sessionTitle')}
          description={t('common.contentLoadError')}
          actionLabel={t('common.retry')}
          onAction={() => void breathingQuery.refetch()}
        />
      ) : null}
      {exercise ? (
        <>
          <View style={styles.center}>
            <AppText variant="display">{formatCountdown(remainingSeconds)}</AppText>
            <ContentBadge label={exercise.pattern} icon="breath" />
            <ContentBadge
              label={t('breathing.progressLabel', { value: completionPercent })}
              icon="progress"
            />
          </View>
          <View style={styles.actions}>
            <AppButton
              label={isRunning ? t('audio.pause') : t('breathing.startSession')}
              iconLeft={isRunning ? 'pause' : 'play'}
              onPress={() => {
                if (isRunning) {
                  setIsRunning(false);
                  return;
                }

                handleStart();
              }}
            />
            <AppButton
              label={t('breathing.resetSession')}
              iconLeft="history"
              variant="secondary"
              onPress={handleReset}
            />
            <AppButton
              label={t('breathing.openPlayer')}
              iconLeft="headphones"
              variant="outline"
              onPress={() =>
                navigation.navigate('AudioPlayer', {
                  contentId: exercise.id,
                  contentType: 'breathing_exercise'
                })
              }
            />
          </View>
        </>
      ) : null}
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  center: {
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  actions: {
    gap: 12
  }
});
