import { Image, SectionList, Text, TouchableOpacity, View } from "react-native";

import Logo from "@/assets/logo.png";
import { useState } from "react";
import { DocumentsList } from "@/components/DocumentsList";

export type DocumentsProps = {
  id: string;
  name: string;
  model: string;
  plate: string;
  retentionPark: string;
};

type DocumentsListProps = {
  date: string;
  data: DocumentsProps[];
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
        renderItem={({ item }) => <DocumentsList data={item} />}
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
