import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from '@/features/settings/screens/PlaceholderScreen';

export function AccountScreen(): React.JSX.Element {
  const { t } = useTranslation();
  return <PlaceholderScreen code="S22" titleKey="settings.account" description={t('placeholders.account')} />;
}
