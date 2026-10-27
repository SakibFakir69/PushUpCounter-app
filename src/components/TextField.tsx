import { useState } from "react";
import { Pressable, Text, TextInput, View, type TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IconName = keyof typeof Ionicons.glyphMap;

type TextFieldProps = TextInputProps & {
  label?: string;
  icon?: IconName;
  error?: string;
  /** renders eye toggle */
  secure?: boolean;
  containerTestID?: string;
};

export function TextField({
  label,
  icon,
  error,
  secure = false,
  style,
  containerTestID,
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View testID={containerTestID} className="w-full">
      {label ? (
        <Text className="mb-1 font-semibold text-caption text-content-muted">{label}</Text>
      ) : null}
      <View
        className={[
          "h-input w-full flex-row items-center rounded-card border bg-surface px-4",
          focused ? "border-primary" : "border-line",
          error ? "border-danger" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={20}
            color={focused ? "#39FF14" : "#9CA3AF"}
            style={{ marginRight: 10 }}
          />
        ) : null}
        <TextInput
          className="flex-1 py-0 font-regular text-body text-content"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secure && hidden}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
        {secure ? (
          <Pressable
            hitSlop={12}
            onPress={() => setHidden((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            className="ml-2 h-11 w-11 items-center justify-center"
          >
            <Ionicons name={hidden ? "eye-outline" : "eye-off-outline"} size={22} color="#9CA3AF" />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text className="mt-1 ml-1 font-semibold text-caption text-danger">{error}</Text>
      ) : null}
    </View>
  );
}
