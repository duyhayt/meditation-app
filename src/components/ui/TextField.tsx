import { StyleSheet, TextInput, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  errorMessage?: string;
};

export function TextField({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  multiline = false,
  secureTextEntry = false,
  errorMessage
}: TextFieldProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <Text variant="bodySmall" style={{ marginBottom: theme.spacing.sm }}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.card,
            borderColor: errorMessage ? theme.colors.danger : theme.colors.border,
            borderRadius: theme.radius.lg,
            color: theme.colors.textPrimary,
            minHeight: multiline ? 128 : 54,
            textAlignVertical: multiline ? 'top' : 'center'
          }
        ]}
        onBlur={onBlur}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
      />
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

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14
  }
});
