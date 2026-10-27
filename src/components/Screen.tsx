import { type ReactNode } from "react";
import { View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenProps = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  /** default true — respects top safe area */
  paddingTop?: boolean;
  /** default false — pins bottom safe padding */
  paddingBottom?: boolean;
  testID?: string;
};

export function Screen({
  children,
  style,
  paddingTop = true,
  paddingBottom = false,
  testID,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      testID={testID}
      className="flex-1 bg-bg px-6"
      style={[
        {
          paddingTop: paddingTop ? insets.top + 12 : 0,
          paddingBottom: paddingBottom ? insets.bottom + 16 : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
