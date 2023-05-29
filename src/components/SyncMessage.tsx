import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
type SyncMessageProps = {
  message: string;
};
export function SyncMessage({ message }: SyncMessageProps) {
  return (
    <View
      className={`
        w-full 
        absolute  
        py-1 
        top-0 
        left-0 
        z-50 
        flex-row 
        justify-center 
        items-center 
        bg-teal-600
        rounded-b-3xl
      `}
    >
      <MaterialCommunityIcons
        name="cloud-sync-outline"
        size={19}
        color="white"
      />
      <Text className="font-regular text-sm text-white ml-2">{message}</Text>
    </View>
  );
}
