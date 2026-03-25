import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

import { TextField } from './TextField';

type InputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
};

export function Input<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  multiline = false,
  secureTextEntry = false
}: InputProps<TFieldValues>): React.JSX.Element {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
        <TextField
          label={label}
          value={String(value ?? '')}
          onBlur={onBlur}
          onChangeText={onChange}
          placeholder={placeholder}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
          errorMessage={error?.message}
        />
      )}
    />
  );
}
