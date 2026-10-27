import { Text, View } from "react-native";

import { glow } from "@/constants/theme";

type LogoProps = {
  size?: number;
  showWordmark?: boolean;
  showTagline?: boolean;
  glowing?: boolean;
};

export function Logo({ size = 96, showWordmark = true, showTagline = false, glowing = false }: LogoProps) {
  return (
    <View className="items-center gap-3">
      <View
        className={[
          "items-center justify-center border-2 border-primary bg-primary-dim",
          glowing ? "" : "",
        ].join(" ")}
        style={[
          { width: size, height: size, borderRadius: size * 0.28 },
          glowing ? glow : undefined,
        ]}
      >
        <Text
          className="font-extrabold text-primary"
          style={{ fontSize: size * 0.58 }}
        >
          R
        </Text>
      </View>
      {showWordmark ? (
        <Text className="font-extrabold text-display text-primary">RepUp</Text>
      ) : null}
      {showTagline ? (
        <Text className="mt-1 text-center font-semibold text-caption text-content-muted">
          Better You{"\n"}One Push-Up at a Time
        </Text>
      ) : null}
    </View>
  );
}
