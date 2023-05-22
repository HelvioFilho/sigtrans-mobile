import { Image, SectionList, Text, TouchableOpacity, View } from "react-native";

import Logo from "@/assets/logo.png";
import { useState } from "react";

type HomeProps = {
  id: string;
  name: string;
  model: string;
  plate: string;
  retentionPark: string;
};

type DocumentsListProps = {
  date: string;
  data: HomeProps[];
};

export function Home() {
  const [documents, setDocuments] = useState<DocumentsListProps[]>([
    {
      date: "22/05/2023",
      data: [
        {
          id: "1",
          name: "João",
          model: "Fiat",
          plate: "ABC-1234",
          retentionPark: "São Paulo",
        },
        {
          id: "2",
          name: "Maria",
          model: "Gol",
          plate: "DEF-5678",
          retentionPark: "São Paulo",
        },
      ],
    },
    {
      date: "21/05/2023",
      data: [
        {
          id: "3",
          name: "Miguel",
          model: "Corsa",
          plate: "GHI-9012",
          retentionPark: "São Paulo",
        },
      ],
    },
  ]);
  return (
    <View className="flex-1 px-4 pt-5 bg-slate-50">
      <View className="flex-row mt-[10%] items-end">
        <Image className="h-[50px] w-[50px] rounded-md" source={Logo} />
        <Text className="font-bold text-title ml-4">Lista de Documentos</Text>
      </View>
      <SectionList
        sections={documents}
        keyExtractor={(item) => item.id}
        className="my-5"
        renderItem={({ item }) => (
          <TouchableOpacity
            className="my-1.5"
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <View className="w-full bg-gray-300 py-3 px-4 rounded-lg">
              <View className="flex-row items-center py-1">
                <Text className="font-bold text-base">Agente: </Text>
                <Text className="font-regular text-base">{item.name}</Text>
              </View>
              <View className="flex-row gap-4">
                <View className="flex-row items-center">
                  <Text className="font-bold text-base">Modelo: </Text>
                  <Text className="font-regular text-base">{item.model}</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="font-bold text-base">Placa: </Text>
                  <Text className="font-regular text-base">{item.plate}</Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <Text className="font-bold text-base">
                  Parque de Retenção:{" "}
                </Text>
                <Text className="font-regular text-base">
                  {item.retentionPark}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section: { date } }) => (
          <View className="py-3 justify-center items-center">
            <Text className="font-bold tracking-widest text-base">{date}</Text>
          </View>
        )}
      />
    </View>
  );
}
