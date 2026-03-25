import { EmptyState as CommonEmptyState } from '@/components/common/EmptyState';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps): React.JSX.Element {
  return <CommonEmptyState title={title} description={description} actionLabel={actionLabel} onAction={onAction} />;
}
