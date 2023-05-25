import { useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SelectProps = {
  target: string;
  type: string;
  data: {
    id: string;
    name: string;
  }[];
  onPress: (data: string[], value: string[], target: string) => void;
  onClose: () => void;
};

export function Select({ target, type, data, onPress, onClose }: SelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState(data);

  function handleSearch(text: string) {
    setSearchTerm(text);

    if (text === "") return setFiltered(data);

    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filtered);
  }

  return (
    <View className="flex-1 px-4 pt-[10%] bg-slate-50">
      <TouchableOpacity
        className="h-10 w-10 absolute top-5 right-2 z-50"
        activeOpacity={0.8}
        onPress={onClose}
      >
        <Ionicons name="close-circle-outline" size={33} color="black" />
      </TouchableOpacity>
      <Text className="text-subtitle font-bold mt-2 w-[90%]">
        Selecione abaixo ou efetue uma busca pelo nome:
      </Text>
      <TextInput
        placeholder="Pesquise pelo nome"
        className="bg-gray-100
        border-2
        border-gray-600
        rounded-md
        py-3
        px-4
        w-full
        font-regular
        text-input
        my-5
        "
        value={searchTerm}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 50 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="border p04 my-2 rounded-lg bg-white"
            activeOpacity={0.8}
            onPress={() => onPress([type], [item.name], target)}
          >
            <View className="w-full bg-gray-300 py-3 px-4 rounded-lg">
              <View className="flex-row items-center py-1">
                <Text className="font-regular text-base">{item.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
