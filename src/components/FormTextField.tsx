import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

import { TextField, type TextFieldProps } from "@/components/TextField";

type FormTextFieldProps<T extends FieldValues> = Omit<
  TextFieldProps,
  "value" | "onChangeText" | "onBlur" | "error" | "defaultValue"
> & {
  control: Control<T>;
  name: FieldPath<T>;
};

export function FormTextField<T extends FieldValues>({
  control,
  name,
  ...rest
}: FormTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <TextField
          {...rest}
          value={typeof value === "string" ? value : ""}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
        />
      )}
    />
  );
}
