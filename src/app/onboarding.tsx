import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
  type ListRenderItemInfo,
  type ViewToken,
} from "react-native";
import { router } from "expo-router";

import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { Dots } from "@/components/Dots";
import { Illustration, type IllustrationKind } from "@/components/Illustration";
import { setOnboarded } from "@/lib/storage";

type Step = {
  kind: IllustrationKind;
  title: string;
  body: string;
  cta: string;
};

const STEPS: Step[] = [
  {
    kind: "habit",
    title: "Get Stronger Every Day",
    body: "Track your push-ups, build healthy habits and reach your goals.",
    cta: "Next",
  },
  {
    kind: "ai",
    title: "AI-Powered Push-Up Counter",
    body: "Our AI detects your body position and counts only real push-ups.",
    cta: "Next",
  },
  {
    kind: "challenge",
    title: "Challenges & Global Competition",
    body: "Join daily challenges, earn rewards and compete with people worldwide.",
    cta: "Next",
  },
  {
    kind: "privacy",
    title: "Your Privacy Our Priority",
    body: "Your data, progress and videos stay on your device. No accounts, no cloud (optional).",
    cta: "Get Started",
  },
];

const VIEW_CONFIG = { viewAreaCoveragePercentThreshold: 60 };

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [completing, setCompleting] = useState(false);
  const listRef = useRef<FlatList<Step>>(null);
  const isLast = index === STEPS.length - 1;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0];
      if (first?.index != null) setIndex(first.index);
    },
    [],
  );

  const skip = useCallback(async () => {
    await setOnboarded();
    router.replace("/login");
  }, []);

  const next = useCallback(async () => {
    if (isLast) {
      setCompleting(true);
      await setOnboarded();
      router.replace("/login");
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  }, [index, isLast]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Step>) => (
      <View className="flex-1 items-center justify-center px-6" style={{ width }}>
        <Illustration kind={item.kind} />
        <View className="mt-8 items-center max-w-content">
          <Text className="text-center font-extrabold text-title text-content">{item.title}</Text>
          <Text className="mt-3 text-center font-regular text-body text-content-muted">{item.body}</Text>
        </View>
      </View>
    ),
    [width],
  );

  return (
    <Screen paddingBottom testID="onboarding-screen">
      <View className="h-11 items-end justify-center">
        {!isLast ? (
          <Pressable
            onPress={skip}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            className="min-h-11 justify-center px-2"
          >
            <Text className="font-semibold text-caption text-content-muted">Skip</Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        ref={listRef}
        data={STEPS}
        keyExtractor={(item) => item.kind}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEW_CONFIG}
        renderItem={renderItem}
        className="flex-1"
        style={{ marginHorizontal: -24 }}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
      />

      <View className="gap-5 pb-4">
        <Dots count={STEPS.length} activeIndex={index} />
        <Button label={STEPS[index].cta} onPress={next} loading={completing} testID="onboarding-cta" />
      </View>
    </Screen>
  );
}
