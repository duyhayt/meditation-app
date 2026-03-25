import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { AppText } from '@/components/common/AppText';
import { ContentBadge } from '@/components/common/ContentBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { useDailyProgressQuery } from '@/features/content/hooks/use-content-queries';

function getCurrentStreak(days: { progressDate: string; streakQualified: boolean }[]): number {
  let streak = 0;

  for (const day of days) {
    if (!day.streakQualified) {
      break;
    }

    streak += 1;
  }

  return streak;
}

export function ProgressScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const progressQuery = useDailyProgressQuery(14);
  const progress = progressQuery.data ?? [];

  const metrics = {
    streakDays: getCurrentStreak(progress),
    totalMinutes: Math.round(
      progress.reduce((sum, item) => sum + item.totalMeditationSeconds, 0) / 60
    ),
    completedSessions: progress.reduce((sum, item) => sum + item.completedSessions, 0)
  };

  return (
    <MeditationScreen
      title={t('progress.title')}
      subtitle={t('progress.subtitle')}
      heroImageUri={progress.length ? undefined : undefined}
      heroTitle={t('progress.heroTitle')}
      heroSubtitle={t('progress.heroSubtitle')}
      heroEyebrow={t('progress.heroEyebrow')}
      heroSize="compact"
      showBackButton
    >
      {progressQuery.isLoading ? <LoadingState label={t('common.loadingProgress')} /> : null}
      {progressQuery.isError ? (
        <EmptyState
          title={t('progress.title')}
          description={t('common.contentLoadError')}
          actionLabel={t('common.retry')}
          onAction={() => void progressQuery.refetch()}
        />
      ) : null}
      {!progressQuery.isLoading && !progressQuery.isError && progress.length === 0 ? (
        <EmptyState
          title={t('progress.emptyTitle')}
          description={t('progress.emptyDescription')}
        />
      ) : null}
      {!progressQuery.isLoading && !progressQuery.isError && progress.length > 0 ? (
        <>
          <View style={styles.summaryGrid}>
            <AppCard elevated style={styles.summaryCard}>
              <ContentBadge label={t('progress.streakMeta')} icon="streak" />
              <AppText variant="heading2">{t('progress.streakDays', { count: metrics.streakDays })}</AppText>
              <AppText variant="bodySmall">{t('progress.streakSubtitle')}</AppText>
            </AppCard>
            <AppCard elevated style={styles.summaryCard}>
              <ContentBadge label={t('progress.minutesMeta')} icon="timer" />
              <AppText variant="heading2">{t('progress.totalMinutes', { count: metrics.totalMinutes })}</AppText>
              <AppText variant="bodySmall">{t('progress.minutesSubtitle')}</AppText>
            </AppCard>
          </View>

          <SectionHeader
            title={t('progress.sectionTitle')}
            description={t('progress.sectionDescription')}
          />
          {progress.map((item) => (
            <AppCard key={item.id} elevated style={styles.dayCard}>
              <View style={styles.row}>
                <ContentBadge label={item.progressDate} icon="calendar" />
                <ContentBadge
                  label={
                    item.streakQualified
                      ? t('progress.streakQualified')
                      : t('progress.streakPending')
                  }
                  icon={item.streakQualified ? 'success' : 'sparkles'}
                />
              </View>
              <AppText variant="title">
                {t('progress.totalMinutes', {
                  count: Math.round(item.totalMeditationSeconds / 60)
                })}
              </AppText>
              <AppText variant="bodySmall">
                {t('progress.completedSessionsCount', {
                  count: item.completedSessions
                })}
              </AppText>
            </AppCard>
          ))}
          <AppText variant="bodySmall">
            {t('progress.completedSessionsSummary', { count: metrics.completedSessions })}
          </AppText>
        </>
      ) : null}
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  summaryGrid: {
    gap: 12
  },
  summaryCard: {
    gap: 8
  },
  dayCard: {
    gap: 8
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  }
});
