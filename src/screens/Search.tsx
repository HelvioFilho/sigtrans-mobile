import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

type FormData = {
  search: string;
};

const schema = Yup.object().shape({
  search: Yup.string()
    .min(4, "Precisa ter no mínimo 4 caracteres")
    .required("A busca não pode ser vazia"),
});

export function Search() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function handleSearch({ search }: Partial<FormData>) {
    try {
      console.log(search);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View className="flex-1 pt-[20%] px-4 bg-slate-50">
      <Text className="font-bold text-md">Faça sua pesquisa</Text>
      <View className="flex-row gap-1">
        <Controller
          control={control}
          name="search"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="bg-gray-100 border-2 h-12 rounded-md py-3 px-4 w-[85%] font-regular text-input"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <TouchableOpacity
          className="w-12 h-12 bg-teal-600 justify-center items-center rounded-md"
          onPress={handleSubmit(handleSearch)}
        >
          <Ionicons name="search" size={28} color="white" />
        </TouchableOpacity>
      </View>
      {errors && (
        <Text className="text-red-600">{errors.search?.message as string}</Text>
      )}
    </View>
  );
}
