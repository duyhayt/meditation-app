import { type PropsWithChildren } from 'react';

import { AppModal } from '@/components/common/AppModal';

type ModalProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
}>;

export function Modal({ visible, onClose, children }: ModalProps): React.JSX.Element {
  return <AppModal visible={visible} onClose={onClose}>{children}</AppModal>;
}
