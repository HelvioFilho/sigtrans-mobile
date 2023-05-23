import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function Search() {
  const [search, setSearch] = useState("");
  return (
    <View className="flex-1 pt-[20%] px-4 bg-slate-50">
      <Text className="font-bold text-md">Faça sua pesquisa</Text>
      <View className="flex-row gap-1">
        <TextInput
          className="bg-gray-100 border-2 h-12 rounded-md py-3 px-4 w-[85%] font-regular text-input"
          onChangeText={setSearch}
          value={search}
        />
        <TouchableOpacity className="w-12 h-12 bg-teal-600 justify-center items-center rounded-md">
          <Ionicons name="search" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
