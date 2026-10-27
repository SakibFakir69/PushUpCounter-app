import { Platform, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Provider = "google" | "apple";

type SocialButtonProps = {
  provider: Provider;
  onPress: () => void;
  testID?: string;
};

const LABELS: Record<Provider, string> = {
  google: "Continue with Google",
  apple: "Continue with Apple",
};

const ICONS: Record<Provider, keyof typeof Ionicons.glyphMap> = {
  google: "logo-google",
  apple: "logo-apple",
};

export function SocialButton({ provider, onPress, testID }: SocialButtonProps) {
  if (provider === "apple" && Platform.OS !== "ios") return null;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={LABELS[provider]}
      onPress={onPress}
      className="h-cta w-full flex-row items-center justify-center rounded-card border border-line bg-surface px-4"
      style={({ pressed }) => (pressed ? { backgroundColor: "#212736" } : undefined)}
    >
      <Ionicons
        name={ICONS[provider]}
        size={20}
        color="#E5E7EB"
        style={{ position: "absolute", left: 16 }}
      />
      <Text className="font-semibold text-body text-content">{LABELS[provider]}</Text>
    </Pressable>
  );
}
