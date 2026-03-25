import { SectionHeader } from '@/components/common/SectionHeader';

type AppHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  rightSlot?: React.ReactNode;
  showBackButton?: boolean;
};

export function AppHeader({
  eyebrow,
  title,
  description,
  rightSlot,
  showBackButton
}: AppHeaderProps): React.JSX.Element {
  return (
    <SectionHeader
      eyebrow={eyebrow}
      title={title}
      description={description}
      rightSlot={rightSlot}
      showBackButton={showBackButton}
    />
  );
}
