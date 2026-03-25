import { LoadingState } from '@/components/common/LoadingState';

type LoadingViewProps = {
  label?: string;
  variant?: 'spinner' | 'dashboard' | 'list' | 'detail' | 'form';
};

export function LoadingView({ label, variant }: LoadingViewProps): React.JSX.Element {
  return <LoadingState label={label} variant={variant} />;
}
