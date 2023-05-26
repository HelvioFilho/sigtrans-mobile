import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";

type CameraOrGalleryProps = {
  onClose: () => void;
  onPress: (fromCamera: boolean) => void;
};

export function CameraOrGallery({ onClose, onPress }: CameraOrGalleryProps) {
  return (
    <View className="flex-1 justify-center items-center bg-black/50">
      <View className="flex-row w-[70%] bg-white rounded-md justify-around pt-11 pb-7 px-4">
        <TouchableOpacity
          className="absolute right-1 top-1 w-8 h-8 justify-center items-center rounded-lg"
          activeOpacity={0.8}
          onPress={() => onClose()}
        >
          <Ionicons name="close-circle-outline" size={28} color="black" />
        </TouchableOpacity>
        <View>
          <Text className="font-bold text-base pb-4">Câmera</Text>
          <TouchableOpacity
            className="bg-teal-600 w-16 h-16 justify-center items-center rounded-lg"
            activeOpacity={0.8}
            onPress={() => onPress(true)}
          >
            <Ionicons name="camera" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View>
          <Text className="font-bold text-base pb-4">Galeria</Text>
          <TouchableOpacity
            className="bg-teal-600 w-16 h-16 justify-center items-center rounded-lg"
            activeOpacity={0.8}
            onPress={() => onPress(false)}
          >
            <Ionicons name="images" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
