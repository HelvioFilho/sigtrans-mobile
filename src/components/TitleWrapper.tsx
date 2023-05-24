import { Text, View } from "react-native";

type TitleWrapperProps = {
  title: string;
};

export function TitleWrapper({ title }: TitleWrapperProps) {
  return (
    <View className="flex-row items-center">
      <View className="flex-grow h-[2px] bg-gray-400" />
      <View className="border-2 border-gray-400 px-4 py-3 rounded">
        <Text className="font-bold text-subtitle">{title}</Text>
      </View>
      <View className="flex-grow h-[2px] bg-gray-400" />
    </View>
  );
}
