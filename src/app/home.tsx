import { Text, View } from "react-native";
import { router } from "expo-router";

import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/auth";

/**
 * Minimal authenticated landing — closes the auth loop.
 * Full dashboard (stats, challenge card, quick actions) is a later milestone.
 */
export default function Home() {
  const { session, signOut } = useAuth();

  return (
    <Screen paddingBottom testID="home-screen">
      <View className="flex-row items-center justify-between">
        <Logo size={56} showWordmark={false} />
        <View className="flex-row items-center gap-2 rounded-full bg-primary-dim px-3 py-2">
          <Text className="text-sm">🔥</Text>
          <Text className="font-semibold text-caption text-primary">12 day streak</Text>
        </View>
      </View>

      <View className="flex-1 justify-center">
        <Text className="font-regular text-body text-content-muted">Good Morning,</Text>
        <Text className="mt-1 font-extrabold text-display text-content">
          {session?.name ?? "Athlete"}
        </Text>
        <Text className="mt-4 max-w-[280px] font-regular text-body text-content-muted">
          Dashboard, workout camera and challenges land here next.
        </Text>
      </View>

      <Button
        label="Sign Out"
        variant="outline"
        onPress={async () => {
          await signOut();
          router.replace("/login");
        }}
        testID="home-signout"
      />
    </Screen>
  );
}
