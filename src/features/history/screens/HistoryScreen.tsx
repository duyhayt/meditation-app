import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { AppText } from '@/components/common/AppText';
import { ContentBadge } from '@/components/common/ContentBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { MeditationScreen } from '@/components/meditation/MeditationScreen';
import { useSessionHistoryQuery } from '@/features/content/hooks/use-content-queries';

export function HistoryScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const historyQuery = useSessionHistoryQuery(20);
  const history = historyQuery.data ?? [];

  return (
    <MeditationScreen
      title={t('history.title')}
      subtitle={t('history.subtitle')}
      showBackButton
      decorativeBackground={false}
    >
      {historyQuery.isLoading ? <LoadingState label={t('common.loadingHistory')} /> : null}
      {historyQuery.isError ? (
        <EmptyState
          title={t('history.title')}
          description={t('common.contentLoadError')}
          actionLabel={t('common.retry')}
          onAction={() => void historyQuery.refetch()}
        />
      ) : null}
      {!historyQuery.isLoading && !historyQuery.isError && history.length === 0 ? (
        <EmptyState
          title={t('history.emptyTitle')}
          description={t('history.emptyDescription')}
        />
      ) : null}
      {!historyQuery.isLoading && !historyQuery.isError
        ? history.map((session) => (
            <AppCard key={session.id} elevated style={styles.card}>
              <View style={styles.badges}>
                <ContentBadge
                  label={
                    session.isCompleted ? t('history.completed') : t('history.inProgress')
                  }
                  icon={session.isCompleted ? 'success' : 'continue'}
                />
                <ContentBadge label={session.contentType} icon="headphones" />
              </View>
              <AppText variant="title">{session.contentId}</AppText>
              <AppText variant="bodySmall">
                {t('history.sessionSummary', {
                  progress: session.progressSeconds,
                  ratio: Math.round(session.completionRatio * 100)
                })}
              </AppText>
              <AppText variant="caption">{session.startedAt}</AppText>
            </AppCard>
          ))
        : null}
    </MeditationScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  }
});
