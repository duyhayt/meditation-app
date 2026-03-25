import { Pressable, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  errorMessage?: string;
};

export function SelectField({ label, value, options, onChange, errorMessage }: SelectFieldProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <Text variant="bodySmall" style={{ marginBottom: theme.spacing.sm }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
        {options.map((option) => {
          const active = option.value === value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={{
                borderWidth: 1,
                borderColor: active ? theme.colors.primary : theme.colors.border,
                backgroundColor: active ? theme.colors.primary : theme.colors.card,
                borderRadius: theme.radius.pill,
                paddingHorizontal: theme.spacing.lg,
                paddingVertical: theme.spacing.sm + 2
              }}
            >
              <Text color={active ? theme.colors.textOnPrimary : theme.colors.textPrimary}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {errorMessage ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, marginTop: theme.spacing.xs }}>
          <AppIcon name="error" size={theme.iconSize.xs} color={theme.colors.danger} />
          <Text variant="caption" color={theme.colors.danger}>
            {errorMessage}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
