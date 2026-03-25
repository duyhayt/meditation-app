import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from '@/features/settings/screens/PlaceholderScreen';

export function SyncScreen(): React.JSX.Element {
  const { t } = useTranslation();
  return <PlaceholderScreen code="S21" titleKey="settings.sync" description={t('placeholders.sync')} />;
}
