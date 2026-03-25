import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from '@/features/settings/screens/PlaceholderScreen';

export function PremiumScreen(): React.JSX.Element {
  const { t } = useTranslation();
  return <PlaceholderScreen code="S19" titleKey="settings.premium" description={t('placeholders.premium')} />;
}
