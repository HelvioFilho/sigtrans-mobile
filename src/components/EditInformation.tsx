import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useReviewStore } from "@/stores/reviewStore";

type EditInformationProps = {
  title: string;
  refName?: string;
  id?: number;
  isEditable?: boolean;
};

export function EditInformation({
  title,
  refName,
  id = 0,
  isEditable = true,
}: EditInformationProps) {
  const { navigate } = useNavigation();
  const { setRefData } = useReviewStore();
  return (
    <View className="flex-row justify-between">
      <Text className="text-base">{title}</Text>
      {isEditable && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setRefData(refName);
            navigate("New", { id });
          }}
        >
          <Feather name="edit" size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
}
