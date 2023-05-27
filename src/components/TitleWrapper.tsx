import { Text, View, ViewProps } from "react-native";

type TitleWrapperProps = ViewProps & {
  title: string;
};

export function TitleWrapper({ title, ...rest }: TitleWrapperProps) {
  return (
    <View className="flex-row items-center" {...rest}>
      <View className="flex-grow h-[2px] bg-gray-400" />
      <View className="border-2 border-gray-400 px-4 py-3 rounded">
        <Text className="font-bold text-subtitle">{title}</Text>
      </View>
      <View className="flex-grow h-[2px] bg-gray-400" />
    </View>
  );
}
