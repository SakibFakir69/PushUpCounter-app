import { ActivityIndicator, Pressable, Text, type StyleProp, type ViewStyle } from "react-native";

type Variant = "primary" | "outline" | "ghost";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
};

const BASE = "h-cta w-full rounded-full items-center justify-center px-6";

const VARIANT: Record<Variant, string> = {
  primary: "bg-primary",
  outline: "bg-transparent border border-line",
  ghost: "bg-transparent",
};

const PRESSED_BG: Record<Variant, string | null> = {
  primary: "#2FE010",
  outline: "#1A1F2B",
  ghost: "transparent",
};

const LABEL: Record<Variant, string> = {
  primary: "text-content-inverse",
  outline: "text-content",
  ghost: "text-content",
};

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  testID,
  accessibilityLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const pressedBg = PRESSED_BG[variant];

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      className={[BASE, VARIANT[variant], isDisabled ? "opacity-40" : "", style ? "" : ""]
        .filter(Boolean)
        .join(" ")}
      style={({ pressed }) => [
        pressed && !isDisabled && pressedBg && variant !== "ghost" ? { backgroundColor: pressedBg } : undefined,
        pressed && !isDisabled && variant === "ghost" ? { opacity: 0.85 } : undefined,
        style as ViewStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#0B0F14" : "#E5E7EB"} />
      ) : (
        <Text className={`font-bold text-button ${LABEL[variant]}`}>{label}</Text>
      )}
    </Pressable>
  );
}
