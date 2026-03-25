import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useContactsRepository } from '@/providers/ServicesProvider';

const CONTACTS_QUERY_KEY = ['contacts'] as const;

export function useContactsQuery() {
  const repository = useContactsRepository();

  return useQuery({
    queryKey: CONTACTS_QUERY_KEY,
    queryFn: () => repository.list()
  });
}

export function useContactDetailQuery(contactId?: string) {
  const repository = useContactsRepository();

  return useQuery({
    queryKey: [...CONTACTS_QUERY_KEY, contactId],
    enabled: Boolean(contactId),
    queryFn: () => repository.getById(contactId as string)
  });
}

export function useCreateContactMutation() {
  const repository = useContactsRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: repository.create,
    onSuccess: (contact) => {
      void queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['statistics'] });
      void queryClient.setQueryData([...CONTACTS_QUERY_KEY, contact.id], contact);
    }
  });
}

export function useUpdateContactMutation(contactId: string) {
  const repository = useContactsRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof repository.update>[1]) => repository.update(contactId, input),
    onSuccess: (contact) => {
      void queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['statistics'] });
      if (contact) {
        void queryClient.setQueryData([...CONTACTS_QUERY_KEY, contact.id], contact);
      }
    }
  });
}

export function useDeleteContactMutation() {
  const repository = useContactsRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) => repository.remove(contactId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['debts'] });
      void queryClient.invalidateQueries({ queryKey: ['statistics'] });
    }
  });
}
