import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IconButton = {
  iconName: "search" | "add" | "location-sharp" | "trash";
  isLoading?: boolean;
  color?: string;
  onSubmit: () => void;
};

export function IconButton({
  iconName,
  isLoading = false,
  color = "bg-teal-600",
  onSubmit,
}: IconButton) {
  const bgColor = isLoading ? "bg-slate-500" : color;
  return (
    <TouchableOpacity
      className={`
        ${bgColor}
        absolute 
        right-0 
        w-12 
        h-12 
        justify-center 
        items-center 
        rounded-md
      `}
      activeOpacity={0.8}
      disabled={isLoading}
      onPress={onSubmit}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Ionicons name={iconName} size={28} color="white" />
      )}
    </TouchableOpacity>
  );
}
