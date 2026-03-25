import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from './PlaceholderScreen';

export function LoginScreen(): React.JSX.Element {
  const { t } = useTranslation();
  return <PlaceholderScreen code="S20" titleKey="settings.login" description={t('placeholders.login')} />;
}
