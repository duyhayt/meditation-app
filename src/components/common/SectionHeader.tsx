import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { AppIcon } from './AppIcon';
import { AppText } from './AppText';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  rightSlot?: React.ReactNode;
  showBackButton?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  rightSlot,
  showBackButton
}: SectionHeaderProps): React.JSX.Element {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
  const shouldShowBackButton = showBackButton ?? navigation.canGoBack();

  return (
    <View
      style={{
        marginBottom: theme.spacing.xl,
        gap: theme.spacing.md
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: theme.spacing.md }}>
        <View style={{ flex: 1, flexDirection: 'row', gap: theme.spacing.md }}>
          {shouldShowBackButton ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.back')}
              onPress={() => navigation.goBack()}
              style={({ pressed }) => ({
                width: 42,
                height: 42,
                borderRadius: theme.radius.lg,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
                opacity: pressed ? 0.85 : 1
              })}
            >
              <AppIcon name="chevronLeft" size={theme.iconSize.md} color={theme.colors.icon} />
            </Pressable>
          ) : null}
          <View style={{ flex: 1, gap: theme.spacing.xs }}>
            {eyebrow ? <AppText variant="label">{eyebrow}</AppText> : null}
            <AppText variant="heading2">{title}</AppText>
            {description ? <AppText variant="bodySmall">{description}</AppText> : null}
          </View>
        </View>
        {rightSlot}
      </View>
    </View>
  );
}
