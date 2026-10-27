import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type IllustrationKind = "habit" | "ai" | "challenge" | "privacy";

type IllustrationProps = {
  kind: IllustrationKind;
  height?: number;
};

const CONFIG: Record<
  IllustrationKind,
  { icon: keyof typeof Ionicons.glyphMap; chip: string; ringCount: number }
> = {
  habit: { icon: "flame", chip: "12-day streak", ringCount: 3 },
  ai: { icon: "body", chip: "12 reps · Live", ringCount: 3 },
  challenge: { icon: "trophy", chip: "Global · Top 8%", ringCount: 3 },
  privacy: { icon: "lock-closed", chip: "On-device only", ringCount: 2 },
};

/**
 * Geometric placeholder art for onboarding.
 * Replace with Lottie/illustrations in a later milestone (see DESIGN.md §11).
 */
export function Illustration({ kind, height = 280 }: IllustrationProps) {
  const { icon, chip, ringCount } = CONFIG[kind];

  return (
    <View
      className="w-full items-center justify-center self-center"
      style={{ height }}
      accessibilityElementsHidden
    >
      {Array.from({ length: ringCount }, (_, i) => {
        const size = 180 + i * 44;
        return (
          <View
            key={i}
            className="absolute rounded-full border-[1.5px] border-primary"
            style={{ width: size, height: size, opacity: 0.18 - i * 0.05 }}
          />
        );
      })}
      <View className="h-[150px] w-[150px] items-center justify-center rounded-full border border-line bg-surface">
        <Ionicons name={icon} size={72} color="#39FF14" />
      </View>
      <View className="absolute bottom-6 flex-row items-center gap-2 rounded-full border border-line bg-surface px-3 py-2">
        <View className="h-2 w-2 rounded-full bg-primary" />
        <Text className="font-semibold text-caption text-content">{chip}</Text>
      </View>
    </View>
  );
}
