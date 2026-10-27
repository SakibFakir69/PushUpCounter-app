import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
};

export function AuthHeader({ title, subtitle, showBack = true, onBack }: AuthHeaderProps) {
  return (
    <View className="mb-8">
      {showBack ? (
        <Pressable
          hitSlop={12}
          onPress={onBack ?? (() => router.back())}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="-ml-2 mb-6 h-11 w-11 items-center justify-center rounded-full bg-surface"
        >
          <Ionicons name="chevron-back" size={22} color="#E5E7EB" />
        </Pressable>
      ) : null}
      <Text className="text-center font-extrabold text-title text-content">{title}</Text>
      {subtitle ? (
        <Text className="mt-2 text-center font-regular text-body text-content-muted">{subtitle}</Text>
      ) : null}
    </View>
  );
}
