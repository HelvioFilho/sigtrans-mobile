import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

type ButtonProps = TouchableOpacityProps & {
  title: string;
  color?: string;
};

export function Button({ color = "bg-blue-500", title, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      className={`w-full p-2.5 justify-center items-center ${color} rounded-md`}
      activeOpacity={0.8}
      {...rest}
    >
      <Text className="text-white text-base">{title}</Text>
    </TouchableOpacity>
  );
}
