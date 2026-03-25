import { View } from 'react-native';

import { AppCard } from '@/components/common/AppCard';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import type { ContactRecord } from '@/domain/database';
import { useTheme } from '@/hooks/useTheme';

type ContactCardProps = {
  contact: ContactRecord;
  onPress?: () => void;
};

export function ContactCard({ contact, onPress }: ContactCardProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <AppCard pressable={Boolean(onPress)} onPress={onPress} style={{ marginBottom: theme.spacing.md }}>
      <View style={{ flexDirection: 'row', gap: theme.spacing.md, alignItems: 'center' }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: theme.radius.lg,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.surfaceSecondary
          }}
        >
          <AppIcon name="contact" size={theme.iconSize.lg} color={theme.colors.primary} />
        </View>
        <View style={{ flex: 1, gap: theme.spacing.xs }}>
          <AppText variant="title">{contact.name}</AppText>
          {contact.phone ? <AppText variant="bodySmall">{contact.phone}</AppText> : null}
          {contact.email ? <AppText variant="bodySmall">{contact.email}</AppText> : null}
        </View>
        <AppIcon name="chevronRight" size={theme.iconSize.md} color={theme.colors.iconMuted} />
      </View>
    </AppCard>
  );
}
