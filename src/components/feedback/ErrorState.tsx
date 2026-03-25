import { ErrorState as CommonErrorState } from '@/components/common/ErrorState';

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps): React.JSX.Element {
  return <CommonErrorState message={message} onRetry={onRetry} />;
}
