import { useQuery } from '@tanstack/react-query';

import { useRemindersRepository, useStatisticsRepository } from '@/providers/ServicesProvider';

export function useStatisticsSummaryQuery() {
  const repository = useStatisticsRepository();

  return useQuery({
    queryKey: ['statistics', 'summary'],
    queryFn: () => repository.getSummary()
  });
}

export function useStatisticsBreakdownQuery() {
  const repository = useStatisticsRepository();

  return useQuery({
    queryKey: ['statistics', 'breakdown'],
    queryFn: () => repository.getStatusBreakdown()
  });
}

export function useUpcomingRemindersQuery() {
  const repository = useRemindersRepository();

  return useQuery({
    queryKey: ['reminders', 'upcoming'],
    queryFn: () => repository.listUpcoming(5)
  });
}
