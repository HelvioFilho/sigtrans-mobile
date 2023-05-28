import { ActivityIndicator, View } from "react-native";

export function Loading() {
  return (
    <View className="flex-1 items-center justify-center bg-[#1D2274]">
      <ActivityIndicator color="white" />
    </View>
  );
}
