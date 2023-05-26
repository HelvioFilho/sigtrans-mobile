import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacityProps } from "react-native";

type OptionButtonProps = TouchableOpacityProps & {
  title: string;
  color: string;
  iconName: "trash" | "save" | "arrow-forward-circle-outline";
};

export function OptionButton({
  title,
  color,
  iconName,
  ...rest
}: OptionButtonProps) {
  return (
    <View className="w-[45%]">
      <TouchableOpacity
        className={`
          ${color} 
          flex-row 
          w-full 
          h-12
          my-2 
          px-4 
          justify-between 
          items-center 
          rounded-lg
          `}
        activeOpacity={0.8}
        {...rest}
      >
        <Text className="font-bold text-base text-white">{title}</Text>
        <Ionicons name={iconName} size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
