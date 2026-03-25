import { FloatingActionButton as CommonFloatingActionButton } from '@/components/common/FloatingActionButton';

type FloatingActionButtonProps = {
  label: string;
  onPress: () => void;
};

export function FloatingActionButton({ label, onPress }: FloatingActionButtonProps): React.JSX.Element {
  return <CommonFloatingActionButton label={label} onPress={onPress} />;
}
