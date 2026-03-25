import { AppBadge } from '@/components/common/AppBadge';

type BadgeProps = {
  label: string;
  backgroundColor: string;
  color: string;
};

export function Badge({ label, backgroundColor, color }: BadgeProps): React.JSX.Element {
  return <AppBadge label={label} backgroundColor={backgroundColor} color={color} />;
}
