import { DocumentsProps } from "@/screens/Home";
import { Text, TouchableOpacity, View } from "react-native";

type DocumentsListProps = {
  data: DocumentsProps;
  onPress: () => void;
};

export function DocumentsList({ data, onPress }: DocumentsListProps) {
  return (
    <TouchableOpacity className="my-1.5" activeOpacity={0.8} onPress={onPress}>
      <View className="w-full bg-gray-300 py-3 px-4 rounded-lg">
        <View className="flex-row items-center py-1">
          <Text className="font-bold text-base">Agente: </Text>
          <Text className="font-regular text-base">{data.name}</Text>
        </View>
        <View className="flex-row gap-4">
          <View className="flex-row items-center">
            <Text className="font-bold text-base">Modelo: </Text>
            <Text className="font-regular text-base">{data.model}</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="font-bold text-base">Placa: </Text>
            <Text className="font-regular text-base">{data.plate}</Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <Text className="font-bold text-base">Parque de Retenção: </Text>
          <Text className="font-regular text-base">{data.retentionPark}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
