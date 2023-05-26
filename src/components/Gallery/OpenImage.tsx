import { Image, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OptionButton } from "./OptionButton";

type OpenImageProps = {
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  uri: string;
};

export function OpenImage({ onClose, onSave, onDelete, uri }: OpenImageProps) {
  return (
    <View className="flex-1 justify-center items-center bg-black/95">
      <TouchableOpacity
        className="absolute right-1 top-1 w-12 h-12 justify-center items-center rounded-lg z-40"
        activeOpacity={0.8}
        onPress={() => onClose()}
      >
        <Ionicons name="close-circle-outline" size={28} color="white" />
      </TouchableOpacity>
      <View className="flex-1 w-[100%]">
        <Image
          source={{ uri }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>
      <View className="flex-row justify-around w-full mb-4">
        <OptionButton
          title="Salvar"
          color="bg-teal-600"
          iconName="save"
          onPress={onSave}
        />
        <OptionButton
          title="Apagar"
          color="bg-red-600"
          iconName="trash"
          onPress={onDelete}
        />
      </View>
    </View>
  );
}
