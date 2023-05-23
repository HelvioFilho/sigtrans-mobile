import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputField } from "@/components/InputField";

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
      <InputField
        name="search"
        control={control}
        error={errors && (errors.search?.message as string)}
        placeholder="Exemplo de busca: 23/02/2023"
        icon={
          <TouchableOpacity
            className="absolute right-0 w-12 h-12 bg-teal-600 justify-center items-center rounded-md"
            onPress={handleSubmit(handleSearch)}
          >
            <Ionicons name="search" size={28} color="white" />
          </TouchableOpacity>
        }
      />
    </View>
  );
}
