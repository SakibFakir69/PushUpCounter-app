import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, View } from "react-native";
import { router } from "expo-router";

import { Screen } from "@/components/Screen";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/auth";
import { isOnboarded } from "@/lib/storage";

const SPLASH_DURATION = 1800;

export default function Splash() {
  const { status } = useAuth();
  const progress = useMemo(() => new Animated.Value(0), []);
  const opacity = useMemo(() => new Animated.Value(0), []);
  const navigated = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: SPLASH_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  }, [opacity, progress]);

  // Route once progress finishes AND auth status is resolved.
  useEffect(() => {
    if (!ready || status === "loading" || navigated.current) return;

    const listener = progress.addListener(({ value }) => {
      if (value < 0.999 || navigated.current) return;
      navigated.current = true;
      (async () => {
        const onboarded = await isOnboarded();
        if (!onboarded) {
          router.replace("/onboarding");
        } else if (status === "signedIn") {
          router.replace("/home");
        } else {
          router.replace("/login");
        }
      })();
    });
    return () => progress.removeListener(listener);
  }, [progress, ready, status]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Screen paddingBottom testID="splash-screen">
      <View className="flex-1 items-center justify-center">
        <Animated.View style={{ opacity }}>
          <Logo size={112} showWordmark showTagline glowing />
        </Animated.View>
      </View>
      <View className="mb-4 h-[3px] overflow-hidden rounded-full bg-surface-elevated">
        <Animated.View
          className="h-full rounded-full bg-primary"
          style={{ width }}
          onLayout={() => setReady(true)}
        />
      </View>
    </Screen>
  );
}
