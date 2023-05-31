import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

type EditInformationProps = {
  title: string;
  refName?: string;
  id?: number;
  isEditable?: boolean;
};

export function EditInformation({
  title,
  id = 0,
  isEditable = true,
}: EditInformationProps) {
  const { navigate } = useNavigation();
  const navi = id === 0 ? "First" : "Second";
  return (
    <View className="flex-row justify-between">
      <Text className="text-base">{title}</Text>
      {isEditable && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigate(navi);
          }}
        >
          <Feather name="edit" size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
}
