import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useDebtsRepository, usePaymentsRepository } from '@/providers/ServicesProvider';

const DEBTS_QUERY_KEY = ['debts'] as const;

export function useDebtsQuery() {
  const repository = useDebtsRepository();

  return useQuery({
    queryKey: DEBTS_QUERY_KEY,
    queryFn: () => repository.list()
  });
}

export function useDebtDetailQuery(debtId?: string) {
  const repository = useDebtsRepository();

  return useQuery({
    queryKey: [...DEBTS_QUERY_KEY, debtId],
    enabled: Boolean(debtId),
    queryFn: () => repository.getById(debtId as string)
  });
}

export function useCreateDebtMutation() {
  const repository = useDebtsRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: repository.create,
    onSuccess: (debt) => {
      void queryClient.invalidateQueries({ queryKey: DEBTS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['statistics'] });
      void queryClient.setQueryData([...DEBTS_QUERY_KEY, debt.id], debt);
    }
  });
}

export function useUpdateDebtMutation(debtId: string) {
  const repository = useDebtsRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof repository.update>[1]) => repository.update(debtId, input),
    onSuccess: (debt) => {
      void queryClient.invalidateQueries({ queryKey: DEBTS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['statistics'] });
      if (debt) {
        void queryClient.setQueryData([...DEBTS_QUERY_KEY, debt.id], debt);
      }
    }
  });
}

export function useDeleteDebtMutation() {
  const repository = useDebtsRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (debtId: string) => repository.remove(debtId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: DEBTS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['statistics'] });
    }
  });
}

export function usePaymentHistoryQuery(debtId?: string) {
  const repository = usePaymentsRepository();

  return useQuery({
    queryKey: ['payments', debtId],
    enabled: Boolean(debtId),
    queryFn: () => repository.listByDebtId(debtId as string)
  });
}

export function useCreatePaymentMutation() {
  const repository = usePaymentsRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: repository.create,
    onSuccess: (payment) => {
      void queryClient.invalidateQueries({ queryKey: ['payments', payment.debtId] });
      void queryClient.invalidateQueries({ queryKey: DEBTS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: [...DEBTS_QUERY_KEY, payment.debtId] });
      void queryClient.invalidateQueries({ queryKey: ['statistics'] });
    }
  });
}
