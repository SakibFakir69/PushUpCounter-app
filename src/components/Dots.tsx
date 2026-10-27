import { View } from "react-native";

type DotsProps = {
  count: number;
  activeIndex: number;
};

export function Dots({ count, activeIndex }: DotsProps) {
  return (
    <View
      className="flex-row items-center justify-center gap-1.5"
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: count, now: activeIndex + 1 }}
    >
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          className={i === activeIndex ? "h-2 w-5 rounded-full bg-primary" : "h-2 w-2 rounded-full bg-line"}
        />
      ))}
    </View>
  );
}
