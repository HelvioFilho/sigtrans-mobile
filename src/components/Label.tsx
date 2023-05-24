import { Text } from "react-native";
import { View } from "react-native";

type LabelProps = {
  title: string;
  type?: "first" | "last" | "default";
  children: React.ReactNode;
};

export function Label({ title, type = "default", children }: LabelProps) {
  let position = "";
  switch (type) {
    case "first":
      position = "pt-8 px-4";
      break;
    case "last":
      position = "pt-3 pb-8 px-4";
      break;
    default:
      position = "pt-3 px-4";
      break;
  }

  return (
    <View className={position}>
      <Text className="font-bold text-base">{title}</Text>
      {children}
    </View>
  );
}
