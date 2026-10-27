import { useRef } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type OtpInputProps = {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  error?: string;
  testID?: string;
};

/**
 * Hidden single TextInput drives the value; visible boxes render per-digit.
 * One focus target = reliable keyboard behavior across platforms.
 */
export function OtpInput({ value, onChange, length = 6, error, testID }: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const focus = () => inputRef.current?.focus();

  return (
    <View testID={testID} className="w-full items-center">
      <Pressable onPress={focus} accessibilityRole="none" className="w-full flex-row justify-center gap-2">
        {digits.map((d, i) => {
          const active = i === value.length;
          return (
            <View
              key={i}
              className={[
                "h-14 w-12 items-center justify-center rounded-card border bg-surface",
                error ? "border-danger" : active ? "border-primary" : "border-line",
              ].join(" ")}
            >
              <Text className="font-extrabold text-heading text-content">{d}</Text>
            </View>
          );
        })}
      </Pressable>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(v) => onChange(v.replace(/[^0-9]/g, "").slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        caretHidden
        className="absolute h-px w-px opacity-0"
        accessibilityLabel="Verification code"
      />

      {error ? (
        <Text className="mt-3 font-semibold text-caption text-danger">{error}</Text>
      ) : null}
    </View>
  );
}
